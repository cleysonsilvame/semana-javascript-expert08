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
    <div className="desktop">
      <div className="div">
        <div className="overlap">
          <div className="div-headerwrapper">
            <div className="div-headercontainer">
              <div className="div-logo-wrapper">
                <div className="div-logo">
                  <img
                    className="button-desktop"
                    src="/img/button-desktop-navigation.svg"
                    alt=""
                  />
                  <div className="group">
                    <div className="frame">
                      <a href="/pages/home">
                        <div className="text-wrapper">JS Expert</div>
                      </a>
                      <div className="div-wrapper">
                        <div className="text-wrapper-2">hub</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-fieldset-wrapper">
                <div className="form-fieldset">
                  <div className="div-2">
                    <div className="button-pesquisa">
                      <img
                        className="iconamoon-search"
                        src="/img/iconamoon-search-light-1.svg"
                        alt=""
                      />
                      <div className="pseudo">
                        <div className="icon"></div>
                      </div>
                    </div>
                    <div className="label">
                      <div className="input-search">
                        <div className="div-placeholder">
                          <div className="text-wrapper-3">
                            Busca jsexperthub
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img className="link" src="/img/link.svg" alt="" />
        </div>
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

        <div className="frame-7">
          <div className="frame-8">
            <div className="text-wrapper-7">JS Expert</div>
            <div className="frame-9">
              <div className="text-wrapper-2">hub</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
