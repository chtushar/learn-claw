import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion'
import { Audio } from '@remotion/media'
import { ProgressBar } from '../components/ProgressBar'
import { FONT_FAMILY } from '../lib/fonts'
import { theme } from '../lib/theme'
import type { ProcessedSection } from '@/lib/processedSchema'

export const SectionScene: React.FC<{
  section: ProcessedSection
  index: number
  total: number
  audioSrc?: string
}> = ({ section, index, total, audioSrc }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const emojiScale = spring({
    frame,
    fps,
    config: { damping: 80, stiffness: 200, mass: 0.4 },
  })
  const titleOpacity = interpolate(
    frame,
    [0.3 * fps, 0.7 * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const titleY = interpolate(
    frame,
    [0.3 * fps, 0.7 * fps],
    [40, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const narrationOpacity = interpolate(
    frame,
    [0.8 * fps, 1.3 * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const narrationY = interpolate(
    frame,
    [0.8 * fps, 1.3 * fps],
    [20, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.background,
        fontFamily: FONT_FAMILY,
        display: 'flex',
        flexDirection: 'column',
        padding: 48,
      }}
    >
      {audioSrc && <Audio src={audioSrc} />}

      <ProgressBar current={index + 1} total={total} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 32,
        }}
      >
        <div
          style={{
            fontSize: 64,
            transform: `scale(${interpolate(emojiScale, [0, 1], [0, 1])})`,
          }}
        >
          {section.iconEmoji}
        </div>

        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: 44,
            fontWeight: 800,
            color: theme.text,
            textAlign: 'center',
            lineHeight: 1.15,
            maxWidth: '90%',
          }}
        >
          {section.title}
        </div>

        <div
          style={{
            opacity: narrationOpacity,
            transform: `translateY(${narrationY}px)`,
            fontSize: 24,
            color: theme.textMuted,
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: '85%',
            fontWeight: 400,
          }}
        >
          {section.narration}
        </div>
      </div>
    </AbsoluteFill>
  )
}
