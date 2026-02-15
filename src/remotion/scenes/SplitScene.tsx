import { AbsoluteFill } from 'remotion'
import { AnimatedText } from '../components/AnimatedText'
import { BulletList } from '../components/BulletList'
import { MermaidDiagram } from '../components/MermaidDiagram'
import { MarkdownText } from '../components/MarkdownText'
import { ProgressBar } from '../components/ProgressBar'
import type { ProcessedSection } from '@/lib/processedSchema'

export const SplitScene: React.FC<{
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
          marginBottom: 32,
        }}
      />

      <div style={{ display: 'flex', flex: 1, gap: 48 }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <BulletList items={section.keyPoints} startDelay={15} />
          <MarkdownText
            text={section.narration}
            delay={50}
            style={{
              fontSize: 20,
              color: '#a0a0c0',
              lineHeight: 1.6,
              marginTop: 32,
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {section.processedDiagram && (
            <MermaidDiagram
              svgString={section.processedDiagram.svgString}
              delay={20}
              caption={section.processedDiagram.caption}
              maxWidth={800}
              maxHeight={650}
            />
          )}
        </div>
      </div>
    </AbsoluteFill>
  )
}
