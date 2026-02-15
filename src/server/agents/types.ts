import { z } from 'zod'

export const ScriptSectionSchema = z.object({
  title: z.string(),
  narration: z.string(),
  keyTopic: z.string(),
  iconEmoji: z.string(),
})

export const ScriptSchema = z.object({
  topic: z.string(),
  summary: z.string(),
  sections: z.array(ScriptSectionSchema),
})

export type ScriptSection = z.infer<typeof ScriptSectionSchema>
export type Script = z.infer<typeof ScriptSchema>
