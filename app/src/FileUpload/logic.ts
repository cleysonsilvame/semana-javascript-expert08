import React, { useEffect, useMemo } from 'react'
import Clock from './clock'

import Worker from './worker?worker'

const clock = new Clock()

const worker = new Worker()

worker.onerror = (error) => {
  console.error('error worker', error.message)
}

export function useLogic() {
  const [took, setTook] = React.useState('')
  const [file, setFile] = React.useState<File | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  // #fileUpload = document.getElementById('fileUpload')
  // #btnUploadVideo = document.getElementById('btnUploadVideos')
  // #fileSize = document.getElementById('fileSize')
  // #fileInfo = document.getElementById('fileInfo')
  // #txtfileName = document.getElementById('fileName')
  // #fileUploadWrapper = document.getElementById('fileUploadWrapper')
  // #elapsed = document.getElementById('elapsed')
  // /** @type {HTMLCanvasElement} */
  // #canvas = document.getElementById('preview-144p')

  //
  // constructor() {
  //   this.configureBtnUploadClick()
  // }

  function getCanvas() {
    return canvasRef.current?.transferControlToOffscreen()
  }

  function parseBytesIntoMBAndGB(bytes: number) {
    const mb = bytes / (1024 * 1024)
    // if mb is greater than 1024, then convert to GB
    if (mb > 1024) {
      // rount to 2 decimal places
      return `${Math.round(mb / 1024)}GB`
    }
    return `${Math.round(mb)}MB`
  }

  // configureBtnUploadClick() {
  //   this.#btnUploadVideo.addEventListener('click', () => {
  //     // trigger file input
  //     this.#fileUpload.click()
  //   })
  // }

  function onFileUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.item(0)
    setFile(file as File)
  }

  // updateElapsedTime(text) {
  //   this.#elapsed.innerText = text
  // }

  // configureOnFileChange(fn) {
  //   this.#fileUpload.addEventListener('change', this.onChange(fn))
  // }

  const { fileSize, fileName } = useMemo(
    () => ({
      fileName: file?.name,
      fileSize: parseBytesIntoMBAndGB(Number(file?.size)),
    }),
    [file],
  )

  useEffect(() => {
    if (file) {
      const canvas = getCanvas()!
      worker.postMessage(
        {
          file,
          canvas,
        },
        [canvas],
      )

      clock.start((time) => {
        setTook(`Process started ${time}`)
      })
    }
  }, [file])

  useEffect(() => {
    worker.onmessage = ({ data }) => {
      if (data.status !== 'done') return

      clock.stop()
      setTook(`${took.replace('started', 'took').replace('ago', '')}`)
    }

    return () => {
      worker.onmessage = null
    }
  }, [took])

  return {
    onFileUploadChange,
    fileSize,
    fileName,
    took,
    canvasRef,
  }
}
