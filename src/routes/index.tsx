import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { TopicForm } from '@/components/TopicForm'
import { VideoPlayer } from '@/components/VideoPlayer'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import { generateVideo } from '@/server/generate'
import type { VideoData } from '@/lib/schema'

export const Route = createFileRoute('/')({ component: HomePage })

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: VideoData }
  | { status: 'error'; message: string }

function HomePage() {
  const [state, setState] = useState<State>({ status: 'idle' })

  const handleGenerate = async (topic: string) => {
    setState({ status: 'loading' })
    try {
      const data = await generateVideo({ data: { topic } })
      setState({ status: 'success', data })
    } catch (e) {
      setState({
        status: 'error',
        message: e instanceof Error ? e.message : 'Something went wrong',
      })
    }
  }

  const handleReset = () => {
    setState({ status: 'idle' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            learn-claw
          </h1>
          <p className="text-xl text-slate-400">
            Type a topic. Get a video explainer.
          </p>
        </header>

        {state.status !== 'success' && (
          <TopicForm
            onSubmit={handleGenerate}
            disabled={state.status === 'loading'}
          />
        )}

        {state.status === 'loading' && <LoadingState />}

        {state.status === 'error' && (
          <ErrorState message={state.message} onRetry={handleReset} />
        )}

        {state.status === 'success' && (
          <div className="mt-8 flex flex-col items-center gap-6">
            <VideoPlayer data={state.data} />
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Try another topic
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
