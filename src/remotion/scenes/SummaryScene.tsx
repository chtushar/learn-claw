import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion'
import { FONT_FAMILY } from '../lib/fonts'
import { theme } from '../lib/theme'
import type { ProcessedSection } from '@/lib/processedSchema'

export const SummaryScene: React.FC<{
  topic: string
  summary: string
  sections: ProcessedSection[]
}> = ({ topic, summary, sections: _sections }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const checkScale = spring({
    frame: Math.max(0, frame - Math.round(1.3 * fps)),
    fps,
    config: { damping: 60, stiffness: 200, mass: 0.3 },
  })
  const topicOpacity = interpolate(
    frame,
    [0.2 * fps, 0.7 * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const topicY = interpolate(
    frame,
    [0.2 * fps, 0.7 * fps],
    [30, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const summaryOpacity = interpolate(
    frame,
    [0.7 * fps, 1.2 * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const lineWidth = interpolate(
    frame,
    [1 * fps, 1.8 * fps],
    [0, 80],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.background,
        fontFamily: FONT_FAMILY,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 48,
      }}
    >
      <div
        style={{
          fontSize: 56,
          transform: `scale(${interpolate(checkScale, [0, 1], [0, 1])})`,
          marginBottom: 28,
          color: theme.accent,
        }}
      >
        ✓
      </div>

      <div
        style={{
          opacity: topicOpacity,
          transform: `translateY(${topicY}px)`,
          fontSize: 40,
          fontWeight: 800,
          color: theme.text,
          textAlign: 'center',
          lineHeight: 1.15,
          maxWidth: '90%',
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
          opacity: summaryOpacity,
          fontSize: 22,
          color: theme.textMuted,
          textAlign: 'center',
          lineHeight: 1.5,
          maxWidth: '85%',
          marginTop: 24,
          fontWeight: 400,
        }}
      >
        {summary}
      </div>
    </AbsoluteFill>
  )
}
