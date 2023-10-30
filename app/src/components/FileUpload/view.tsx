interface ViewProps {
  onFileUploadChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  fileName?: string
  fileSize?: string
  elapsed: string
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export function View({
  onFileUploadChange,
  fileName,
  fileSize,
  elapsed,
  canvasRef,
}: ViewProps) {
  return (
    <div className="frame-2">
      <div className="frame-wrapper">
        {!fileName && (
          <div id="fileUploadWrapper" className="frame-3">
            <div className="rectangle"></div>
            <div className="group-2">
              <div className="overlap-group">
                {/* <!-- input type=file only for mp4 hidden --> */}
                <label id="btnUploadVideos" className="text-wrapper-4">
                  <input
                    type="file"
                    id="fileUpload"
                    className="hide"
                    accept="video/mp4"
                    onChange={onFileUploadChange}
                  />
                  Select Videos to Upload
                </label>
              </div>
              <img className="img" src="/img/group-17-1.png" alt="" />
            </div>
          </div>
        )}
      </div>
      {!!fileName && (
        <div id="fileInfo" className="frame-4">
          {/* <!-- <div id="fileInfo" className="frame-4"> --> */}
          <div className="frame-5">
            <div id="fileName" className="text-wrapper-5">
              {fileName}
            </div>
            <div id="fileSize" className="text-wrapper-6">
              {fileSize}
            </div>

            <canvas ref={canvasRef} id="preview-144p"></canvas>

            <p className="p">
              <span id="elapsed">{elapsed}</span> <br />
            </p>
          </div>
          <div className="frame-6">
            <div className="rectangle-3"></div>
          </div>
          <img className="line" src="/img/line-1.svg" alt="" />
        </div>
      )}
    </div>
  )
}
