interface ServiceProps {
  url: string
}

export class Service {
  #url

  constructor({ url }: ServiceProps) {
    this.#url = url
  }

  async uploadFile(filename: string, fileBuffer: Blob) {
    const formData = new FormData()
    formData.append('file', fileBuffer, filename)

    const response = await fetch(this.#url, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`)
    }
  }
}
