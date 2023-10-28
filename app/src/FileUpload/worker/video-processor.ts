import { MP4Demuxer } from './mp4-demuxer'

interface EncoderConfig {
  bitrate: number
  codec: string
  pt: number
  hardwareAcceleration: string
  width: number
  height: number
}

interface StartProps {
  file: File
  encoderConfig: EncoderConfig
  renderFrame: (frame: VideoFrame) => void
}

interface VideoProcessorProps {
  mp4Demuxer: MP4Demuxer
}

export class VideoProcessor {
  #mp4Demuxer: MP4Demuxer

  constructor({ mp4Demuxer }: VideoProcessorProps) {
    this.#mp4Demuxer = mp4Demuxer
  }

  async start({ file, encoderConfig, renderFrame }: StartProps) {
    const stream = file.stream()
    const [filename] = file.name.split('.')

    await this.#mp4Decoder(stream, encoderConfig).pipeTo(
      new WritableStream({
        write: renderFrame.bind(renderFrame),
      }),
    )
  }

  #mp4Decoder(stream: ReadableStream, encoderConfig: EncoderConfig) {
    return new ReadableStream({
      start: async (controller) => {
        const decoder = new VideoDecoder({
          output: controller.enqueue.bind(controller),
          error(e) {
            console.error('error at mp4Decoder', e)
            controller.error(e)
          },
        })

        await this.#mp4Demuxer.run(stream, {
          onConfig: decoder.configure.bind(decoder),
          onChunk: decoder.decode.bind(decoder),
        })

        setTimeout(() => {
          controller.close()
        }, 1000)
      },
    })
  }
}
