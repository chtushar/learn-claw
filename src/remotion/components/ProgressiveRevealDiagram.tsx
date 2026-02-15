import { useCurrentFrame, interpolate } from 'remotion'
import { useMemo } from 'react'
import { processMermaidSvg } from '../lib/svgUtils'

export const ProgressiveRevealDiagram: React.FC<{
  svgString: string
  startDelay?: number
  frameBetweenElements?: number
  maxWidth?: number
  maxHeight?: number
}> = ({
  svgString,
  startDelay = 10,
  frameBetweenElements = 8,
  maxWidth = 1200,
  maxHeight = 700,
}) => {
  const frame = useCurrentFrame()

  const processedSvg = useMemo(() => {
    let svg = processMermaidSvg(svgString)

    let elementIndex = 0
    svg = svg.replace(
      /class="([^"]*(?:node|edgePath|edgeLabel|cluster)[^"]*)"/g,
      (match) => {
        const idx = elementIndex++
        return `${match} data-reveal-index="${idx}"`
      },
    )

    return { svg, totalElements: elementIndex }
  }, [svgString])

  const styleRules = useMemo(() => {
    const rules: string[] = []
    for (let i = 0; i < processedSvg.totalElements; i++) {
      const elementDelay = startDelay + i * frameBetweenElements
      const opacity = interpolate(
        frame,
        [elementDelay, elementDelay + 10],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        },
      )
      const translateY = interpolate(
        frame,
        [elementDelay, elementDelay + 10],
        [8, 0],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        },
      )
      rules.push(
        `[data-reveal-index="${i}"] { opacity: ${opacity}; transform: translateY(${translateY}px); }`,
      )
    }
    return rules.join('\n')
  }, [frame, processedSvg.totalElements, startDelay, frameBetweenElements])

  // If no elements were found to animate, just fade the whole thing in
  const wholeOpacity =
    processedSvg.totalElements === 0
      ? interpolate(frame, [startDelay, startDelay + 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        maxWidth,
        maxHeight,
        opacity: wholeOpacity,
      }}
    >
      {processedSvg.totalElements > 0 && (
        <style dangerouslySetInnerHTML={{ __html: styleRules }} />
      )}
      <div
        style={{ width: '100%', height: '100%' }}
        dangerouslySetInnerHTML={{ __html: processedSvg.svg }}
      />
    </div>
  )
}
