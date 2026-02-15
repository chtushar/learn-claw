import { useCurrentFrame, interpolate } from 'remotion'

export const ProgressBar: React.FC<{
  current: number
  total: number
}> = ({ current, total }) => {
  const frame = useCurrentFrame()
  const width = interpolate(frame, [0, 20], [0, (current / total) * 100], {
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        width: '100%',
        height: 4,
        backgroundColor: '#1a1a3e',
        borderRadius: 2,
      }}
    >
      <div
        style={{
          width: `${width}%`,
          height: '100%',
          backgroundColor: '#6c63ff',
          borderRadius: 2,
        }}
      />
    </div>
  )
}
