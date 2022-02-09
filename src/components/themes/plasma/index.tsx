import { Component, Vue } from 'vue-property-decorator'
import GL from '@/utils/gl'
import { AppModule } from '@/store/app'
let render: GL

@Component
export default class PlasmaTheme extends Vue {
  get hue() {
    return AppModule.getThemeInput('hue')?.value as number || 0
  }

  get filter() {
    return `hue-rotate(${this.hue}deg)`
  }

  get styleCanvas() {
    return {
      filter: this.filter
    }
  }

  get animationSpeed() {
    return AppModule.getThemeInput('animation-speed')?.value as number || 45
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

          gl.pxratio = vm.pxratio
          gl.time += vm.animationSpeed / 500
          gl.ctx.uniform1f(gl.programInfo.uniforms.time, gl.time)
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
