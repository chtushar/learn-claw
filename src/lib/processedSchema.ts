import type { VideoData, Section } from './schema'

export interface ProcessedDiagram {
  svgString: string
  type: string
  caption?: string
}

export interface ProcessedSection extends Omit<Section, 'diagram'> {
  processedDiagram?: ProcessedDiagram
}

export interface ProcessedVideoData extends Omit<VideoData, 'sections'> {
  sections: ProcessedSection[]
}
