import { AbsoluteFill } from 'remotion'
import { AnimatedText } from '../components/AnimatedText'
import { ProgressiveRevealDiagram } from '../components/ProgressiveRevealDiagram'
import { ProgressBar } from '../components/ProgressBar'
import type { ProcessedSection } from '@/lib/processedSchema'

export const DiagramScene: React.FC<{
  section: ProcessedSection
  index: number
  total: number
}> = ({ section, index, total }) => {
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)',
        padding: 60,
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ProgressBar current={index + 1} total={total} />

      <AnimatedText
        text={`${section.iconEmoji}  ${section.title}`}
        delay={0}
        style={{
          fontSize: 36,
          color: '#ffffff',
          fontWeight: 700,
          marginTop: 24,
          marginBottom: 24,
          textAlign: 'center',
        }}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {section.processedDiagram && (
          <ProgressiveRevealDiagram
            svgString={section.processedDiagram.svgString}
            startDelay={15}
            frameBetweenElements={6}
            maxWidth={1600}
            maxHeight={750}
          />
        )}
      </div>

      {section.processedDiagram?.caption && (
        <AnimatedText
          text={section.processedDiagram.caption}
          delay={60}
          style={{
            fontSize: 18,
            color: '#8b8ba7',
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        />
      )}
    </AbsoluteFill>
  )
}
