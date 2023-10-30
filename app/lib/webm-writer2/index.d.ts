export interface WebMWritterProps {
  codec: string
  width: number
  height: number
  bitrate: number
}

export default class WebmWriter {
  constructor(options?: WebMWritterProps)

  addFrame(frame: VideoFrame): void
  getStream(): ReadableStream
}
