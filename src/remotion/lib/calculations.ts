import type { AudioInfo } from '@/lib/processedSchema'
import {
  VIDEO_FPS,
  TITLE_SCENE_DURATION_FRAMES,
  SECTION_BASE_DURATION_FRAMES,
  SUMMARY_SCENE_DURATION_FRAMES,
  TRANSITION_DURATION_FRAMES,
  AUDIO_BUFFER_FRAMES,
  DIAGRAM_DURATION_MULTIPLIER,
} from './constants'

export function getSectionDurationFrames(
  audioInfo: AudioInfo | undefined,
  durationWeight: number,
  sceneType: string,
): number {
  if (audioInfo) {
    return (
      Math.ceil(audioInfo.durationInSeconds * VIDEO_FPS) + AUDIO_BUFFER_FRAMES
    )
  }
  // Fallback: weight-based duration
  const visualTypes = ['diagram', 'code', 'math', 'chart']
  const multiplier = visualTypes.includes(sceneType)
    ? DIAGRAM_DURATION_MULTIPLIER
    : 1
  return Math.round(SECTION_BASE_DURATION_FRAMES * durationWeight * multiplier)
}

export function calculateTotalFrames(
  sectionCount: number,
  audioSegments: AudioInfo[],
  sections: { durationWeight: number; sceneType: string }[],
): number {
  const sectionFrames = sections.reduce((total, section, i) => {
    return total + getSectionDurationFrames(audioSegments[i], section.durationWeight, section.sceneType)
  }, 0)

  const transitionCount = sectionCount + 1
  const transitionFrames = transitionCount * TRANSITION_DURATION_FRAMES

  return (
    TITLE_SCENE_DURATION_FRAMES +
    sectionFrames +
    SUMMARY_SCENE_DURATION_FRAMES -
    transitionFrames
  )
}
