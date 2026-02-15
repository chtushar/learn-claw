import type { VideoData, Section, Chart } from './schema'

export interface ProcessedDiagram {
  svgString: string
  type: string
  caption?: string
}

export interface ProcessedCode {
  htmlString: string
  language: string
  highlightLines?: number[]
  caption?: string
}

export interface ProcessedMath {
  htmlString: string
  caption?: string
}

export interface AudioInfo {
  blobUrl: string
  durationInSeconds: number
}

export interface ProcessedSection
  extends Omit<Section, 'diagram' | 'codeBlock' | 'math'> {
  processedDiagram?: ProcessedDiagram
  processedCode?: ProcessedCode
  processedMath?: ProcessedMath
  chart?: Chart
}

export interface ProcessedVideoData extends Omit<VideoData, 'sections'> {
  sections: ProcessedSection[]
  audioSegments: AudioInfo[]
}
