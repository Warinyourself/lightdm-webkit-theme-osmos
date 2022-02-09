type ctxType = WebGLRenderingContext

interface GlOption {
  renderHook: () => void;
  renderOptions?: GLRenderOptions;
  windowListener?: WindowListenerCallback[];
}

interface GLRenderOptions {
  observeMouse?: boolean;
  externalTimeUse?: boolean;
}

interface WindowListenerCallback {
  event: string;
  listener: (event: Event | MouseEvent) => void;
  options?: boolean | AddEventListenerOptions;
}

export default class GL {
  ctx!: WebGLRenderingContext
  private el!: HTMLCanvasElement
  program!: WebGLProgram | null

  private vertexShader!: WebGLShader
  private fragmentShader!: WebGLShader
  programInfo!: any
  width!: number
  height!: number

  innerRunning = false

  positions!: number[]
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

  renderHook: null | Function = null
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

    const ctx = this.el.getContext('webgl')

    if (!ctx) {
      console.log('Browser doesn\'t support WebGL ')
      return
    }

    this.ctx = ctx

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

    if (!this.renderOptions.externalTimeUse) {
      this.time = (Date.now() - this.startTime) / 1000
      this.ctx.uniform1f(this.programInfo.uniforms.time, this.time)
    }

    if (this.renderHook) {
      this.renderHook()
    }

    this.ctx.drawArrays(this.ctx.TRIANGLES, 0, 6)
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
