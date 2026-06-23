import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import GL from '@/utils/gl'
import PostProcessGL from '@/utils/postprocess'
import { useThemeStore } from '@/store/theme'
import { hexToRgb } from '@/utils/color'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

let render: PostProcessGL

export default defineComponent({
  name: 'ContourTheme',
  setup() {
    const themeStore = useThemeStore()
    const canvasRef = ref<HTMLCanvasElement | null>(null)

    const animationSpeed = computed(() => themeStore.getThemeInput('animation-speed')?.value as number || 0.7)
    const pxratio        = computed(() => themeStore.getThemeInput('pxratio')?.value        as number || 0.8)
    const scale          = computed(() => themeStore.getThemeInput('scale')?.value          as number || 3.0)
    const contour        = computed(() => themeStore.getThemeInput('contour')?.value        as number || 32.0)
    const width          = computed(() => themeStore.getThemeInput('width')?.value          as number || 0.7)

    const maxLine        = computed(() => themeStore.getThemeInput('max-line')?.value       as number || 0.3)
    const color1         = computed(() => themeStore.getThemeInput('color-active')?.value   as string || '#FF00FF')
    const color2         = computed(() => themeStore.getThemeInput('color-second')?.value   as string || '#00FFFF')
    const background     = computed(() => themeStore.getThemeInput('color-bg')?.value       as string || '#000000')

    onMounted(() => {
      render = new PostProcessGL(
        canvasRef.value!,
        vertexShader,
        fragmentShader,
        window.innerWidth,
        window.innerHeight,
        {
          renderOptions: { externalTimeUse: true },
          renderHook() {
            const gl = this as unknown as GL

            if (!gl.programInfo.uniforms.scale) {
              gl.programInfo.uniforms.scale    = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uScale')
              gl.programInfo.uniforms.contour  = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uScaleContour')
              gl.programInfo.uniforms.width    = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uWidth')

              gl.programInfo.uniforms.maxLine   = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uMaxLine')
              gl.programInfo.uniforms.color1      = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uColor1')
              gl.programInfo.uniforms.color2      = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uColor2')
              gl.programInfo.uniforms.background  = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uBackground')
            }

            gl.pxratio = pxratio.value
            gl.time += animationSpeed.value / 500

            const c1 = hexToRgb(color1.value)
            const c2 = hexToRgb(color2.value)

            gl.ctx.uniform1f(gl.programInfo.uniforms.time,    gl.time)
            gl.ctx.uniform1f(gl.programInfo.uniforms.scale,   scale.value)
            gl.ctx.uniform1f(gl.programInfo.uniforms.contour, contour.value)
            gl.ctx.uniform1f(gl.programInfo.uniforms.width, width.value)

            gl.ctx.uniform1f(gl.programInfo.uniforms.maxLine,   maxLine.value)
            const bg = hexToRgb(background.value)
            gl.ctx.uniform3f(gl.programInfo.uniforms.color1,     c1[0] / 255, c1[1] / 255, c1[2] / 255)
            gl.ctx.uniform3f(gl.programInfo.uniforms.color2,     c2[0] / 255, c2[1] / 255, c2[2] / 255)
            gl.ctx.uniform3f(gl.programInfo.uniforms.background, bg[0] / 255, bg[1] / 255, bg[2] / 255)
          }
        },
        {
          radiusB: .5, intensityB: 1.0,
        }
      )
      render.running = true
    })

    onBeforeUnmount(() => {
      render.running = false
    })

    return () => (
      <div>
        <canvas ref={canvasRef} />
      </div>
    )
  }
})
