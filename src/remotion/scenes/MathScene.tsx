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

const KATEX_CSS_URL =
  'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css'

export const MathScene: React.FC<{
  section: ProcessedSection
  index: number
  total: number
  audioSrc?: string
}> = ({ section, index, total, audioSrc }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const math = section.processedMath
  if (!math) return null

  const titleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const titleY = interpolate(frame, [0, 0.5 * fps], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const equationScale = spring({
    frame: Math.max(0, frame - Math.round(0.5 * fps)),
    fps,
    config: { damping: 80, stiffness: 180, mass: 0.5 },
  })

  const equationOpacity = interpolate(
    frame,
    [0.4 * fps, 0.8 * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.background,
        padding: '36px 32px',
        fontFamily: FONT_FAMILY,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {audioSrc && <Audio src={audioSrc} />}
      <link rel="stylesheet" href={KATEX_CSS_URL} />

      <ProgressBar current={index + 1} total={total} />

      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          marginTop: 16,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 28 }}>{section.iconEmoji}</span>
        <span
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: theme.text,
            letterSpacing: -0.5,
          }}
        >
          {section.title}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 0,
        }}
      >
        <div
          style={{
            opacity: equationOpacity,
            transform: `scale(${interpolate(equationScale, [0, 1], [0.8, 1])})`,
            fontSize: 48,
            color: theme.text,
            textAlign: 'center',
            padding: '32px 48px',
            backgroundColor: theme.accentLighter,
            borderRadius: 24,
            border: `1px solid ${theme.border}`,
          }}
          dangerouslySetInnerHTML={{ __html: math.htmlString }}
        />
      </div>

      {math.caption && (
        <div
          style={{
            opacity: interpolate(
              frame,
              [1.7 * fps, 2.2 * fps],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            ),
            fontSize: 16,
            color: theme.captionText,
            textAlign: 'center',
            fontWeight: 500,
            paddingTop: 8,
          }}
        >
          {math.caption}
        </div>
      )}
    </AbsoluteFill>
  )
}
