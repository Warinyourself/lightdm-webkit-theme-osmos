import { Component, Vue } from 'vue-property-decorator'
import GL from '@/utils/gl'
import { AppModule } from '@/store/app'
let render: GL

@Component
export default class FlowTheme extends Vue {
  get hue() {
    return AppModule.getThemeInput('hue')?.value as number || 0
  }

  get brightness() {
    return AppModule.getThemeInput('brightness')?.value as number || 0
  }

  get invert() {
    return AppModule.getThemeInput('invert')?.value as boolean || false
  }

  get filter() {
    return `hue-rotate(${this.hue}deg) invert(${Number(this.invert)}) brightness(${this.brightness})`
  }

  get styleCanvas() {
    return {
      filter: this.filter
    }
  }

  get animationSpeed() {
    return AppModule.getThemeInput('animation-speed')?.value as number || 45
  }

  get size() {
    return AppModule.getThemeInput('size')?.value as number || 0.2
  }

  get pxratio() {
    return AppModule.getThemeInput('pxratio')?.value as number || 0.8
  }

  mounted() {
    const vm = this

    render = new GL(
      this.$refs.canvas as HTMLCanvasElement,
      document.querySelector('script#shader-vs')?.textContent || '',
      document.querySelector('script#shader-fs')?.textContent || '',
      window.innerWidth,
      window.innerHeight,
      {
        renderOptions: {
          externalTimeUse: true
        },
        renderHook() {
          const gl = this as unknown as GL

          if (!gl.programInfo.uniforms.size) {
            gl.programInfo.uniforms.size = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'size')
          }

          gl.pxratio = vm.pxratio
          gl.time += vm.animationSpeed / 500
          gl.ctx.uniform1f(gl.programInfo.uniforms.time, gl.time)
          gl.ctx.uniform1f(gl.programInfo.uniforms.size, vm.size)
        }
      }
    )

    render.running = true
  }

  beforeDestroy() {
    render.running = false
  }

  render() {
    return <div>
      <canvas ref='canvas' style={ this.styleCanvas }/>
      <script id="shader-fs" type="x-shader/x-fragment"> { require('./fragment.glsl') } </script>
      <script id="shader-vs" type="x-shader/x-vertex"> { require('./vertex.glsl') } </script>
    </div>
  }
}
