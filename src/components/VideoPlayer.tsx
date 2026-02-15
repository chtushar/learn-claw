import { Player } from '@remotion/player'
import { VideoComposition } from '@/remotion/VideoComposition'
import { calculateTotalFrames } from '@/remotion/lib/calculations'
import { VIDEO_FPS, VIDEO_WIDTH, VIDEO_HEIGHT } from '@/remotion/lib/constants'
import { useMermaidRenderer } from '@/lib/useMermaidRenderer'
import type { VideoData } from '@/lib/schema'

export const VideoPlayer: React.FC<{ data: VideoData }> = ({ data }) => {
  const { processed, isRendering, error } = useMermaidRenderer(data)

  if (isRendering) {
    return (
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          Rendering diagrams...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto text-red-400 py-12 text-center">
        Diagram rendering failed: {error}
      </div>
    )
  }

  if (!processed) return null

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Player
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={VideoComposition as any}
        inputProps={processed}
        durationInFrames={calculateTotalFrames(data)}
        compositionWidth={VIDEO_WIDTH}
        compositionHeight={VIDEO_HEIGHT}
        fps={VIDEO_FPS}
        controls
        style={{ width: '100%', borderRadius: 12 }}
      />
    </div>
  )
}
