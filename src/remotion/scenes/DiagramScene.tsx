import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
} from 'remotion'
import { Audio } from '@remotion/media'
import { MermaidDiagram } from '../components/MermaidDiagram'
import { ProgressBar } from '../components/ProgressBar'
import { FONT_FAMILY } from '../lib/fonts'
import { theme } from '../lib/theme'
import type { ProcessedSection } from '@/lib/processedSchema'

export const DiagramScene: React.FC<{
  section: ProcessedSection
  index: number
  total: number
  audioSrc?: string
}> = ({ section, index, total, audioSrc }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleOpacity = interpolate(
    frame,
    [0, 0.5 * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const titleY = interpolate(
    frame,
    [0, 0.5 * fps],
    [20, 0],
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
        {section.processedDiagram && (
          <MermaidDiagram
            svgString={section.processedDiagram.svgString}
            delay={Math.round(0.3 * fps)}
            maxWidth={980}
            maxHeight={1400}
          />
        )}
      </div>

      {section.processedDiagram?.caption && (
        <div
          style={{
            opacity: interpolate(
              frame,
              [1.7 * fps, 2.2 * fps],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            ),
            fontSize: 16,
            color: theme.accentMid,
            textAlign: 'center',
            fontWeight: 500,
            paddingTop: 8,
          }}
        >
          {section.processedDiagram.caption}
        </div>
      )}
    </AbsoluteFill>
  )
}
