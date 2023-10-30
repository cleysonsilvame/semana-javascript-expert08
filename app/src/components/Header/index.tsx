export function Header() {
  return (
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
                      <div className="text-wrapper-3">Busca jsexperthub</div>
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
  )
}
