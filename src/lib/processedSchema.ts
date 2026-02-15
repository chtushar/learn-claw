import type { VideoData, Section } from './schema'

export interface ProcessedDiagram {
  svgString: string
  type: string
  caption?: string
}

export interface AudioInfo {
  blobUrl: string
  durationInSeconds: number
}

export interface ProcessedSection extends Omit<Section, 'diagram'> {
  processedDiagram?: ProcessedDiagram
}

export interface ProcessedVideoData extends Omit<VideoData, 'sections'> {
  sections: ProcessedSection[]
  audioSegments: AudioInfo[]
}
