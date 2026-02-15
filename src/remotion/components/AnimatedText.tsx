import { useCurrentFrame, interpolate } from 'remotion'

export const AnimatedText: React.FC<{
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
      {text}
    </div>
  )
}
