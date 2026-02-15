import { useState, useEffect } from 'react'
import type { GenerateResponse } from './schema'
import type { ProcessedVideoData, ProcessedSection } from './processedSchema'

export function useMermaidRenderer(response: GenerateResponse | null): {
  processed: ProcessedVideoData | null
  isRendering: boolean
  error: string | null
} {
  const [processed, setProcessed] = useState<ProcessedVideoData | null>(null)
  const [isRendering, setIsRendering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!response) return

    const data = response.videoData
    let cancelled = false

    async function renderAll() {
      setIsRendering(true)
      setError(null)

      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            darkMode: false,
            background: '#ffffff',
            primaryColor: '#e9f3ff',
            primaryTextColor: '#0c3169',
            primaryBorderColor: '#75aafc',
            lineColor: '#1f1f1f',
            secondaryColor: '#f5f9ff',
            tertiaryColor: '#daecff',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            nodeBorder: '#75aafc',
            mainBkg: '#e9f3ff',
            clusterBkg: '#f5f9ff',
            edgeLabelBackground: '#ffffff',
            nodeTextColor: '#0c3169',
          },
        })

        const processedSections: ProcessedSection[] = await Promise.all(
          data!.sections.map(async (section, i) => {
            if (!section.diagram?.mermaidCode) {
              const { diagram: _diagram, ...rest } = section
              return rest as ProcessedSection
            }

            try {
              const { svg } = await mermaid.render(
                `diagram-${i}-${Date.now()}`,
                section.diagram.mermaidCode,
              )
              const { diagram: _diagram, ...rest } = section
              return {
                ...rest,
                processedDiagram: {
                  svgString: svg,
                  type: section.diagram!.type,
                  caption: section.diagram!.caption,
                },
              } as ProcessedSection
            } catch (err) {
              console.warn(`Mermaid render failed for section ${i}:`, err)
              const { diagram: _diagram, ...rest } = section
              return {
                ...rest,
                sceneType: 'text' as const,
              } satisfies ProcessedSection
            }
          }),
        )

        if (!cancelled) {
          setProcessed({
            topic: data!.topic,
            summary: data!.summary,
            totalDurationEstimate: data!.totalDurationEstimate,
            sections: processedSections,
            audioSegments: [], // Will be populated by useAudioProcessor
          })
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Mermaid rendering failed',
          )
        }
      } finally {
        if (!cancelled) {
          setIsRendering(false)
        }
      }
    }

    renderAll()
    return () => {
      cancelled = true
    }
  }, [response])

  return { processed, isRendering, error }
}
