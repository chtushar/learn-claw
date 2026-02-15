import Anthropic from '@anthropic-ai/sdk'
import { ScriptSchema, type Script } from './types'

const SYSTEM_PROMPT = `You are a screenwriter for short-form educational videos (TikTok/Reels style, 30-45 seconds).

Your job is ONLY to write the narrative script — no visual decisions.

STRUCTURE:
- 3-4 sections that flow: hook → build → climax → takeaway
- Each section has a title (2-4 words), a narration line, a key topic, and an icon emoji

NARRATION RULES:
- Exactly 1 sentence per section, max 15 words
- Punchy, confident narrator voice — not a textbook
- You may use **bold** for 1-2 key terms per sentence

OUTPUT:
- topic: the topic
- summary: one-sentence elevator pitch
- sections: array of 3-4 sections with { title, narration, keyTopic, iconEmoji }`

export async function generateScript(topic: string): Promise<Script> {
  const client = new Anthropic()

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Write a script for a short explainer video about: ${topic}`,
      },
    ],
    tools: [
      {
        name: 'write_script',
        description:
          'Output the structured script for a short-form educational video',
        input_schema: {
          type: 'object' as const,
          properties: {
            topic: { type: 'string', description: 'The topic of the video' },
            summary: {
              type: 'string',
              description: 'One-sentence elevator pitch',
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
                    description: '1 punchy sentence, max 15 words',
                  },
                  keyTopic: {
                    type: 'string',
                    description: 'The key concept this section covers',
                  },
                  iconEmoji: {
                    type: 'string',
                    description: 'A single emoji representing this section',
                  },
                },
                required: ['title', 'narration', 'keyTopic', 'iconEmoji'],
              },
            },
          },
          required: ['topic', 'summary', 'sections'],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'write_script' },
  })

  const toolUseBlock = response.content.find(
    (block) => block.type === 'tool_use',
  )
  if (!toolUseBlock || toolUseBlock.type !== 'tool_use') {
    throw new Error('Script Agent: unexpected response format from Claude')
  }

  return ScriptSchema.parse(toolUseBlock.input)
}
