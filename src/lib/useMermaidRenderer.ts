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
          theme: 'dark',
          themeVariables: {
            darkMode: true,
            background: '#0f0f23',
            primaryColor: '#6c63ff',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#6c63ff',
            lineColor: '#8b8ba7',
            secondaryColor: '#1a1a3e',
            tertiaryColor: '#2a2a4e',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            nodeBorder: '#6c63ff',
            mainBkg: '#1a1a3e',
            clusterBkg: '#1a1a3e',
            edgeLabelBackground: '#0f0f23',
            nodeTextColor: '#e0e0ff',
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
