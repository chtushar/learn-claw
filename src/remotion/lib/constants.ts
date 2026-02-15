export const VIDEO_FPS = 30
export const VIDEO_WIDTH = 1080
export const VIDEO_HEIGHT = 1920

export const TITLE_SCENE_DURATION_FRAMES = 3 * VIDEO_FPS // 3 seconds
export const SUMMARY_SCENE_DURATION_FRAMES = 3 * VIDEO_FPS // 3 seconds
export const TRANSITION_DURATION_FRAMES = 12 // 0.4 seconds
export const AUDIO_BUFFER_FRAMES = 15 // 0.5s padding after audio ends

// Fallback when no audio duration available
export const SECTION_BASE_DURATION_FRAMES = 5 * VIDEO_FPS
export const DIAGRAM_DURATION_MULTIPLIER = 1.3
