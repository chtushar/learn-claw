import Anthropic from '@anthropic-ai/sdk'
import { VideoDataSchema, type VideoData } from '@/lib/schema'
import { loadRemotionSkills } from './loadSkills'
import type { Script } from './types'

const BASE_SYSTEM_PROMPT = `You are a Remotion video director. Given a script, plan the visual scenes for a short-form vertical video (1080x1920, TikTok/Reels style).

GOLDEN RULES:
- You receive a script with 3-4 sections. For each section, decide the visual treatment.
- At least 2 out of 3-4 sections MUST have a diagram (sceneType "diagram").
- Do NOT use sceneType "split". Only use "text" or "diagram".
- Diagrams ARE the content. The narration is just voice-over context.

SCENE TYPES:
- sceneType "text": A bold, cinematic statement. No diagram. Use for intro hook or closing takeaway.
- sceneType "diagram": Full-screen diagram. This is the default. Use for everything visual.

DIAGRAMS:
- Use "flowchart" for processes/steps, "sequence" for interactions, "graph" for relationships, "mindmap" for concept overviews.
- Keep Mermaid syntax simple. Short node labels (max 3 words). No special characters or HTML.
- Use graph TD or graph LR. Max 8 nodes.
- For sequence diagrams, max 3 participants.

OUTPUT:
- topic, summary, totalDurationEstimate (30-45s)
- sections: array matching the script's sections, each with: title, narration, keyPoints (empty []), visualDescription, iconEmoji, durationWeight (1), sceneType, and diagram (for diagram scenes)`

export async function planSlides(script: Script): Promise<VideoData> {
  const skills = loadRemotionSkills()
  const systemPrompt = BASE_SYSTEM_PROMPT + skills

  const client = new Anthropic()

  const scriptDescription = script.sections
    .map(
      (s, i) =>
        `Section ${i + 1}: "${s.title}" — Narration: "${s.narration}" (Key topic: ${s.keyTopic}, Icon: ${s.iconEmoji})`,
    )
    .join('\n')

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Plan the visual scenes for this video script.

Topic: ${script.topic}
Summary: ${script.summary}

Script sections:
${scriptDescription}

For each section, decide whether it should be a "text" scene or "diagram" scene, and write the Mermaid diagram code for diagram scenes. Remember: at least 2 sections must have diagrams.`,
      },
    ],
    tools: [
      {
        name: 'plan_video_scenes',
        description:
          'Output structured video scene data compatible with the Remotion player',
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
              description: 'Suggested video length in seconds (30-45)',
            },
            sections: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: 'Short title, 2-4 words',
                  },
                  narration: {
                    type: 'string',
                    description: 'The narration from the script',
                  },
                  keyPoints: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Always an empty array []',
                  },
                  visualDescription: { type: 'string' },
                  iconEmoji: { type: 'string' },
                  durationWeight: { type: 'number' },
                  sceneType: {
                    type: 'string',
                    enum: ['text', 'diagram'],
                    description:
                      'text for bold statement scenes, diagram for full-screen diagram scenes. Prefer diagram.',
                  },
                  diagram: {
                    type: 'object',
                    description:
                      'Required when sceneType is diagram. Full-screen Mermaid diagram.',
                    properties: {
                      type: {
                        type: 'string',
                        enum: ['flowchart', 'sequence', 'mindmap', 'graph'],
                      },
                      mermaidCode: {
                        type: 'string',
                        description:
                          'Valid Mermaid code. Short labels, no HTML, no special chars.',
                      },
                      caption: {
                        type: 'string',
                        description: 'One-line caption',
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
          required: ['topic', 'summary', 'totalDurationEstimate', 'sections'],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'plan_video_scenes' },
  })

  const toolUseBlock = response.content.find(
    (block) => block.type === 'tool_use',
  )
  if (!toolUseBlock || toolUseBlock.type !== 'tool_use') {
    throw new Error('Slides Agent: unexpected response format from Claude')
  }

  return VideoDataSchema.parse(toolUseBlock.input)
}
