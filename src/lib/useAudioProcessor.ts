import { useState, useEffect, useRef } from 'react'
import type { AudioSegment } from './schema'
import type { AudioInfo } from './processedSchema'

export function useAudioProcessor(segments: AudioSegment[]): {
  audioInfos: AudioInfo[] | null
  isProcessing: boolean
  error: string | null
} {
  const [audioInfos, setAudioInfos] = useState<AudioInfo[] | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const blobUrlsRef = useRef<string[]>([])

  useEffect(() => {
    if (!segments || segments.length === 0) return

    let cancelled = false

    async function processAll() {
      setIsProcessing(true)
      setError(null)

      try {
        const results = await Promise.all(
          segments.map(async (segment) => {
            // Decode base64 to binary
            const binaryString = atob(segment.base64Audio)
            const bytes = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i)
            }

            const blob = new Blob([bytes], { type: 'audio/mpeg' })
            const blobUrl = URL.createObjectURL(blob)

            // Measure actual audio duration
            const durationInSeconds = await new Promise<number>(
              (resolve, reject) => {
                const audio = new Audio(blobUrl)
                audio.addEventListener('loadedmetadata', () => {
                  resolve(audio.duration)
                })
                audio.addEventListener('error', () => {
                  // Fallback to estimated duration from server
                  resolve(segment.durationMs / 1000)
                })
                // Timeout fallback
                setTimeout(() => {
                  reject(new Error('Audio duration measurement timeout'))
                }, 5000)
              },
            ).catch(() => segment.durationMs / 1000)

            return { blobUrl, durationInSeconds }
          }),
        )

        if (!cancelled) {
          blobUrlsRef.current = results.map((r) => r.blobUrl)
          setAudioInfos(results)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Audio processing failed',
          )
        }
      } finally {
        if (!cancelled) {
          setIsProcessing(false)
        }
      }
    }

    processAll()
    return () => {
      cancelled = true
      // Cleanup blob URLs
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      blobUrlsRef.current = []
    }
  }, [segments])

  return { audioInfos, isProcessing, error }
}
