import { useCurrentFrame, interpolate } from 'remotion'
import { useMemo } from 'react'
import { processMermaidSvg } from '../lib/svgUtils'

export const MermaidDiagram: React.FC<{
  svgString: string
  delay?: number
  caption?: string
  maxWidth?: number
  maxHeight?: number
}> = ({ svgString, delay = 0, caption, maxWidth = 1200, maxHeight = 700 }) => {
  const frame = useCurrentFrame()

  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const scale = interpolate(frame, [delay, delay + 25], [0.92, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const captionOpacity = interpolate(
    frame,
    [delay + 25, delay + 40],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  )

  const processedSvg = useMemo(() => processMermaidSvg(svgString), [svgString])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          maxWidth,
          maxHeight,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        dangerouslySetInnerHTML={{ __html: processedSvg }}
      />
      {caption && (
        <div
          style={{
            opacity: captionOpacity,
            fontSize: 18,
            color: '#8b8ba7',
            marginTop: 16,
            fontStyle: 'italic',
            textAlign: 'center',
          }}
        >
          {caption}
        </div>
      )}
    </div>
  )
}
