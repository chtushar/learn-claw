import { AbsoluteFill } from 'remotion'
import { AnimatedText } from '../components/AnimatedText'
import { BulletList } from '../components/BulletList'
import { MarkdownText } from '../components/MarkdownText'
import { ProgressBar } from '../components/ProgressBar'
import type { ProcessedSection } from '@/lib/processedSchema'

export const SectionScene: React.FC<{
  section: ProcessedSection
  index: number
  total: number
}> = ({ section, index, total }) => {
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)',
        padding: 80,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <ProgressBar current={index + 1} total={total} />

      <AnimatedText
        text={`${section.iconEmoji}  Section ${index + 1}`}
        delay={0}
        style={{
          fontSize: 24,
          color: '#6c63ff',
          fontWeight: 600,
          marginTop: 40,
        }}
      />

      <AnimatedText
        text={section.title}
        delay={10}
        style={{
          fontSize: 52,
          color: '#ffffff',
          fontWeight: 800,
          marginTop: 16,
        }}
      />

      <BulletList items={section.keyPoints} startDelay={25} />

      <MarkdownText
        text={section.narration}
        delay={50}
        style={{
          fontSize: 22,
          color: '#a0a0c0',
          lineHeight: 1.6,
          position: 'absolute',
          bottom: 80,
          left: 80,
          right: 80,
        }}
      />
    </AbsoluteFill>
  )
}
