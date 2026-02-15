import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion'
import { theme } from '../lib/theme'

export const ProgressBar: React.FC<{
  current: number
  total: number
}> = ({ current, total }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const width = interpolate(
    frame,
    [0, 0.7 * fps],
    [0, (current / total) * 100],
    { extrapolateRight: 'clamp' },
  )

  return (
    <div
      style={{
        width: '100%',
        height: 4,
        backgroundColor: theme.progressTrack,
        borderRadius: 2,
      }}
    >
      <div
        style={{
          width: `${width}%`,
          height: '100%',
          backgroundColor: theme.progressFill,
          borderRadius: 2,
        }}
      />
    </div>
  )
}
