import WebmWriter from 'webm-writer2'
import { CanvasRenderer } from './canvas-renderer'
import { MP4Demuxer } from './mp4-demuxer'
import { VideoProcessor } from './video-processor'
import { Service } from './service'
import { getEncoderConfig, getWebmWriterConfig } from './encoder-config'

const encoderConfig = getEncoderConfig('qvga', 'webm')
const webmWriterConfig = getWebmWriterConfig(encoderConfig)

const mp4Demuxer = new MP4Demuxer()
const webMWriter = new WebmWriter(webmWriterConfig)
const service = new Service({ url: 'http://localhost:3000' })

const videoProcessor = new VideoProcessor({
  mp4Demuxer,
  webMWriter,
  service,
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
    sendMessage: self.postMessage.bind(self),
  })
}
