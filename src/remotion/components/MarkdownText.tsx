import { useCurrentFrame, interpolate } from 'remotion'
import { theme } from '../lib/theme'

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    if (match[2]) {
      parts.push(
        <strong
          key={match.index}
          style={{ color: theme.boldText, fontWeight: 700 }}
        >
          {match[2]}
        </strong>,
      )
    } else if (match[3]) {
      parts.push(
        <em key={match.index} style={{ color: theme.italicText }}>
          {match[3]}
        </em>,
      )
    } else if (match[4]) {
      parts.push(
        <code
          key={match.index}
          style={{
            backgroundColor: theme.codeBg,
            color: theme.codeText,
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: '0.9em',
            fontFamily: 'monospace',
          }}
        >
          {match[4]}
        </code>,
      )
    }
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}

export const MarkdownText: React.FC<{
  text: string
  delay: number
  style?: React.CSSProperties
}> = ({ text, delay, style }) => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const y = interpolate(frame, [delay, delay + 15], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>
      {parseInlineMarkdown(text)}
    </div>
  )
}
