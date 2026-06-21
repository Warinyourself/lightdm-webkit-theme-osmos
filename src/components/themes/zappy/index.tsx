import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import GL from '@/utils/gl'
import { useThemeStore } from '@/store/theme'
import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

let render: GL

export default defineComponent({
  name: 'ZappyTheme',
  setup() {
    const themeStore = useThemeStore()
    const canvasRef = ref<HTMLCanvasElement | null>(null)

    const animationSpeed = computed(() => themeStore.getThemeInput('animation-speed')?.value as number || 5)
    const pxratio        = computed(() => themeStore.getThemeInput('pxratio')?.value        as number || 0.8)
    const zoom           = computed(() => themeStore.getThemeInput('zoom')?.value           as number || 0.2)
    const colorShift     = computed(() => themeStore.getThemeInput('color-shift')?.value    as number || 0.0)

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

            if (!gl.programInfo.uniforms.zoom) {
              gl.programInfo.uniforms.zoom       = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uZoom')
              gl.programInfo.uniforms.colorShift = gl.ctx.getUniformLocation(gl.program as WebGLProgram, 'uColorShift')
            }

            gl.pxratio = pxratio.value
            gl.time += animationSpeed.value / 500

            gl.ctx.uniform1f(gl.programInfo.uniforms.time,       gl.time)
            gl.ctx.uniform1f(gl.programInfo.uniforms.zoom,       zoom.value)
            gl.ctx.uniform1f(gl.programInfo.uniforms.colorShift, colorShift.value)
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
