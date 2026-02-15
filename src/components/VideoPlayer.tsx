import { Player } from '@remotion/player'
import { VideoComposition } from '@/remotion/VideoComposition'
import { calculateTotalFrames } from '@/remotion/lib/calculations'
import { VIDEO_FPS, VIDEO_WIDTH, VIDEO_HEIGHT } from '@/remotion/lib/constants'
import { useMermaidRenderer } from '@/lib/useMermaidRenderer'
import { useAudioProcessor } from '@/lib/useAudioProcessor'
import type { GenerateResponse } from '@/lib/schema'
import { useMemo } from 'react'

export const VideoPlayer: React.FC<{ data: GenerateResponse }> = ({ data }) => {
  const { processed, isRendering, error: mermaidError } = useMermaidRenderer(data)
  const {
    audioInfos,
    isProcessing: isProcessingAudio,
    error: audioError,
  } = useAudioProcessor(data.audioSegments)

  const isLoading = isRendering || isProcessingAudio
  const error = mermaidError || audioError

  // Merge audio into processed data
  const finalData = useMemo(() => {
    if (!processed || !audioInfos) return null
    return {
      ...processed,
      audioSegments: audioInfos,
    }
  }, [processed, audioInfos])

  const totalFrames = useMemo(() => {
    if (!finalData) return 0
    return calculateTotalFrames(
      finalData.sections.length,
      finalData.audioSegments,
      finalData.sections,
    )
  }, [finalData])

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-[#636363]">
          <div className="w-5 h-5 border-2 border-[#2c80ff] border-t-transparent rounded-full animate-spin" />
          {isRendering ? 'Rendering diagrams...' : 'Processing audio...'}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto text-red-500 py-12 text-center">
        Processing failed: {error}
      </div>
    )
  }

  if (!finalData) return null

  return (
    <div className="w-full max-w-md mx-auto">
      <Player
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={VideoComposition as any}
        inputProps={finalData}
        durationInFrames={totalFrames}
        compositionWidth={VIDEO_WIDTH}
        compositionHeight={VIDEO_HEIGHT}
        fps={VIDEO_FPS}
        controls
        style={{ width: '100%', borderRadius: 12 }}
      />
    </div>
  )
}
