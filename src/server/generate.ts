import { createServerFn } from '@tanstack/react-start'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { VideoDataSchema } from '@/lib/schema'

const SYSTEM_PROMPT = `You are an educational content designer. Your job is to take a topic and produce structured content for an animated explainer video.

Rules:
- Break the topic into 4-6 logical sections that build on each other.
- Each section should have a clear title, 3-5 concise key points (max 12 words each), a narration paragraph (2-3 sentences, conversational tone, as if explaining to a curious friend), a visual description, and an emoji icon.
- Assign a durationWeight to each section: 1 for brief, 2 for standard, 3 for complex sections.
- The first section should be an introduction/overview.
- The last section should be a summary/recap.
- Write the summary field as a one-sentence elevator pitch.
- Keep language accessible -- assume the viewer is an intelligent beginner.
- totalDurationEstimate: suggested video length in seconds (60-120).

NARRATION FORMATTING:
- You may use **bold** for key terms and \`backticks\` for code/technical terms in narration text.
- Keep formatting minimal -- this renders in a video, not a document.

DIAGRAMS:
- For 2-3 sections (not all), include a Mermaid diagram that visualizes the concept.
- Use sceneType "diagram" for sections where the visual is the main content (full-width diagram with title only).
- Use sceneType "split" for sections that benefit from both text bullets AND a diagram side by side.
- Use sceneType "text" for sections that are best explained with just text and bullet points.
- The first (intro) and last (recap) sections should typically be sceneType "text".
- Diagram types: "flowchart" for processes, "sequence" for interactions, "graph" for relationships, "mindmap" for concept maps.
- Keep Mermaid syntax simple and correct. Use short node labels (max 4 words per node).
- Do NOT use special characters, parentheses, or HTML in Mermaid node labels. Use square brackets for node labels like A[Label Here].
- Always use graph TD or graph LR direction syntax for flowcharts.
- For sequence diagrams, keep to 3-5 participants maximum.
- Include a brief caption describing what the diagram shows.`

export const generateVideo = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ topic: z.string().min(1).max(200) }))
  .handler(async ({ data }) => {
    const client = new Anthropic()

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Create an explainer video about: ${data.topic}`,
        },
      ],
      tools: [
        {
          name: 'generate_video_data',
          description:
            'Generate structured video data for an educational explainer video with diagrams',
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
                description: 'Suggested video length in seconds',
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
                        'Layout: text for bullets only, diagram for full-width diagram, split for side-by-side text and diagram',
                    },
                    diagram: {
                      type: 'object',
                      description:
                        'Optional Mermaid diagram. Required when sceneType is diagram or split.',
                      properties: {
                        type: {
                          type: 'string',
                          enum: ['flowchart', 'sequence', 'mindmap', 'graph'],
                          description: 'The type of diagram',
                        },
                        mermaidCode: {
                          type: 'string',
                          description:
                            'Valid Mermaid diagram code. Use simple syntax, short labels, no HTML, no special characters in labels.',
                        },
                        caption: {
                          type: 'string',
                          description:
                            'Brief description of what the diagram shows',
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

    const parsed = VideoDataSchema.parse(toolUseBlock.input)
    return parsed
  })
