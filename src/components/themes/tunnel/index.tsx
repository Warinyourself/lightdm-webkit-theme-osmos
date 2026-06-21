import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import GL from '@/utils/gl'
import { useThemeStore } from '@/store/theme'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

let render: GL

export default defineComponent({
  name: 'TunnelTheme',
  setup() {
    const themeStore = useThemeStore()
    const canvasRef = ref<HTMLCanvasElement | null>(null)

    const animationSpeed = computed(() => themeStore.getThemeInput('animation-speed')?.value as number || 5)
    const pxratio      = computed(() => themeStore.getThemeInput('pxratio')?.value      as number || 0.8)
    const step         = computed(() => themeStore.getThemeInput('step')?.value         as number || 0.07)
    const frequency    = computed(() => themeStore.getThemeInput('frequency')?.value    as number || 9.0)
    const amplitude    = computed(() => themeStore.getThemeInput('amplitude')?.value    as number || 1.0)
    const brightness   = computed(() => themeStore.getThemeInput('brightness')?.value   as number || 0.01)

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

            if (!gl.programInfo.uniforms.step) {
              gl.programInfo.uniforms.step      = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uStep')
              gl.programInfo.uniforms.frequency = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uFrequency')
              gl.programInfo.uniforms.amplitude = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uAmplitude')
              gl.programInfo.uniforms.brightness = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uBrightness')
            }

            gl.pxratio = pxratio.value
            gl.time += animationSpeed.value / 500
            gl.ctx.uniform1f(gl.programInfo.uniforms.time,       gl.time)
            gl.ctx.uniform1f(gl.programInfo.uniforms.step,       step.value)
            gl.ctx.uniform1f(gl.programInfo.uniforms.frequency,  frequency.value)
            gl.ctx.uniform1f(gl.programInfo.uniforms.amplitude,  amplitude.value)
            gl.ctx.uniform1f(gl.programInfo.uniforms.brightness, brightness.value)
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
