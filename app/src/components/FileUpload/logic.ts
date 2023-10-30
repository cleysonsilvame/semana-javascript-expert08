import React, { useCallback, useEffect, useMemo } from 'react'
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

  function getCanvas() {
    return canvasRef.current?.transferControlToOffscreen()
  }

  function parseBytesIntoMBAndGB(bytes: number) {
    const mb = bytes / (1024 * 1024)
    if (mb > 1024) {
      return `${Math.round(mb / 1024)}GB`
    }
    return `${Math.round(mb)}MB`
  }

  function onFileUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.item(0)
    setFile(file as File)
  }

  const { fileSize, fileName } = useMemo(
    () => ({
      fileName: file?.name,
      fileSize: parseBytesIntoMBAndGB(Number(file?.size)),
    }),
    [file],
  )

  function updateElapsedTime(time: string) {
    setTook(`Process started ${time}`)
  }

  const finishElapsedTime = useCallback(() => {
    clock.stop()
    setTook((state) => `${state.replace('started', 'took').replace('ago', '')}`)
  }, [])

  const downloadBlobAsFile = useCallback(
    (buffers: Uint8Array[], filename: string) => {
      const blob = new Blob(buffers, { type: 'video/webm' })

      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')

      link.href = url
      link.download = filename

      link.click()

      URL.revokeObjectURL(url)
    },
    [],
  )

  const onMessageWorker = useCallback(() => {
    worker.onmessage = ({ data }) => {
      if (data.status !== 'done') return

      finishElapsedTime()

      if (!data.buffers) return

      downloadBlobAsFile(data.buffers, data.filename)
    }

    return () => {
      worker.onmessage = null
    }
  }, [finishElapsedTime, downloadBlobAsFile])

  const initWorkerProcess = useCallback(() => {
    if (file && !took) {
      const canvas = getCanvas()!
      worker.postMessage(
        {
          file,
          canvas,
        },
        [canvas],
      )

      clock.start(updateElapsedTime)
    }
  }, [file, took])

  useEffect(() => {
    initWorkerProcess()
  }, [initWorkerProcess])

  useEffect(onMessageWorker, [onMessageWorker])

  return {
    onFileUploadChange,
    fileSize,
    fileName,
    took,
    canvasRef,
  }
}
