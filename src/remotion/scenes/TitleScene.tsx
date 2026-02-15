import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion'
import { FONT_FAMILY } from '../lib/fonts'
import { theme } from '../lib/theme'

export const TitleScene: React.FC<{
  topic: string
  sectionCount: number
}> = ({ topic, sectionCount: _sectionCount }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  })
  const titleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: 'clamp',
  })
  const lineWidth = interpolate(
    frame,
    [0.7 * fps, 1.7 * fps],
    [0, 100],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const subtitleOpacity = interpolate(
    frame,
    [1.2 * fps, 1.8 * fps],
    [0, 1],
    { extrapolateRight: 'clamp' },
  )
  const subtitleY = interpolate(
    frame,
    [1.2 * fps, 1.8 * fps],
    [30, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 48,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          transform: `scale(${interpolate(titleScale, [0, 1], [0.8, 1])})`,
          fontSize: 52,
          fontWeight: 800,
          color: theme.accentDark,
          textAlign: 'center',
          maxWidth: '90%',
          lineHeight: 1.15,
          letterSpacing: -1,
        }}
      >
        {topic}
      </div>

      <div
        style={{
          width: `${lineWidth}px`,
          height: 4,
          backgroundColor: theme.accent,
          borderRadius: 2,
          marginTop: 24,
        }}
      />

      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontSize: 18,
          color: theme.accentMid,
          marginTop: 16,
          fontWeight: 600,
          letterSpacing: 3,
          textTransform: 'uppercase',
        }}
      >
        explained
      </div>
    </AbsoluteFill>
  )
}
