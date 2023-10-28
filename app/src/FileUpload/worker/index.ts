import { CanvasRenderer } from './canvas-renderer'
import { MP4Demuxer } from './mp4-demuxer'
import { VideoProcessor } from './video-processor'

const qvgaConstraints = {
  width: 320,
  height: 240,
}
// const vgaConstraints = {
//   width: 640,
//   height: 480,
// }
// const hdConstraints = {
//   width: 1280,
//   height: 720,
// }

const encoderConfig = {
  ...qvgaConstraints,
  bitrate: 10e6,
  // WebM
  codec: 'vp09.00.10.08',
  pt: 4,
  hardwareAcceleration: 'prefer-software',

  // MP4
  // codec: 'avc1.42002A',
  // pt: 1,
  // hardwareAcceleration: 'prefer-hardware',
  // avc: { format: 'annexb' }
}

const mp4Demuxer = new MP4Demuxer()
const videoProcessor = new VideoProcessor({
  mp4Demuxer,
})

interface Message {
  data: { file: File; canvas: OffscreenCanvas }
}

onmessage = async ({ data }: Message) => {
  const canvasRenderer = new CanvasRenderer(data.canvas)

  await videoProcessor.start({
    file: data.file,
    renderFrame: canvasRenderer.render.bind(canvasRenderer),
    encoderConfig,
  })

  self.postMessage({
    status: 'done',
  })
}
