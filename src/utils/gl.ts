type ctxType = WebGL2RenderingContext

interface GLRenderOptions {
  observeMouse?: boolean;
  externalTimeUse?: boolean;
}

interface WindowListenerCallback {
  event: string;
  listener: (event: Event | MouseEvent) => void;
  options?: boolean | AddEventListenerOptions;
}

interface GlOption {
  renderHook: () => void;
  renderOptions?: GLRenderOptions;
  windowListener?: WindowListenerCallback[];
  extensions?: string[];
}

export default class GL {
  ctx!: WebGL2RenderingContext
  protected el!: HTMLCanvasElement
  program!: WebGLProgram | null

  private vertexShader!: WebGLShader
  private fragmentShader!: WebGLShader
  programInfo!: any
  width!: number
  height!: number

  innerRunning = false
  pixelSize = 1  // >1 enables pixelation post-pass (e.g. 6 = 6×6 pixel blocks)

  positions!: number[]

  // ─── Pixelation resources (lazy-initialised on first use) ───────────────────
  private _pxFbo: WebGLFramebuffer | null = null
  private _pxTex: WebGLTexture | null = null
  private _pxProg: WebGLProgram | null = null
  private _pxQuad: WebGLBuffer | null = null
  positionBuffer!: WebGLBuffer | null

  listeners: WindowListenerCallback[] = []
  innerPxratio = 0.8

  get pxratio() {
    return this.innerPxratio
  }

  set pxratio(value: number) {
    if (value !== this.pxratio) {
      this.innerPxratio = value

      this.resize()
    }
  }

  time = 0
  startTime = Date.now()

  renderHook: null | (() => void) = null
  renderOptions: GLRenderOptions = {}

  constructor(
    el: HTMLCanvasElement,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    width: number,
    height: number,
    options?: GlOption
  ) {
    // If the HTML element isn't a canvas, return null
    if (!(el instanceof HTMLElement) || el.nodeName.toLowerCase() !== 'canvas') {
      console.log('Provided element should be a canvas element')
      return
    }

    this.width = width
    this.height = height

    this.el = el

    const ctx = this.el.getContext('webgl2')

    if (!ctx) {
      console.log('Browser doesn\'t support WebGL 2')
      return
    }

    this.ctx = ctx

    options?.extensions?.forEach((ext) => ctx.getExtension(ext))

    // Create the shaders
    this.vertexShader = this.createShaderOfType(this.ctx, this.ctx.VERTEX_SHADER, vertexShaderSource) as WebGLShader
    this.fragmentShader = this.createShaderOfType(this.ctx, this.ctx.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader

    this.program = this.ctx.createProgram()

    if (!this.program) { return }

    this.ctx.attachShader(this.program, this.vertexShader)
    this.ctx.attachShader(this.program, this.fragmentShader)
    this.ctx.linkProgram(this.program)

    this.ctx.useProgram(this.program)

    if (!this.ctx.getProgramParameter(this.program, this.ctx.LINK_STATUS)) {
      console.log('Unable to initialize the shader program: ' + this.ctx.getProgramInfoLog(this.program))
      return
    }

    // The program information object. This is essentially a state machine for the webGL instance
    this.programInfo = {
      attribs: {
        vertexPosition: this.ctx.getAttribLocation(this.program, 'aVertexPosition')
      },
      uniforms: {
        resolution: this.ctx.getUniformLocation(this.program, 'uResolution'),
        time: this.ctx.getUniformLocation(this.program, 'uTime')
      }
    }

    this.initBuffers([
      -1.0, -1.0, 1.0,
      -1.0, -1.0, 1.0,
      -1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0
    ])

    if (options) {
      this.renderHook = options.renderHook
    }

    if (options?.renderOptions) {
      this.renderOptions = options?.renderOptions
    }

    if (options?.renderOptions?.observeMouse) {
      this.listeners.push({
        event: 'mousemove',
        listener: (event: any) => {
          const { x, y } = event

          if (!this.programInfo?.uniforms?.mouse) {
            this.programInfo.uniforms.mouse = this.ctx.getUniformLocation(this.program as WebGLProgram, 'iMouse')
          }

          this.ctx.uniform2f(this.programInfo.uniforms.mouse, x, y)
        }
      })
    }

    this.setDefaultListeners()
    this.addListeners()

    this.render = this.render.bind(this)
    this.resize()
  }

  get webglParams(): WebGLContextAttributes {
    return { alpha: true }
  }

  set running(value) {
    if (!this.innerRunning && value) {
      requestAnimationFrame(this.render)
    } else if (this.innerRunning && !value) {
      this.removeListeners()
    }
    this.innerRunning = value
  }

  get running() {
    return this.innerRunning
  }

  render() {
    this.running && requestAnimationFrame(this.render)

    const gl = this.ctx
    const usePixelate = this.pixelSize > 1

    if (usePixelate) {
      if (!this._pxFbo) this._initPixelate()
      gl.bindFramebuffer(gl.FRAMEBUFFER, this._pxFbo)
    }

    if (!this.renderOptions.externalTimeUse) {
      this.time = (Date.now() - this.startTime) / 1000
      gl.uniform1f(this.programInfo.uniforms.time, this.time)
    }

    if (this.renderHook) this.renderHook()
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    if (usePixelate) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.useProgram(this._pxProg)
      gl.bindBuffer(gl.ARRAY_BUFFER, this._pxQuad)
      const loc = gl.getAttribLocation(this._pxProg!, 'aPos')
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, this._pxTex)
      gl.uniform1i(gl.getUniformLocation(this._pxProg!, 'uTex'), 0)
      gl.uniform2f(gl.getUniformLocation(this._pxProg!, 'uRes'), this.el.width, this.el.height)
      gl.uniform1f(gl.getUniformLocation(this._pxProg!, 'uSize'), this.pixelSize)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      gl.useProgram(this.program)
      this.initBuffers(this.positions)
    }
  }

  initBuffers(positions: number[]) {
    this.positions = positions
    this.positionBuffer = this.ctx.createBuffer()

    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.positionBuffer)

    this.ctx.bufferData(
      this.ctx.ARRAY_BUFFER,
      new Float32Array(positions),
      this.ctx.STATIC_DRAW
    )

    const vertexPositionLocation = this.programInfo.attribs.vertexPosition
    this.ctx.enableVertexAttribArray(vertexPositionLocation)
    this.ctx.vertexAttribPointer(vertexPositionLocation, 2, this.ctx.FLOAT, false, 0, 0)
  }

  setDefaultListeners() {
    this.listeners.push({
      event: 'resize',
      listener: this.resize
    })
  }

  addListeners() {
    this.listeners.forEach(({ event, listener, options }) => {
      window.addEventListener(event, listener.bind(this), options || {})
    })
  }

  removeListeners() {
    this.listeners.forEach(({ event, listener, options }) => {
      window.removeEventListener(event, listener, options || {})
    })
  }

  resize() {
    const [width, height] = [window.innerWidth, window.innerHeight]

    this.width = width
    this.height = height

    this.el.width = width * this.pxratio
    this.el.height = height * this.pxratio
    this.ctx.viewport(0, 0, width * this.pxratio, height * this.pxratio)

    this.el.style.width = width + 'px'
    this.el.style.height = height + 'px'
    this.ctx.uniform2fv(this.programInfo.uniforms.resolution, [width * this.pxratio, height * this.pxratio])

    this.initBuffers(this.positions)

    if (this._pxTex) {
      this.ctx.bindTexture(this.ctx.TEXTURE_2D, this._pxTex)
      this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0, this.ctx.RGBA, this.el.width, this.el.height, 0, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, null)
      this.ctx.bindTexture(this.ctx.TEXTURE_2D, null)
    }
  }

  private _initPixelate() {
    const gl = this.ctx
    const w = this.el.width
    const h = this.el.height

    this._pxTex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this._pxTex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    this._pxFbo = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._pxFbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._pxTex, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, null)

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    this._pxProg = gl.createProgram()!
    gl.attachShader(this._pxProg, compile(gl.VERTEX_SHADER, `#version 300 es
in vec2 aPos; out vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`))
    gl.attachShader(this._pxProg, compile(gl.FRAGMENT_SHADER, `#version 300 es
precision highp float;
uniform sampler2D uTex; uniform vec2 uRes; uniform float uSize;
in vec2 vUv; out vec4 fragColor;
void main() {
  vec2 b = floor(gl_FragCoord.xy / uSize) * uSize + uSize * 0.5;
  fragColor = texture(uTex, b / uRes);
}`))
    gl.linkProgram(this._pxProg)

    this._pxQuad = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this._pxQuad)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW)
  }

  createShaderOfType(ctx: ctxType, type: GLenum, source: string) {
    const shader = ctx.createShader(type)

    if (!shader) { return null }

    ctx.shaderSource(shader, source)
    ctx.compileShader(shader)

    if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
      console.log('An error occurred compiling the shaders: ' + ctx.getShaderInfoLog(shader))
      ctx.deleteShader(shader)
      return null
    }

    return shader
  }
}
