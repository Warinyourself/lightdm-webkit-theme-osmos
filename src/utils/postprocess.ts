import GL from './gl'

interface RenderTarget {
  fbo: WebGLFramebuffer
  texture: WebGLTexture
}

// ─── Shared pass vertex shader ───────────────────────────────────────────────
const PASS_VERT = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

// ─── Separable Gaussian blur ─────────────────────────────────────────────────
// Call twice (horizontal then vertical) for a full 2D Gaussian blur.
// uDirection = (1,0) for horizontal, (0,1) for vertical.
const BLUR_FRAG = `
precision highp float;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uDirection;
uniform float uRadius;
// Step multiplier: sample every N pixels instead of every 1.
// Higher values cover a wider area with the same 17 taps — key for wide diffuse bloom.
uniform float uStepMult;
varying vec2 vUv;
void main() {
  vec2 step = uDirection / uResolution * uStepMult;
  vec4 color = vec4(0.0);
  float total = 0.0;
  for (float i = -8.0; i <= 8.0; i++) {
    float w = exp(-i * i / (2.0 * uRadius * uRadius));
    color += texture2D(uTexture, vUv + step * i) * w;
    total += w;
  }
  gl_FragColor = color / total;
}`

// ─── Brightness extraction ────────────────────────────────────────────────────
// Keeps only pixels whose luminance exceeds uThreshold; everything else goes black.
// Used before the wide bloom pass so scattering only originates from bright light sources.
const EXTRACT_FRAG = `
precision highp float;
uniform sampler2D uTexture;
uniform float uThreshold;
varying vec2 vUv;
void main() {
  vec4 c = texture2D(uTexture, vUv);
  float lum = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
  float bright = max(0.0, lum - uThreshold) / max(1.0 - uThreshold, 0.001);
  gl_FragColor = vec4(c.rgb * bright, 1.0);
}`

// ─── Dual-bloom composite ─────────────────────────────────────────────────────
// Combines the original render with two independent bloom layers:
//   bloom1 — bright tight bloom (enhances perceived saturation / intensity)
//   bloom2 — wide dim bloom  (simulates lens scattering / atmospheric glow)
const COMPOSITE_FRAG = `
precision highp float;
uniform sampler2D uBase;
uniform sampler2D uBloom1;   // bright tight bloom
uniform sampler2D uBloom2;   // wide dim bloom
uniform float uIntensity1;
uniform float uIntensity2;
varying vec2 vUv;
void main() {
  vec4 base   = texture2D(uBase,   vUv);
  vec4 bloom1 = texture2D(uBloom1, vUv);
  vec4 bloom2 = texture2D(uBloom2, vUv);
  gl_FragColor = clamp(base + bloom1 * uIntensity1 + bloom2 * uIntensity2, 0.0, 1.0);
}`

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])

export interface PostProcessOptions {
  // Tight bloom — bright, few passes, small radius
  // Bloom layer A
  passesA?: number
  radiusA?: number
  intensityA?: number
  stepMultA?: number  // sample stride (1 = every pixel, 3 = every 3rd pixel → 3× wider spread)
  // Bloom layer B — optionally extract bright pixels first for true scattering effect
  passesB?: number
  radiusB?: number
  intensityB?: number
  stepMultB?: number
  thresholdB?: number  // luminance threshold before blur: 0 = blur everything, 0.5 = only bright pixels
}

export default class PostProcessGL extends GL {
  private _mainTarget!: RenderTarget
  private _pingTarget!: RenderTarget
  private _pongTarget!: RenderTarget
  private _extraTarget!: RenderTarget   // holds one bloom result while the other is computed

  private _blurProgram!: WebGLProgram
  private _extractProgram!: WebGLProgram
  private _compositeProgram!: WebGLProgram
  private _quadBuffer!: WebGLBuffer
  private _extractTarget!: RenderTarget

  ppOptions: Required<PostProcessOptions>
  ppEnabled: boolean

  constructor(
    el: HTMLCanvasElement,
    vertexShader: string,
    fragmentShader: string,
    width: number,
    height: number,
    glOptions?: ConstructorParameters<typeof GL>[5],
    ppOptions: PostProcessOptions = {}
  ) {
    super(el, vertexShader, fragmentShader, width, height, glOptions)
    this.ppEnabled = Object.keys(ppOptions).length > 0
    this.ppOptions = {
      passesA: 1, radiusA: 5,   intensityA: 1.2, stepMultA: 1,
      passesB: 1, radiusB: 0.5, intensityB: 1.2, stepMultB: 1, thresholdB: 0,
      ...ppOptions
    }
    this._initPostProcess()
  }

  // ─── Setup ──────────────────────────────────────────────────────────────────

  private _createTarget(w: number, h: number): RenderTarget {
    const gl = this.ctx
    const texture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    const fbo = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, null)
    return { fbo, texture }
  }

  private _compilePassProgram(fragSrc: string): WebGLProgram {
    const gl = this.ctx
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, PASS_VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc))
    gl.linkProgram(prog)
    return prog
  }

  private _initPostProcess() {
    const w = this.el.width
    const h = this.el.height
    this._mainTarget  = this._createTarget(w, h)
    this._pingTarget  = this._createTarget(w, h)
    this._pongTarget  = this._createTarget(w, h)
    this._extraTarget = this._createTarget(w, h)
    this._extractTarget    = this._createTarget(w, h)
    this._blurProgram      = this._compilePassProgram(BLUR_FRAG)
    this._extractProgram   = this._compilePassProgram(EXTRACT_FRAG)
    this._compositeProgram = this._compilePassProgram(COMPOSITE_FRAG)
    this._quadBuffer = this.ctx.createBuffer()!
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this._quadBuffer)
    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, QUAD, this.ctx.STATIC_DRAW)
  }

  // ─── Blur helpers ────────────────────────────────────────────────────────────

  private _bindQuad(program: WebGLProgram) {
    const gl = this.ctx
    gl.bindBuffer(gl.ARRAY_BUFFER, this._quadBuffer)
    const loc = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  }

  private _blurPass(src: RenderTarget, dst: RenderTarget, dir: [number, number], radius: number, stepMult = 1) {
    const gl = this.ctx
    gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo)
    gl.useProgram(this._blurProgram)
    this._bindQuad(this._blurProgram)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, src.texture)
    gl.uniform1i(gl.getUniformLocation(this._blurProgram, 'uTexture'), 0)
    gl.uniform2f(gl.getUniformLocation(this._blurProgram, 'uResolution'), this.el.width, this.el.height)
    gl.uniform2f(gl.getUniformLocation(this._blurProgram, 'uDirection'), dir[0], dir[1])
    gl.uniform1f(gl.getUniformLocation(this._blurProgram, 'uRadius'), radius)
    gl.uniform1f(gl.getUniformLocation(this._blurProgram, 'uStepMult'), stepMult)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  private _runBlur(src: RenderTarget, passes: number, radius: number, useExtra: boolean, stepMult = 1): RenderTarget {
    const a = this._pingTarget
    const b = useExtra ? this._extraTarget : this._pongTarget
    let cur: RenderTarget = src
    let scratch: [RenderTarget, RenderTarget] = [a, b]
    let idx = 0
    for (let i = 0; i < passes; i++) {
      const dst0 = scratch[idx % 2]!
      const dst1 = scratch[(idx + 1) % 2]!
      this._blurPass(cur, dst0, [1, 0], radius, stepMult)
      this._blurPass(dst0, dst1, [0, 1], radius, stepMult)
      cur = dst1
      idx += 2
    }
    return cur
  }

  private _extractPass(src: RenderTarget, threshold: number) {
    const gl = this.ctx
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._extractTarget.fbo)
    gl.useProgram(this._extractProgram)
    this._bindQuad(this._extractProgram)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, src.texture)
    gl.uniform1i(gl.getUniformLocation(this._extractProgram, 'uTexture'), 0)
    gl.uniform1f(gl.getUniformLocation(this._extractProgram, 'uThreshold'), threshold)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  // ─── Resize ─────────────────────────────────────────────────────────────────

  override resize() {
    super.resize()
    if (!this._mainTarget) return
    const w = this.el.width
    const h = this.el.height
    for (const t of [this._mainTarget, this._pingTarget, this._pongTarget, this._extraTarget, this._extractTarget]) {
      this.ctx.bindTexture(this.ctx.TEXTURE_2D, t.texture)
      this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0, this.ctx.RGBA, w, h, 0, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, null)
    }
    this.ctx.bindTexture(this.ctx.TEXTURE_2D, null)
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  override render() {
    if (!this.running) return
    requestAnimationFrame(this.render.bind(this))

    const gl = this.ctx

    // Bypass: render directly to screen without any post-processing
    if (!this.ppEnabled) {
      gl.useProgram(this.program)
      this.initBuffers(this.positions)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, this.el.width, this.el.height)
      if (!this.renderOptions.externalTimeUse) {
        this.time = (Date.now() - this.startTime) / 1000
        gl.uniform1f(this.programInfo.uniforms.time, this.time)
      }
      if (this.renderHook) this.renderHook()
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      return
    }

    const { passesA, radiusA, intensityA, stepMultA, passesB, radiusB, intensityB, stepMultB, thresholdB } = this.ppOptions

    // Pass 1: render main shader to offscreen texture
    gl.useProgram(this.program)
    this.initBuffers(this.positions)
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._mainTarget.fbo)
    gl.viewport(0, 0, this.el.width, this.el.height)
    if (!this.renderOptions.externalTimeUse) {
      this.time = (Date.now() - this.startTime) / 1000
      gl.uniform1f(this.programInfo.uniforms.time, this.time)
    }
    if (this.renderHook) this.renderHook()
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    const bloomA = this._runBlur(this._mainTarget, passesA, radiusA, false, stepMultA)

    // If thresholdB > 0: extract bright pixels first so bloom B scatters only from light sources
    const bloomBSrc = thresholdB > 0
      ? (this._extractPass(this._mainTarget, thresholdB), this._extractTarget)
      : this._mainTarget
    const bloomB = this._runBlur(bloomBSrc, passesB, radiusB, true, stepMultB)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.useProgram(this._compositeProgram)
    this._bindQuad(this._compositeProgram)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this._mainTarget.texture)
    gl.uniform1i(gl.getUniformLocation(this._compositeProgram, 'uBase'), 0)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, bloomA.texture)
    gl.uniform1i(gl.getUniformLocation(this._compositeProgram, 'uBloom1'), 1)

    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, bloomB.texture)
    gl.uniform1i(gl.getUniformLocation(this._compositeProgram, 'uBloom2'), 2)

    gl.uniform1f(gl.getUniformLocation(this._compositeProgram, 'uIntensity1'), intensityA)
    gl.uniform1f(gl.getUniformLocation(this._compositeProgram, 'uIntensity2'), intensityB)

    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }
}
