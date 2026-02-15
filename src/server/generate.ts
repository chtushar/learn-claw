import { createServerFn } from '@tanstack/react-start'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { VideoDataSchema } from '@/lib/schema'
import { synthesizeSpeech } from './elevenlabs'
import type { GenerateResponse } from '@/lib/schema'

const SYSTEM_PROMPT = `You are an educational content designer creating short-form vertical video content (TikTok/Reels style).

Rules:
- Break the topic into 3-4 concise sections that build on each other.
- Each section should have a clear title, 2-3 punchy key points (max 8 words each), a narration of 1-2 sentences (conversational, as if explaining to a friend), a visual description, and an emoji icon.
- Assign a durationWeight to each section: 1 for brief, 2 for standard.
- The first section should be a hook/introduction.
- The last section should be a quick takeaway/recap.
- Write the summary field as a one-sentence elevator pitch.
- Keep language accessible and energetic -- this is short-form content.
- totalDurationEstimate: 30-60 seconds.

NARRATION FORMATTING:
- You may use **bold** for key terms and \`backticks\` for code/technical terms.
- Keep it minimal -- this is narrated aloud in a video.

DIAGRAMS:
- For 1-2 sections (not all), include a Mermaid diagram.
- Use sceneType "diagram" for visual-heavy content (full-width diagram with title only).
- Use sceneType "split" for sections that benefit from both text AND a diagram.
- Use sceneType "text" for sections best explained with just bullet points.
- Diagram types: "flowchart" for processes, "sequence" for interactions, "graph" for relationships, "mindmap" for concept maps.
- Keep Mermaid syntax simple and correct. Use short node labels (max 4 words per node).
- Do NOT use special characters, parentheses, or HTML in Mermaid node labels.
- Always use graph TD or graph LR direction syntax for flowcharts.
- For sequence diagrams, keep to 3-4 participants maximum.`

export const generateVideo = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ topic: z.string().min(1).max(200) }))
  .handler(async ({ data }): Promise<GenerateResponse> => {
    const client = new Anthropic()

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Create a short explainer video about: ${data.topic}`,
        },
      ],
      tools: [
        {
          name: 'generate_video_data',
          description:
            'Generate structured video data for a short-form educational explainer video',
          input_schema: {
            type: 'object' as const,
            properties: {
              topic: { type: 'string', description: 'The topic of the video' },
              summary: {
                type: 'string',
                description: 'One-sentence elevator pitch',
              },
              totalDurationEstimate: {
                type: 'number',
                description: 'Suggested video length in seconds (30-60)',
              },
              sections: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    narration: { type: 'string' },
                    keyPoints: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    visualDescription: { type: 'string' },
                    iconEmoji: { type: 'string' },
                    durationWeight: { type: 'number' },
                    sceneType: {
                      type: 'string',
                      enum: ['text', 'diagram', 'split'],
                      description:
                        'Layout: text for bullets only, diagram for full-width diagram, split for stacked text and diagram',
                    },
                    diagram: {
                      type: 'object',
                      description:
                        'Optional Mermaid diagram. Required when sceneType is diagram or split.',
                      properties: {
                        type: {
                          type: 'string',
                          enum: ['flowchart', 'sequence', 'mindmap', 'graph'],
                        },
                        mermaidCode: {
                          type: 'string',
                          description:
                            'Valid Mermaid diagram code. Use simple syntax, short labels, no HTML.',
                        },
                        caption: {
                          type: 'string',
                          description: 'Brief caption for the diagram',
                        },
                      },
                      required: ['type', 'mermaidCode'],
                    },
                  },
                  required: [
                    'title',
                    'narration',
                    'keyPoints',
                    'visualDescription',
                    'iconEmoji',
                    'durationWeight',
                    'sceneType',
                  ],
                },
              },
            },
            required: [
              'topic',
              'summary',
              'totalDurationEstimate',
              'sections',
            ],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'generate_video_data' },
    })

    const toolUseBlock = response.content.find(
      (block) => block.type === 'tool_use',
    )
    if (!toolUseBlock || toolUseBlock.type !== 'tool_use') {
      throw new Error('Unexpected response format from Claude')
    }

    const videoData = VideoDataSchema.parse(toolUseBlock.input)

    // Generate TTS audio for each section in parallel
    const audioSegments = await Promise.all(
      videoData.sections.map(async (section, index) => {
        const { base64Audio, durationMs } = await synthesizeSpeech(
          section.narration,
        )
        return { sectionIndex: index, base64Audio, durationMs }
      }),
    )

    return { videoData, audioSegments }
  })
