import { AbsoluteFill, Audio } from 'remotion'
import { AnimatedText } from '../components/AnimatedText'
import { ProgressiveRevealDiagram } from '../components/ProgressiveRevealDiagram'
import { ProgressBar } from '../components/ProgressBar'
import type { ProcessedSection } from '@/lib/processedSchema'

export const DiagramScene: React.FC<{
  section: ProcessedSection
  index: number
  total: number
  audioSrc?: string
}> = ({ section, index, total, audioSrc }) => {
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)',
        padding: 48,
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {audioSrc && <Audio src={audioSrc} />}

      <ProgressBar current={index + 1} total={total} />

      <AnimatedText
        text={`${section.iconEmoji}  ${section.title}`}
        delay={0}
        style={{
          fontSize: 30,
          color: '#ffffff',
          fontWeight: 700,
          marginTop: 20,
          marginBottom: 20,
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
            maxWidth={960}
            maxHeight={800}
          />
        )}
      </div>

      {section.processedDiagram?.caption && (
        <AnimatedText
          text={section.processedDiagram.caption}
          delay={60}
          style={{
            fontSize: 16,
            color: '#8b8ba7',
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        />
      )}
    </AbsoluteFill>
  )
}
