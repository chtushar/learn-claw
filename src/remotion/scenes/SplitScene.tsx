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

export const SplitScene: React.FC<{
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
  const narrationOpacity = interpolate(
    frame,
    [1 * fps, 1.5 * fps],
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

      <ProgressBar current={index + 1} total={total} />

      <div
        style={{
          opacity: titleOpacity,
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
            maxHeight={1200}
          />
        )}
      </div>

      <div
        style={{
          opacity: narrationOpacity,
          fontSize: 18,
          color: theme.textMuted,
          textAlign: 'center',
          lineHeight: 1.4,
          paddingTop: 12,
        }}
      >
        {section.narration}
      </div>
    </AbsoluteFill>
  )
}
