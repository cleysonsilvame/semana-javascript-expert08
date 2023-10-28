import { IncomingMessage, ServerResponse } from 'node:http'
import { pipeline } from 'node:stream/promises'

import UploadHandler from './uploadHandler.js'
import { logger } from './util.js'


interface RoutesProps {
    downloadsFolder: string
}

export default class Routes {
    #downloadsFolder
    constructor({ downloadsFolder }: RoutesProps) {
        this.#downloadsFolder = downloadsFolder
    }
    async options(_request: IncomingMessage, response: ServerResponse<IncomingMessage>) {
        console.log('passou options')
        response.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST'
        })
        response.end()
    }

    async get(_request: IncomingMessage, response: ServerResponse<IncomingMessage>) {
        response.writeHead(200, { Connection: 'close' });
        response.end(`
            <html>
                <head><title>File Upload - Cleyson Silva</title></head>
                <body>
                <form method="POST" enctype="multipart/form-data">
                    <input type="file" name="filefield"><br />
                    <input type="text" name="textfield"><br />
                    <input type="submit">
                </form>
                </body>
        </html>`
        );
    }
    async post(request: IncomingMessage, response: ServerResponse<IncomingMessage>) {
        const { headers } = request
        const redirectTo = headers.origin

        const uploadHandler = new UploadHandler({
            downloadsFolder: this.#downloadsFolder
        })

        const onFinish = (response: ServerResponse, _redirectTo?: string) => () => {
            response.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            })
            response.end('Files uploaded with success!')
        }

        const busboyInstance = uploadHandler
            .registerEvents(
                headers,
                onFinish(response, redirectTo)
            )

        await pipeline(
            request,
            busboyInstance
        )

        logger.info('Request finished with success!')
    }
}