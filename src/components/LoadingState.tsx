import { useState, useEffect } from 'react'

interface Step {
  label: string
  description: string
  status: 'pending' | 'active' | 'done'
}

export const LoadingState: React.FC = () => {
  const [elapsed, setElapsed] = useState(0)
  const [finishingUp, setFinishingUp] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((t) => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Simulate pipeline progress
  // Step 1: Writing Script — active 0-8s
  // Step 2: Planning Slides — active 8-16s (parallel with step 3)
  // Step 3: Generating Voiceover — active 8-18s (parallel with step 2)
  // After 18s: finishing up
  const steps: Step[] = [
    {
      label: 'Writing Script',
      description: 'Claude is drafting your explainer script',
      status: elapsed < 8 ? 'active' : 'done',
    },
    {
      label: 'Planning Slides',
      description: 'Designing visual scenes and diagrams',
      status: elapsed < 8 ? 'pending' : elapsed < 16 ? 'active' : 'done',
    },
    {
      label: 'Generating Voiceover',
      description: 'Synthesizing narration audio',
      status: elapsed < 8 ? 'pending' : elapsed < 18 ? 'active' : 'done',
    },
  ]

  useEffect(() => {
    if (elapsed >= 18 && !finishingUp) {
      setFinishingUp(true)
    }
  }, [elapsed, finishingUp])

  return (
    <div className="w-full max-w-md mx-auto py-8">
      <div className="space-y-0">
        {/* Step 1 — standalone */}
        <StepRow step={steps[0]} />

        {/* Parallel group */}
        <div className="ml-4 mt-3">
          <p className="text-xs font-medium text-[#818181] uppercase tracking-wide mb-2 ml-8">
            In parallel
          </p>
          <div className="border-l-2 border-[#e1e1e1] pl-6 space-y-0">
            <StepRow step={steps[1]} />
            <StepRow step={steps[2]} />
          </div>
        </div>
      </div>

      {finishingUp && (
        <div className="flex items-center gap-2 mt-8 justify-center text-sm text-[#636363]">
          <div className="w-4 h-4 border-2 border-[#2c80ff] border-t-transparent rounded-full animate-spin" />
          Finishing up…
        </div>
      )}
    </div>
  )
}

const StepRow: React.FC<{ step: Step }> = ({ step }) => {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5">
        {step.status === 'pending' && (
          <div className="w-5 h-5 rounded-full border-2 border-[#e1e1e1]" />
        )}
        {step.status === 'active' && (
          <div className="w-5 h-5 rounded-full border-2 border-[#2c80ff] border-t-transparent animate-spin" />
        )}
        {step.status === 'done' && (
          <div className="w-5 h-5 rounded-full bg-[#2c80ff] flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
      <div>
        <p
          className={`text-sm font-medium ${
            step.status === 'pending' ? 'text-[#818181]' : 'text-[#1f1f1f]'
          }`}
        >
          {step.label}
        </p>
        <p className="text-xs text-[#818181]">{step.description}</p>
      </div>
    </div>
  )
}
