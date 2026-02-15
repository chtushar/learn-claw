import { AbsoluteFill, Audio } from 'remotion'
import { AnimatedText } from '../components/AnimatedText'
import { BulletList } from '../components/BulletList'
import { MarkdownText } from '../components/MarkdownText'
import { ProgressBar } from '../components/ProgressBar'
import type { ProcessedSection } from '@/lib/processedSchema'

export const SectionScene: React.FC<{
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
      }}
    >
      {audioSrc && <Audio src={audioSrc} />}

      <ProgressBar current={index + 1} total={total} />

      <AnimatedText
        text={`${section.iconEmoji}  Section ${index + 1}`}
        delay={0}
        style={{
          fontSize: 20,
          color: '#6c63ff',
          fontWeight: 600,
          marginTop: 32,
        }}
      />

      <AnimatedText
        text={section.title}
        delay={10}
        style={{
          fontSize: 36,
          color: '#ffffff',
          fontWeight: 800,
          marginTop: 12,
          lineHeight: 1.2,
        }}
      />

      <BulletList items={section.keyPoints} startDelay={25} />

      <MarkdownText
        text={section.narration}
        delay={50}
        style={{
          fontSize: 20,
          color: '#a0a0c0',
          lineHeight: 1.6,
          position: 'absolute',
          bottom: 48,
          left: 48,
          right: 48,
        }}
      />
    </AbsoluteFill>
  )
}
