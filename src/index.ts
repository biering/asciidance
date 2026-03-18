export type SizeMode = 'window' | 'element'

export interface AsciiDanceOptions {
  // Look
  bg: string
  fg: string
  palette: string // ordered light -> dark
  fontPx: number
  contrast: number

  // Animation
  speed: number // overall time factor
  scale: number // spatial scale (higher => finer detail)
  opacityBase: number // min alpha [0..1]
  opacityVar: number // alpha variation [0..1]
  reducedMotionFallback: boolean

  // Noise shaping
  seed: number
  cellSize: number
  octaves: number
  lacunarity: number
  gain: number
  plateauSteps: number | null
  warpAmp: number
  warpFreq: number

  // Motion
  driftAmp: number // px/sec-ish, set 0 to disable one-way drift
  wobbleAmp: number // px
  wobbleFreq: number // Hz

  // Tonemapping
  autoLevel: boolean // stretch to [0..1] via EMA
  autoLevelDecay: number // 0.92..0.995
  gamma: number // 0.6..2.2
  invert: boolean

  // Sizing
  sizeMode: SizeMode // "window" or "element"
}

export const DEFAULTS: AsciiDanceOptions = {
  bg: '#0a1118',
  fg: '#91a4b4',
  palette: ' .,:;=+*#%@',
  fontPx: 12,
  contrast: 1.12,

  speed: 0.014,
  scale: 0.075,
  opacityBase: 0.45,
  opacityVar: 0.35,
  reducedMotionFallback: true,

  seed: 1337,
  cellSize: 140,
  octaves: 2,
  lacunarity: 1.8,
  gain: 0.45,
  plateauSteps: 5,
  warpAmp: 18,
  warpFreq: 0.75,

  driftAmp: 0,
  wobbleAmp: 28,
  wobbleFreq: 0.06,

  autoLevel: true,
  autoLevelDecay: 0.97,
  gamma: 1.0,
  invert: false,

  sizeMode: 'window',
}

export class AsciiDance {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private opts: AsciiDanceOptions
  private dpr = 1
  private raf = 0
  private prefersReduced = false
  private lo = 1
  private hi = 0 // EMA bounds
  private glyphW = 8
  private glyphH = 16
  private started = false
  private activeSizeMode?: SizeMode
  private resizeObs?: ResizeObserver
  private warpX = 0
  private warpY = 0
  private toneWeight = 0

  constructor(
    canvas: HTMLCanvasElement,
    options: Partial<AsciiDanceOptions> = {},
  ) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) throw new Error('2D context unavailable')
    this.ctx = ctx
    this.opts = { ...DEFAULTS, ...options }
    this.prefersReduced =
      this.opts.reducedMotionFallback &&
      typeof window !== 'undefined' &&
      'matchMedia' in window &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    this.onResize = this.onResize.bind(this)
    this.resize()
  }

  /** Start the animation loop */
  start() {
    if (this.started) return
    this.started = true
    this.attachResizeWatcher(this.opts.sizeMode)
    this.raf = requestAnimationFrame((t) => this.render(t))
  }

  /** Stop the loop (can be restarted with start()) */
  stop() {
    this.started = false
    cancelAnimationFrame(this.raf)
    this.detachResizeWatcher()
  }

  /** Destroy and clean up listeners */
  destroy() {
    this.stop()
    // no-op beyond stop; kept for symmetry
  }

  /** Update options at runtime */
  update(next: Partial<AsciiDanceOptions>) {
    const beforeFont = this.opts.fontPx
    const beforePalette = this.opts.palette
    const prevSizeMode = this.activeSizeMode ?? this.opts.sizeMode
    this.opts = { ...this.opts, ...next }
    if (
      beforeFont !== this.opts.fontPx ||
      beforePalette !== this.opts.palette
    ) {
      this.setFont()
      this.measureGlyphs()
    }
    const sizeModeChanged =
      typeof next.sizeMode === 'string' && next.sizeMode !== prevSizeMode
    if (this.started && sizeModeChanged) {
      this.detachResizeWatcher()
      this.attachResizeWatcher(this.opts.sizeMode)
    }
    if (sizeModeChanged) this.onResize()
    // reset autoLevel bounds if toggled
    if (typeof next.autoLevel === 'boolean') {
      this.lo = 1
      this.hi = 0
    }
  }

  /** Set up resize listener/observer based on current size mode */
  private attachResizeWatcher(mode: SizeMode) {
    this.activeSizeMode = mode
    if (mode === 'window') {
      window.addEventListener('resize', this.onResize, { passive: true })
      return
    }
    if ('ResizeObserver' in window) {
      this.resizeObs = new ResizeObserver(() => this.resize())
      this.resizeObs.observe(this.canvas)
    }
  }

  /** Tear down any resize listeners to avoid leaks when switching modes */
  private detachResizeWatcher() {
    if (this.activeSizeMode === 'window') {
      window.removeEventListener('resize', this.onResize)
    } else {
      this.resizeObs?.disconnect()
    }
    this.resizeObs = undefined
    this.activeSizeMode = undefined
  }

  /** Expose current options (read-only) */
  getOptions(): Readonly<AsciiDanceOptions> {
    return this.opts
  }

  /** Force resize (e.g., container size changed) */
  resize() {
    this.onResize()
  }

  // ---------- internal: sizing / font ----------
  private setFont() {
    const { fontPx } = this.opts
    this.ctx.font = `${fontPx}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`
    this.ctx.textBaseline = 'top'
  }

  private measureGlyphs() {
    this.glyphW = this.ctx.measureText('M').width
    this.glyphH = this.opts.fontPx * 1.35
  }

  private onResize() {
    this.dpr = Math.max(1, window.devicePixelRatio || 1)
    const cssW =
      this.opts.sizeMode === 'window'
        ? window.innerWidth
        : Math.max(1, this.canvas.clientWidth || this.canvas.offsetWidth || 1)
    const cssH =
      this.opts.sizeMode === 'window'
        ? window.innerHeight
        : Math.max(1, this.canvas.clientHeight || this.canvas.offsetHeight || 1)

    this.canvas.style.width = cssW + 'px'
    this.canvas.style.height = cssH + 'px'
    this.canvas.width = Math.floor(cssW * this.dpr)
    this.canvas.height = Math.floor(cssH * this.dpr)
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0) // draw in CSS px
    this.setFont()
    this.measureGlyphs()
  }

  // ---------- internal: noise utilities ----------
  private ihash(x: number, y: number, s: number) {
    let n = (x | 0) * 374761393 + (y | 0) * 668265263 + (s | 0) * 1442695041
    n = (n ^ (n >>> 13)) | 0
    n = Math.imul(n, 1274126177)
    n ^= n >>> 16
    return n >>> 0
  }
  private rand01(x: number, y: number, s: number) {
    return this.ihash(x, y, s) / 0xffffffff
  }
  private smooth5(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  private valueNoise2D(x: number, y: number, seed: number, cellSize: number) {
    const gx = Math.floor(x / cellSize),
      gy = Math.floor(y / cellSize)
    const tx = (x - gx * cellSize) / cellSize,
      ty = (y - gy * cellSize) / cellSize
    const u = this.smooth5(tx),
      v = this.smooth5(ty)
    const v00 = this.rand01(gx, gy, seed),
      v10 = this.rand01(gx + 1, gy, seed)
    const v01 = this.rand01(gx, gy + 1, seed),
      v11 = this.rand01(gx + 1, gy + 1, seed)
    const vx0 = v00 + (v10 - v00) * u,
      vx1 = v01 + (v11 - v01) * u
    return vx0 + (vx1 - vx0) * v // [0,1]
  }

  private fbm2D(
    x: number,
    y: number,
    seed: number,
    cellSize: number,
    octaves: number,
    lacunarity: number,
    gain: number,
  ) {
    let amp = 1,
      freq = 1,
      sum = 0,
      norm = 0
    for (let i = 0; i < octaves; i++) {
      const cs = cellSize / freq
      sum += this.valueNoise2D(x, y, seed + i * 17, cs) * amp
      norm += amp
      amp *= gain
      freq *= lacunarity
    }
    return sum / Math.max(1e-6, norm) // [0,1]
  }

  private domainWarp(
    x: number,
    y: number,
    t: number,
    amp: number,
    freq: number,
    seed: number,
    cellSize: number,
  ): void {
    if (amp === 0) {
      this.warpX = x
      this.warpY = y
      return
    }
    const sx = this.fbm2D(
      x * freq + t * 20,
      y * freq,
      seed ^ 0x9e37,
      cellSize,
      1,
      2,
      0.5,
    )
    const sy = this.fbm2D(
      x * freq,
      y * freq + t * 17,
      seed ^ 0x85eb,
      cellSize,
      1,
      2,
      0.5,
    )
    this.warpX = x + (sx - 0.5) * 2 * amp
    this.warpY = y + (sy - 0.5) * 2 * amp
  }

  private tonemapIndex(val01: number, paletteLastIdx: number) {
    const o = this.opts
    let v = val01

    if (o.autoLevel) {
      this.lo = Math.min(
        this.lo * o.autoLevelDecay + v * (1 - o.autoLevelDecay),
        this.lo,
      )
      this.hi = Math.max(
        this.hi * o.autoLevelDecay + v * (1 - o.autoLevelDecay),
        this.hi,
      )
      const span = Math.max(1e-3, this.hi - this.lo)
      v = (v - this.lo) / span
    }
    if (typeof o.plateauSteps === 'number' && o.plateauSteps > 1) {
      v = Math.round(v * (o.plateauSteps - 1)) / (o.plateauSteps - 1)
    }
    if (o.gamma !== 1) v = Math.pow(v, 1 / o.gamma)

    // contrast about 0.5
    v = (v * 2 - 1) * o.contrast
    v = (v + 1) / 2
    v = Math.max(0, Math.min(1, v))
    if (o.invert) v = 1 - v

    this.toneWeight = v
    return Math.floor(v * paletteLastIdx)
  }

  // ---------- internal: render ----------
  private render(ms: number) {
    if (!this.started) return
    const o = this.opts
    const ctx = this.ctx

    const t = ms * 0.001
    const cssW = this.canvas.width / this.dpr
    const cssH = this.canvas.height / this.dpr

    ctx.fillStyle = o.bg
    ctx.fillRect(0, 0, cssW, cssH)

    ctx.fillStyle = o.fg
    const timeFactor = this.prefersReduced ? 0 : o.speed * 60
    const palette = o.palette
    const paletteLastIdx = palette.length - 1

    for (let y = 0; y < cssH; y += this.glyphH) {
      const wobble =
        o.wobbleAmp * Math.sin(2 * Math.PI * o.wobbleFreq * t + y * 0.0125)
      const drift = o.driftAmp * t
      const phaseT = t + Math.sin(y * 0.002) * 0.35

      for (let x = 0; x < cssW; x += this.glyphW) {
        const wx = (x + wobble + drift) * o.scale
        const wy = y * o.scale

        this.domainWarp(
          wx + Math.sin(phaseT) * 0.3,
          wy + Math.cos(phaseT * 0.8) * 0.3,
          t,
          o.warpAmp,
          o.warpFreq,
          o.seed,
          o.cellSize,
        )

        const v = this.fbm2D(
          this.warpX + t * timeFactor * 0.12,
          this.warpY - t * timeFactor * 0.1,
          o.seed,
          o.cellSize,
          o.octaves,
          o.lacunarity,
          o.gain,
        )

        const charIdx = this.tonemapIndex(v, paletteLastIdx)
        ctx.globalAlpha = o.opacityBase + o.opacityVar * this.toneWeight
        ctx.fillText(palette[charIdx], x, y)
      }
    }

    ctx.globalAlpha = 1
    this.raf = requestAnimationFrame((t2) => this.render(t2))
  }
}

export { AsciiDance as AsciiField }
export type AsciiFieldOptions = AsciiDanceOptions
export default AsciiDance
