import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion'

export const TitleScene: React.FC<{
  topic: string
  sectionCount: number
}> = ({ topic, sectionCount }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  })
  const titleY = spring({ frame, fps, config: { damping: 200 } })
  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 48,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${interpolate(titleY, [0, 1], [40, 0])}px)`,
          fontSize: 48,
          fontWeight: 800,
          color: '#ffffff',
          textAlign: 'center',
          maxWidth: '90%',
          lineHeight: 1.2,
        }}
      >
        {topic}
      </div>
      <div
        style={{
          opacity: subtitleOpacity,
          fontSize: 22,
          color: '#8b8ba7',
          marginTop: 20,
        }}
      >
        {sectionCount} sections
      </div>
    </AbsoluteFill>
  )
}
