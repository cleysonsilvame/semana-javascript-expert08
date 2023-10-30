import {
  DataStream,
  MP4File,
  MP4Info,
  MP4Sample,
  MP4Track,
  createFile,
} from 'mp4box'

// interface OnConfigOptions {
//   codec: string
//   codedHeight: number
//   codedWidth: number
//   description: Uint8Array
//   durationSecs: number
// }

interface RunOptions {
  onConfig: (config: VideoDecoderConfig) => void
  onChunk: (chunk: EncodedVideoChunk) => void
}

export class MP4Demuxer {
  #onConfig: RunOptions['onConfig'] = () => null
  #onChunk: RunOptions['onChunk'] = () => null
  #file: MP4File | null = null

  async run(stream: ReadableStream, options: RunOptions) {
    this.#onConfig = options.onConfig
    this.#onChunk = options.onChunk

    this.#file = createFile()

    this.#file.onReady = this.#onReady.bind(this)
    this.#file.onSamples = this.#onSamples.bind(this)

    this.#file.onError = (e) => {
      console.log('onError', e)
    }

    return this.#init(stream)
  }

  #init(stream: ReadableStream) {
    let _offset = 0
    const writable = new WritableStream<Uint8Array>({
      write: (chunk) => {
        const copy = chunk.buffer

        this.#file?.appendBuffer(
          Object.assign(copy, {
            fileStart: _offset,
          }),
        )

        _offset += chunk.length
      },
      close: () => {
        this.#file?.flush()
      },
    })

    return stream.pipeTo(writable)
  }

  #onReady(info: MP4Info) {
    const [track] = info.videoTracks

    this.#onConfig({
      codec: track.codec,
      codedHeight: track.video.height,
      codedWidth: track.video.width,
      description: this.#description(track),
      // durationSecs: track.duration / track.timescale,
    })

    this.#file?.setExtractionOptions(track.id)
    this.#file?.start()
  }

  #onSamples(_trackId: number, _user: unknown, samples: MP4Sample[]) {
    for (const sample of samples) {
      this.#onChunk(
        new EncodedVideoChunk({
          type: sample.is_sync ? 'key' : 'delta',
          timestamp: (1e6 * sample.cts) / sample.timescale,
          duration: (1e6 * sample.duration) / sample.timescale,
          data: sample.data,
        }),
      )
    }
  }

  #description(track: MP4Track) {
    const trak = this.#file?.getTrackById(track.id)

    const entries = trak?.mdia?.minf?.stbl?.stsd?.entries

    if (!entries) {
      throw new Error('entries not found')
    }

    for (const entry of entries) {
      const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C
      if (box) {
        const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN)
        box.write(stream)
        return new Uint8Array(stream.buffer, 8) // Remove the box header.
      }
    }

    throw new Error('avcC, hvcC, vpcC, or av1C box not found')
  }
}
