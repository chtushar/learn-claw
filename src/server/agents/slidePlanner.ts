import Anthropic from '@anthropic-ai/sdk'
import { VideoDataSchema, type VideoData } from '@/lib/schema'
import { loadRemotionSkills } from './loadSkills'
import type { Script } from './types'

const BASE_SYSTEM_PROMPT = `You are a Remotion video director. Given a script, plan the visual scenes for a short-form vertical video (1080x1920, TikTok/Reels style).

GOLDEN RULES:
- You receive a script with 3-4 sections. For each section, decide the visual treatment.
- Do NOT use sceneType "split". Only use "text", "diagram", "code", "math", or "chart".
- Visuals ARE the content. The narration is just voice-over context.
- The LAST section (closing/summary/takeaway) should almost always be "text" — end on a bold statement, not a visual.
- Only use a visual type when the section's content genuinely calls for it. "text" is always a valid choice. Do NOT force visuals for variety.

SCENE TYPES:
- "text": A bold, cinematic statement. No visual. The DEFAULT for intros, closings, conceptual/motivational content.
- "math": LaTeX equation. For any formula, equation, theorem, or mathematical relationship. This is the FIRST choice for math/physics/science topics — NOT diagram.
- "code": Syntax-highlighted code block. For actual code, algorithm implementations, API usage. Max 12 lines.
- "chart": Data visualization. ONLY when the narration contains real numeric data being compared. Never invent data.
- "diagram": Mermaid diagram. ONLY for step-by-step processes, system architectures, or entity relationships. This is the LAST resort — never use a diagram when math, code, or text would be more appropriate.

DECISION TREE — follow this in order for each section:
1. Does the section contain or reference a formula, equation, or theorem (e.g. Pythagorean theorem, E=mc², quadratic formula, any named law)? → "math"
2. Does the section contain or reference actual code, pseudocode, or a specific algorithm implementation? → "code"
3. Does the narration cite specific numbers being compared (e.g. "GDP is 25T vs 18T")? → "chart"
4. Does the section describe a multi-step process, pipeline, or system architecture with distinct connected components? → "diagram"
5. Otherwise → "text"

CRITICAL: A "diagram" is NOT a good way to explain a theorem, equation, or concept. Mermaid flowcharts with boxes like "a² + b² = c²" are ugly and wrong. Use "math" for that.

DIAGRAMS:
- ONLY use for genuine multi-step processes, system architectures, or entity-relationship maps.
- NEVER use a diagram to display an equation, theorem, or concept that should be "math" or "text".
- Use "flowchart" for processes/steps, "sequence" for interactions, "graph" for relationships, "mindmap" for concept overviews.
- Keep Mermaid syntax simple. Short node labels (max 3 words). No special characters or HTML.
- Use graph TD or graph LR. Max 8 nodes.
- For sequence diagrams, max 3 participants.

CODE:
- Keep code concise (max 12 lines). Focus on the key concept.
- Use the correct language identifier (python, javascript, typescript, java, cpp, rust, go, etc.)
- Optionally highlight important lines with highlightLines array (1-indexed).

MATH:
- Use standard LaTeX. One equation or formula per scene.
- Keep expressions readable — avoid overly complex nested fractions.
- ANY named theorem or law MUST use a "math" scene: Pythagorean theorem → "a^2 + b^2 = c^2", Newton's second law → "F = ma", etc.
- Examples: "E = mc^2", "a^2 + b^2 = c^2", "\\int_0^\\infty e^{-x} dx = 1", "\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}"

CHARTS:
- ONLY use when the narration contains real numeric data to visualize. Do NOT invent data or add a chart just for visual flair.
- Max 6 items. Short labels (1-3 words).
- "bar" for comparing quantities, "pie" for proportions/percentages, "comparison" for horizontal ranking.
- Values should be numeric. Colors are optional (a default palette is used).

OUTPUT:
- topic, summary, totalDurationEstimate (30-45s)
- sections: array matching the script's sections, each with: title, narration, keyPoints (empty []), visualDescription, iconEmoji, durationWeight (1), sceneType, and the corresponding data object (diagram, codeBlock, math, or chart)`

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

For each section, decide the best scene type and provide the corresponding data. Only use a visual (diagram/code/math/chart) when the section content genuinely calls for it — don't force visuals. The last section should typically be "text".`,
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
                    enum: ['text', 'diagram', 'code', 'math', 'chart'],
                    description:
                      'Scene type. Use "text" unless the content genuinely needs a specific visual.',
                  },
                  diagram: {
                    type: 'object',
                    description:
                      'Required when sceneType is "diagram". Full-screen Mermaid diagram.',
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
                  codeBlock: {
                    type: 'object',
                    description:
                      'Required when sceneType is "code". Syntax-highlighted code snippet.',
                    properties: {
                      language: {
                        type: 'string',
                        description:
                          'Programming language (python, javascript, typescript, java, cpp, rust, go, etc.)',
                      },
                      code: {
                        type: 'string',
                        description:
                          'The code snippet. Max 12 lines. Focus on the key concept.',
                      },
                      highlightLines: {
                        type: 'array',
                        items: { type: 'number' },
                        description:
                          'Optional 1-indexed line numbers to highlight',
                      },
                      caption: {
                        type: 'string',
                        description: 'One-line caption',
                      },
                    },
                    required: ['language', 'code'],
                  },
                  math: {
                    type: 'object',
                    description:
                      'Required when sceneType is "math". LaTeX equation.',
                    properties: {
                      latex: {
                        type: 'string',
                        description:
                          'Standard LaTeX math expression. One equation per scene.',
                      },
                      caption: {
                        type: 'string',
                        description: 'One-line caption',
                      },
                    },
                    required: ['latex'],
                  },
                  chart: {
                    type: 'object',
                    description:
                      'Required when sceneType is "chart". Data visualization.',
                    properties: {
                      type: {
                        type: 'string',
                        enum: ['bar', 'pie', 'comparison'],
                        description:
                          'bar for quantities, pie for proportions, comparison for horizontal ranking',
                      },
                      title: {
                        type: 'string',
                        description: 'Chart title (optional)',
                      },
                      items: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            label: {
                              type: 'string',
                              description: 'Short label (1-3 words)',
                            },
                            value: {
                              type: 'number',
                              description: 'Numeric value',
                            },
                            color: {
                              type: 'string',
                              description: 'Optional hex color',
                            },
                          },
                          required: ['label', 'value'],
                        },
                        description: 'Max 6 data items',
                      },
                      caption: {
                        type: 'string',
                        description: 'One-line caption',
                      },
                    },
                    required: ['type', 'items'],
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
