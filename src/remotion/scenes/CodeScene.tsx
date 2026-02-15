import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
} from 'remotion'
import { Audio } from '@remotion/media'
import { ProgressBar } from '../components/ProgressBar'
import { FONT_FAMILY } from '../lib/fonts'
import { theme } from '../lib/theme'
import type { ProcessedSection } from '@/lib/processedSchema'

export const CodeScene: React.FC<{
  section: ProcessedSection
  index: number
  total: number
  audioSrc?: string
}> = ({ section, index, total, audioSrc }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const code = section.processedCode
  if (!code) return null

  const titleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const titleY = interpolate(frame, [0, 0.5 * fps], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const containerOpacity = interpolate(
    frame,
    [0.3 * fps, 0.8 * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const containerScale = interpolate(
    frame,
    [0.3 * fps, 0.8 * fps],
    [0.95, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Progressive line reveal via clipPath
  const revealProgress = interpolate(
    frame,
    [0.5 * fps, 2.0 * fps],
    [0, 100],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Build highlight style if needed
  const highlightStyle = code.highlightLines?.length
    ? code.highlightLines
        .map(
          (line) =>
            `.shiki .line:nth-child(${line}) { background-color: ${theme.accentLight}; display: inline-block; width: 100%; }`,
        )
        .join('\n')
    : ''

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
          position: 'relative',
        }}
      >
        <div
          style={{
            opacity: containerOpacity,
            transform: `scale(${containerScale})`,
            backgroundColor: theme.codeBg,
            border: `1px solid ${theme.border}`,
            borderRadius: 20,
            padding: '28px 32px',
            width: '95%',
            maxHeight: '85%',
            overflow: 'hidden',
            position: 'relative',
            clipPath: `inset(0 0 ${100 - revealProgress}% 0)`,
          }}
        >
          {highlightStyle && (
            <style dangerouslySetInnerHTML={{ __html: highlightStyle }} />
          )}

          {/* Language badge */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 16,
              backgroundColor: theme.accent,
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 8,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {code.language}
          </div>

          <div
            style={{ fontSize: 18, lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{ __html: code.htmlString }}
          />
        </div>
      </div>

      {code.caption && (
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
          {code.caption}
        </div>
      )}
    </AbsoluteFill>
  )
}
