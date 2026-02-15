import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { TopicForm } from '@/components/TopicForm'
import { VideoPlayer } from '@/components/VideoPlayer'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import { generateVideo } from '@/server/generate'
import type { GenerateResponse } from '@/lib/schema'

export const Route = createFileRoute('/')({ component: HomePage })

type State =
  | { status: 'idle' }
  | { status: 'loading'; topic: string }
  | { status: 'success'; topic: string; data: GenerateResponse }
  | { status: 'error'; message: string }

function HomePage() {
  const [state, setState] = useState<State>({ status: 'idle' })

  const handleGenerate = async (topic: string) => {
    setState({ status: 'loading', topic })
    try {
      const data = await generateVideo({ data: { topic } })
      setState({ status: 'success', topic, data })
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
    <div className="min-h-screen bg-white text-[#1f1f1f]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {state.status === 'idle' && (
          <>
            <header className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e1e1e1] bg-[#e9f3ff] text-xs font-medium text-[#106ae7] mb-6">
                AI-powered explainer videos
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-[#1f1f1f] mb-3">
                Learn anything, visually
              </h1>
              <p className="text-lg text-[#636363]">
                Type a topic and get a short video explainer in seconds.
              </p>
            </header>
            <TopicForm onSubmit={handleGenerate} disabled={false} />
          </>
        )}

        {state.status === 'loading' && (
          <>
            <header className="text-center mb-10">
              <p className="text-sm text-[#636363]">
                Generating video about{' '}
                <span className="font-semibold text-[#1f1f1f]">
                  {state.topic}
                </span>
              </p>
            </header>
            <LoadingState />
          </>
        )}

        {state.status === 'error' && (
          <ErrorState message={state.message} onRetry={handleReset} />
        )}

        {state.status === 'success' && (
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-[#636363] mb-1">Your video</p>
              <h2 className="text-2xl font-semibold text-[#1f1f1f]">
                {state.topic}
              </h2>
            </div>
            <div className="w-full max-w-md rounded-2xl ring-1 ring-[#e1e1e1] shadow-lg shadow-black/5 overflow-hidden">
              <VideoPlayer data={state.data} />
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg border border-[#e1e1e1] text-[#636363] hover:text-[#1f1f1f] hover:border-[#cecece] transition-colors text-sm"
            >
              Try another topic
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
