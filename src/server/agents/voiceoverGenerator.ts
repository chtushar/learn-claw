import { synthesizeSpeech } from '../elevenlabs'
import type { AudioSegment } from '@/lib/schema'
import type { Script } from './types'

export async function generateVoiceover(
  script: Script,
): Promise<AudioSegment[]> {
  return Promise.all(
    script.sections.map(async (section, index) => {
      const { base64Audio, durationMs } = await synthesizeSpeech(
        section.narration,
      )
      return { sectionIndex: index, base64Audio, durationMs }
    }),
  )
}
