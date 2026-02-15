import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { AnimatedText } from '../components/AnimatedText'
import type { ProcessedSection } from '@/lib/processedSchema'

export const SummaryScene: React.FC<{
  topic: string
  summary: string
  sections: ProcessedSection[]
}> = ({ topic, summary, sections }) => {
  const frame = useCurrentFrame()

  const checkmarkOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)',
        padding: 48,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <AnimatedText
        text="Recap"
        delay={0}
        style={{
          fontSize: 20,
          color: '#6c63ff',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 4,
        }}
      />

      <AnimatedText
        text={topic}
        delay={8}
        style={{
          fontSize: 36,
          color: '#ffffff',
          fontWeight: 800,
          marginTop: 12,
          lineHeight: 1.2,
        }}
      />

      <AnimatedText
        text={summary}
        delay={18}
        style={{
          fontSize: 20,
          color: '#a0a0c0',
          marginTop: 12,
          lineHeight: 1.5,
          maxWidth: '95%',
        }}
      />

      <div style={{ marginTop: 36 }}>
        {sections.map((section, i) => (
          <AnimatedText
            key={i}
            text={`${section.iconEmoji}  ${section.title}`}
            delay={30 + i * 8}
            style={{
              fontSize: 22,
              color: '#c0c0e0',
              marginBottom: 10,
              fontWeight: 500,
            }}
          />
        ))}
      </div>

      <div
        style={{
          opacity: checkmarkOpacity,
          position: 'absolute',
          bottom: 48,
          left: 48,
          fontSize: 18,
          color: '#4ade80',
          fontWeight: 600,
        }}
      >
        Learning complete
      </div>
    </AbsoluteFill>
  )
}
