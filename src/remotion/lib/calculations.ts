import type { VideoData } from '@/lib/schema'
import {
  TITLE_SCENE_DURATION_FRAMES,
  SECTION_BASE_DURATION_FRAMES,
  SUMMARY_SCENE_DURATION_FRAMES,
  TRANSITION_DURATION_FRAMES,
  DIAGRAM_DURATION_MULTIPLIER,
} from './constants'

export function calculateTotalFrames(data: VideoData): number {
  const sectionFrames = data.sections.reduce((total, section) => {
    const multiplier =
      section.sceneType === 'diagram' ? DIAGRAM_DURATION_MULTIPLIER : 1
    return (
      total +
      Math.round(SECTION_BASE_DURATION_FRAMES * section.durationWeight * multiplier)
    )
  }, 0)

  const transitionCount = data.sections.length + 1
  const transitionFrames = transitionCount * TRANSITION_DURATION_FRAMES

  return (
    TITLE_SCENE_DURATION_FRAMES +
    sectionFrames +
    SUMMARY_SCENE_DURATION_FRAMES -
    transitionFrames
  )
}
