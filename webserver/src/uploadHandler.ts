import Busboy, { FileInfo } from 'busboy'

import { createWriteStream } from 'node:fs'
import { IncomingHttpHeaders } from 'node:http'
import { pipeline } from 'node:stream/promises'
import { join } from 'node:path'
import { Readable } from 'node:stream'

import { logger } from './util.js'

interface UploadHandlerProps {
  downloadsFolder: string
}

export default class UploadHandler {
  #downloadsFolder
  constructor({ downloadsFolder }: UploadHandlerProps) {
    this.#downloadsFolder = downloadsFolder
  }

  registerEvents(headers: IncomingHttpHeaders, onFinish: () => void) {
    const busboy = Busboy({ headers })

    busboy.on('file', this.#onFile.bind(this))

    busboy.on('finish', onFinish)

    return busboy
  }

  async #onFile(name: string, file: Readable, _info: FileInfo) {
    const saveFileTo = join(this.#downloadsFolder, name)
    logger.info('Uploading: ' + saveFileTo)

    await pipeline(file, createWriteStream(saveFileTo))

    logger.info(`File [${name}] finished!`)
  }
}
