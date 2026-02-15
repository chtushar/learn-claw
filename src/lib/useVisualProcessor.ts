import { useState, useEffect } from 'react'
import type { GenerateResponse } from './schema'
import type { ProcessedVideoData, ProcessedSection } from './processedSchema'

export function useVisualProcessor(response: GenerateResponse | null): {
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
        const sections = data!.sections

        // Detect which renderers are needed
        const needsMermaid = sections.some(
          (s) => s.sceneType === 'diagram' && s.diagram?.mermaidCode,
        )
        const needsShiki = sections.some(
          (s) => s.sceneType === 'code' && s.codeBlock?.code,
        )
        const needsKatex = sections.some(
          (s) => s.sceneType === 'math' && s.math?.latex,
        )

        // Lazy-import renderers in parallel (only those needed)
        const [mermaidModule, shikiModule, katexModule] = await Promise.all([
          needsMermaid ? import('mermaid') : null,
          needsShiki ? import('shiki/bundle/web') : null,
          needsKatex ? import('katex') : null,
        ])

        // Initialize Mermaid
        if (mermaidModule) {
          const mermaid = mermaidModule.default
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
        }

        // Initialize Shiki highlighter
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let highlighter: any = null

        if (shikiModule) {
          const langs = [
            ...new Set(
              sections
                .filter((s) => s.sceneType === 'code' && s.codeBlock?.language)
                .map((s) => s.codeBlock!.language.toLowerCase()),
            ),
          ]
          try {
            highlighter = await shikiModule.createHighlighter({
              themes: ['github-light'],
              langs,
            })
          } catch {
            // If language not supported, try with just a few safe defaults
            highlighter = await shikiModule.createHighlighter({
              themes: ['github-light'],
              langs: ['javascript', 'typescript', 'python'],
            })
          }
        }

        const processedSections: ProcessedSection[] = await Promise.all(
          sections.map(async (section, i) => {
            // Strip raw fields that don't belong in processed output
            const {
              diagram: _diagram,
              codeBlock: _codeBlock,
              math: _math,
              ...rest
            } = section

            // --- Mermaid diagram ---
            if (
              section.sceneType === 'diagram' &&
              section.diagram?.mermaidCode &&
              mermaidModule
            ) {
              try {
                const mermaid = mermaidModule.default
                const { svg } = await mermaid.render(
                  `diagram-${i}-${Date.now()}`,
                  section.diagram.mermaidCode,
                )
                return {
                  ...rest,
                  processedDiagram: {
                    svgString: svg,
                    type: section.diagram.type,
                    caption: section.diagram.caption,
                  },
                } as ProcessedSection
              } catch (err) {
                console.warn(
                  `Mermaid render failed for section ${i}:`,
                  err,
                )
                return {
                  ...rest,
                  sceneType: 'text' as const,
                } satisfies ProcessedSection
              }
            }

            // --- Shiki code ---
            if (
              section.sceneType === 'code' &&
              section.codeBlock?.code &&
              highlighter
            ) {
              try {
                const lang = section.codeBlock.language.toLowerCase()
                const htmlString = highlighter.codeToHtml(
                  section.codeBlock.code,
                  { lang, theme: 'github-light' },
                ) as string
                return {
                  ...rest,
                  processedCode: {
                    htmlString,
                    language: section.codeBlock.language,
                    highlightLines: section.codeBlock.highlightLines,
                    caption: section.codeBlock.caption,
                  },
                } as ProcessedSection
              } catch (err) {
                console.warn(
                  `Shiki render failed for section ${i}:`,
                  err,
                )
                return {
                  ...rest,
                  sceneType: 'text' as const,
                } satisfies ProcessedSection
              }
            }

            // --- KaTeX math ---
            if (
              section.sceneType === 'math' &&
              section.math?.latex &&
              katexModule
            ) {
              try {
                const htmlString = katexModule.default.renderToString(
                  section.math.latex,
                  { displayMode: true, throwOnError: false },
                )
                return {
                  ...rest,
                  processedMath: {
                    htmlString,
                    caption: section.math.caption,
                  },
                } as ProcessedSection
              } catch (err) {
                console.warn(
                  `KaTeX render failed for section ${i}:`,
                  err,
                )
                return {
                  ...rest,
                  sceneType: 'text' as const,
                } satisfies ProcessedSection
              }
            }

            // --- Chart: no processing needed, pass through ---
            if (section.sceneType === 'chart' && section.chart) {
              return {
                ...rest,
                chart: section.chart,
              } as ProcessedSection
            }

            // --- text / split / fallback ---
            return rest as ProcessedSection
          }),
        )

        // Dispose Shiki highlighter
        if (highlighter?.dispose) {
          highlighter.dispose()
        }

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
            err instanceof Error ? err.message : 'Visual processing failed',
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
