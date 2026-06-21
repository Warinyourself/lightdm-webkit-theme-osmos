import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import GL from '@/utils/gl'
import { useThemeStore } from '@/store/theme'
import { hexToRgb } from '@/utils/color'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

let render: GL

export default defineComponent({
  name: 'Rings3dTheme',
  setup() {
    const themeStore = useThemeStore()
    const canvasRef = ref<HTMLCanvasElement | null>(null)

    const animationSpeed  = computed(() => themeStore.getThemeInput('animation-speed')?.value  as number || 5)
    const pxratio         = computed(() => themeStore.getThemeInput('pxratio')?.value          as number || 0.8)
    const tubeSize        = computed(() => themeStore.getThemeInput('tube-size')?.value        as number || 0.2)
    const bubbleSize      = computed(() => themeStore.getThemeInput('bubble-size')?.value      as number || 1.85)
    const fogDensity      = computed(() => themeStore.getThemeInput('fog-density')?.value      as number || 0.8)
    const spectrumSpeed   = computed(() => themeStore.getThemeInput('spectrum-speed')?.value   as number || 6.0)
    const glowColor       = computed(() => themeStore.getThemeInput('color-glow')?.value       as string || '#AAFFCE')
    const fogColor        = computed(() => themeStore.getThemeInput('color-fog')?.value        as string || '#9940B3')

    onMounted(() => {
      render = new GL(
        canvasRef.value!,
        vertexShader,
        fragmentShader,
        window.innerWidth,
        window.innerHeight,
        {
          renderOptions: { externalTimeUse: true },
          renderHook() {
            const gl = this as unknown as GL

            if (!gl.programInfo.uniforms.tubeSize) {
              gl.programInfo.uniforms.tubeSize      = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uTubeSize')
              gl.programInfo.uniforms.bubbleSize    = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uBubbleSize')
              gl.programInfo.uniforms.fogDensity    = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uFogDensity')
              gl.programInfo.uniforms.spectrumSpeed = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uSpectrumSpeed')
              gl.programInfo.uniforms.glowColor     = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uGlowColor')
              gl.programInfo.uniforms.fogColor      = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uFogColor')
            }

            gl.pxratio = pxratio.value
            gl.time += animationSpeed.value / 500

            const gc = hexToRgb(glowColor.value)
            const fc = hexToRgb(fogColor.value)

            gl.ctx.uniform1f(gl.programInfo.uniforms.time,          gl.time)
            gl.ctx.uniform1f(gl.programInfo.uniforms.tubeSize,      tubeSize.value)
            gl.ctx.uniform1f(gl.programInfo.uniforms.bubbleSize,    bubbleSize.value)
            gl.ctx.uniform1f(gl.programInfo.uniforms.fogDensity,    fogDensity.value)
            gl.ctx.uniform1f(gl.programInfo.uniforms.spectrumSpeed, spectrumSpeed.value)
            gl.ctx.uniform3f(gl.programInfo.uniforms.glowColor,     gc[0] / 255, gc[1] / 255, gc[2] / 255)
            gl.ctx.uniform3f(gl.programInfo.uniforms.fogColor,      fc[0] / 255, fc[1] / 255, fc[2] / 255)
          }
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
