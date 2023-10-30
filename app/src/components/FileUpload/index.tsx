import { useLogic } from './logic'
import { View } from './view'

export function FileUpload() {
  const { onFileUploadChange, fileName, fileSize, took, canvasRef } = useLogic()
  return (
    <View
      onFileUploadChange={onFileUploadChange}
      fileName={fileName}
      fileSize={fileSize}
      elapsed={took}
      canvasRef={canvasRef}
    />
  )
}
