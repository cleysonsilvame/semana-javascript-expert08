export class CanvasRenderer {
  #pendingFrame: VideoFrame | null = null
  #ctx: OffscreenCanvasRenderingContext2D

  constructor(canvas: OffscreenCanvas) {
    if (!canvas) {
      throw new Error('Canvas element is required.')
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('2D rendering context is not available.')
    }

    this.#ctx = ctx
  }

  render(frame: VideoFrame) {
    if (this.#pendingFrame) {
      this.#pendingFrame.close()
    }

    this.#pendingFrame = frame

    requestAnimationFrame(() => {
      this.draw()
      this.#pendingFrame = null
    })
  }

  private draw() {
    if (!this.#pendingFrame) return

    const { displayHeight, displayWidth } = this.#pendingFrame

    this.#ctx.canvas.width = displayWidth
    this.#ctx.canvas.height = displayHeight

    this.#ctx.drawImage(this.#pendingFrame, 0, 0, displayWidth, displayHeight)
    this.#pendingFrame.close()
  }
}
