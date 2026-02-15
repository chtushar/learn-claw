import { AbsoluteFill, Audio } from 'remotion'
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
        }}
      />

      {/* Vertical stack: diagram on top, text on bottom */}
      <div
        style={{
          flex: '0 0 50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {section.processedDiagram && (
          <MermaidDiagram
            svgString={section.processedDiagram.svgString}
            delay={15}
            caption={section.processedDiagram.caption}
            maxWidth={900}
            maxHeight={600}
          />
        )}
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <BulletList items={section.keyPoints} startDelay={25} />
        <MarkdownText
          text={section.narration}
          delay={50}
          style={{
            fontSize: 18,
            color: '#a0a0c0',
            lineHeight: 1.6,
            marginTop: 20,
          }}
        />
      </div>
    </AbsoluteFill>
  )
}
