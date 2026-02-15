import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { GenerateResponse } from '@/lib/schema'
import { generateScript } from './agents/scriptWriter'
import { planSlides } from './agents/slidePlanner'
import { generateVoiceover } from './agents/voiceoverGenerator'

export const generateVideo = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ topic: z.string().min(1).max(200) }))
  .handler(async ({ data }): Promise<GenerateResponse> => {
    // Step 1: Script Agent — write the narrative
    const script = await generateScript(data.topic)

    // Step 2: Slides + Voiceover in parallel
    const [videoData, audioSegments] = await Promise.all([
      planSlides(script),
      generateVoiceover(script),
    ])

    return { videoData, audioSegments }
  })
