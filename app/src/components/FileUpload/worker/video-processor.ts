import WebMWritter from 'webm-writer2'
import { MP4Demuxer } from './mp4-demuxer'
import { Service } from './service'

interface StartProps {
  file: File
  encoderConfig: VideoEncoderConfig
  renderFrame: (frame: VideoFrame) => void
  sendMessage: (message: unknown) => void
}

interface VideoProcessorProps {
  mp4Demuxer: MP4Demuxer
  webMWriter: WebMWritter
  service: Service
}

export class VideoProcessor {
  #mp4Demuxer: MP4Demuxer
  #webMWriter: WebMWritter
  #service: Service
  // #buffers: Uint8Array[] = []

  constructor({ mp4Demuxer, webMWriter, service }: VideoProcessorProps) {
    this.#mp4Demuxer = mp4Demuxer
    this.#webMWriter = webMWriter
    this.#service = service
  }

  async start({ file, encoderConfig, renderFrame, sendMessage }: StartProps) {
    const stream = file.stream()
    const [filename] = file.name.split('.')

    await this.#mp4Decoder(stream)
      .pipeThrough(this.#encode144p(encoderConfig))
      .pipeThrough(this.#renderDecodedFramesAndGetEncodedChunks(renderFrame))
      .pipeThrough(this.#transformIntoWebM())
      // .pipeThrough(
      //   new TransformStream({
      //     transform: ({ data }, controller) => {
      //       this.#buffers.push(data)
      //       controller.enqueue(data)
      //     },
      //     flush: () => {
      //       sendMessage({
      //         status: 'done',
      //         buffers: this.#buffers,
      //         filename: filename.concat('-144p.webm'),
      //       })
      //     },
      //   }),
      // )
      .pipeTo(this.#upload(filename, '144p', 'webm'))

    sendMessage({
      status: 'done',
    })
  }

  #mp4Decoder(stream: ReadableStream) {
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
          onConfig: async (config) => {
            const { supported } = await VideoDecoder.isConfigSupported(config)

            if (!supported) {
              console.error('mp4Muxer unsupported config', config)
              return
            }

            decoder.configure(config)
          },
          onChunk: decoder.decode.bind(decoder),
        })
      },
    })
  }

  #encode144p(encoderConfig: VideoEncoderConfig) {
    let _encoder: VideoEncoder

    const readable = new ReadableStream({
      start: async (controller) => {
        const { supported } =
          await VideoEncoder.isConfigSupported(encoderConfig)
        if (!supported) {
          const message = 'enconde144p VideoEncoder config not supported!'
          console.error(message, encoderConfig)
          controller.error(message)
          return
        }

        _encoder = new VideoEncoder({
          output: (frame, config) => {
            if (config?.decoderConfig) {
              const decoderConfig = {
                type: 'config',
                config: config.decoderConfig,
              }
              controller.enqueue(decoderConfig)
            }

            controller.enqueue(frame)
          },
          error: (err) => {
            console.error('VideoEncoder 144p', err)
            controller.error(err)
          },
        })

        _encoder.configure(encoderConfig)
      },
    })

    const writable = new WritableStream({
      async write(frame) {
        _encoder.encode(frame)
        frame.close()
      },
    })

    return {
      readable,
      writable,
    }
  }

  #renderDecodedFramesAndGetEncodedChunks(
    renderFrame: (frame: VideoFrame) => void,
  ) {
    let _decoder: VideoDecoder
    return new TransformStream({
      start: (controller) => {
        _decoder = new VideoDecoder({
          output(frame) {
            renderFrame(frame)
          },
          error(e) {
            console.error('error at renderFrames', e)
            controller.error(e)
          },
        })
      },
      async transform(encodedChunk, controller) {
        if (encodedChunk.type === 'config') {
          _decoder.configure(encodedChunk.config)
          return
        }

        _decoder.decode(encodedChunk)
        controller.enqueue(encodedChunk)
      },
    })
  }

  #transformIntoWebM() {
    const writable = new WritableStream({
      write: (chunk) => {
        this.#webMWriter.addFrame(chunk)
      },
    })
    return {
      readable: this.#webMWriter.getStream(),
      writable,
    }
  }

  #upload(filename: string, resolution: string, type: string) {
    const chunks: Uint8Array[] = []
    let byteCount = 0
    let segmentCount = 0
    const triggerUpload = async (chunks: Uint8Array[]) => {
      const blob = new Blob(chunks, { type: 'video/webm' })

      await this.#service.uploadFile(
        `${filename}-${resolution}.${++segmentCount}.${type}`,
        blob,
      )

      chunks.length = 0
      byteCount = 0
    }

    return new WritableStream({
      async write({ data }) {
        const LIMIT = 10e6 // 10MB

        chunks.push(data)
        byteCount += data.byteLength

        if (byteCount <= LIMIT) return

        await triggerUpload(chunks)
        // renderFrame(frame)
      },
      async close() {
        if (!chunks.length) return
        await triggerUpload(chunks)
      },
    })
  }
}
