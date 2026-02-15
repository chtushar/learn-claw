import { z } from 'zod'

export const DiagramSchema = z.object({
  type: z.enum(['flowchart', 'sequence', 'mindmap', 'graph']),
  mermaidCode: z.string(),
  caption: z.string().optional(),
})

export const CodeBlockSchema = z.object({
  language: z.string(),
  code: z.string(),
  highlightLines: z.array(z.number()).optional(),
  caption: z.string().optional(),
})

export const MathSchema = z.object({
  latex: z.string(),
  caption: z.string().optional(),
})

export const ChartItemSchema = z.object({
  label: z.string(),
  value: z.number(),
  color: z.string().optional(),
})

export const ChartSchema = z.object({
  type: z.enum(['bar', 'pie', 'comparison']),
  title: z.string().optional(),
  items: z.array(ChartItemSchema),
  caption: z.string().optional(),
})

export const SectionSchema = z.object({
  title: z.string(),
  narration: z.string(),
  keyPoints: z.array(z.string()),
  visualDescription: z.string(),
  iconEmoji: z.string(),
  durationWeight: z.number(),
  sceneType: z
    .enum(['text', 'diagram', 'code', 'math', 'chart', 'split'])
    .default('text'),
  diagram: DiagramSchema.optional(),
  codeBlock: CodeBlockSchema.optional(),
  math: MathSchema.optional(),
  chart: ChartSchema.optional(),
})

export const VideoDataSchema = z.object({
  topic: z.string(),
  summary: z.string(),
  totalDurationEstimate: z.number(),
  sections: z.array(SectionSchema),
})

export const AudioSegmentSchema = z.object({
  sectionIndex: z.number(),
  base64Audio: z.string(),
  durationMs: z.number(),
})

export const GenerateResponseSchema = z.object({
  videoData: VideoDataSchema,
  audioSegments: z.array(AudioSegmentSchema),
})

export type Diagram = z.infer<typeof DiagramSchema>
export type CodeBlock = z.infer<typeof CodeBlockSchema>
export type MathData = z.infer<typeof MathSchema>
export type ChartItem = z.infer<typeof ChartItemSchema>
export type Chart = z.infer<typeof ChartSchema>
export type Section = z.infer<typeof SectionSchema>
export type VideoData = z.infer<typeof VideoDataSchema>
export type AudioSegment = z.infer<typeof AudioSegmentSchema>
export type GenerateResponse = z.infer<typeof GenerateResponseSchema>
