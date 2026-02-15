import { AbsoluteFill } from 'remotion'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'
import { TitleScene } from './scenes/TitleScene'
import { SectionScene } from './scenes/SectionScene'
import { DiagramScene } from './scenes/DiagramScene'
import { SplitScene } from './scenes/SplitScene'
import { SummaryScene } from './scenes/SummaryScene'
import { getSectionDurationFrames } from './lib/calculations'
import {
  TITLE_SCENE_DURATION_FRAMES,
  SUMMARY_SCENE_DURATION_FRAMES,
  TRANSITION_DURATION_FRAMES,
} from './lib/constants'
import type {
  ProcessedVideoData,
  ProcessedSection,
} from '@/lib/processedSchema'

function renderSectionScene(
  section: ProcessedSection,
  index: number,
  total: number,
  audioSrc?: string,
) {
  switch (section.sceneType) {
    case 'diagram':
      return (
        <DiagramScene
          section={section}
          index={index}
          total={total}
          audioSrc={audioSrc}
        />
      )
    case 'split':
      return (
        <SplitScene
          section={section}
          index={index}
          total={total}
          audioSrc={audioSrc}
        />
      )
    case 'text':
    default:
      return (
        <SectionScene
          section={section}
          index={index}
          total={total}
          audioSrc={audioSrc}
        />
      )
  }
}

export const VideoComposition: React.FC<ProcessedVideoData> = (props) => {
  const { topic, summary, sections, audioSegments } = props

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f0f23' }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          durationInFrames={TITLE_SCENE_DURATION_FRAMES}
        >
          <TitleScene topic={topic} sectionCount={sections.length} />
        </TransitionSeries.Sequence>

        {sections.flatMap((section, index) => {
          const audioInfo = audioSegments?.[index]
          const durationInFrames = getSectionDurationFrames(
            audioInfo,
            section.durationWeight,
            section.sceneType,
          )

          return [
            <TransitionSeries.Transition
              key={`t-${index}`}
              timing={linearTiming({
                durationInFrames: TRANSITION_DURATION_FRAMES,
              })}
              presentation={index % 2 === 0 ? fade() : slide()}
            />,
            <TransitionSeries.Sequence
              key={`s-${index}`}
              durationInFrames={durationInFrames}
            >
              {renderSectionScene(
                section,
                index,
                sections.length,
                audioInfo?.blobUrl,
              )}
            </TransitionSeries.Sequence>,
          ]
        })}

        <TransitionSeries.Transition
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATION_FRAMES,
          })}
          presentation={fade()}
        />
        <TransitionSeries.Sequence
          durationInFrames={SUMMARY_SCENE_DURATION_FRAMES}
        >
          <SummaryScene topic={topic} summary={summary} sections={sections} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  )
}
