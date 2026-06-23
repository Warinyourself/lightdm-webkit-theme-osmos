import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { VividGL } from 'vividgl'
import type { ParamValues } from 'vividgl'
import { useThemeStore } from '@/store/theme'
import type { AppInputTheme } from '@/models/app'

// Maps osmos setting names (kebab-case) → VividGL param names (camelCase)
// Auto-converts kebab to camelCase; explicit overrides for renames
const PARAM_MAP: Record<string, string> = {
  'animation-speed': 'speed',
  'color-glow':      'glowColor',
  'color-fog':       'fogColor',
}

function toVividParam(name: string): string {
  return PARAM_MAP[name] ?? name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function buildParams(settings: AppInputTheme[] | undefined): ParamValues {
  const params: ParamValues = {}
  for (const input of settings ?? []) {
    if (input.type === 'button') continue
    const key = toVividParam(input.name)
    if (key !== 'pxratio' && !Array.isArray(input.value))
      params[key] = input.value as string | number | boolean
  }
  return params
}

function getPxratio(settings: AppInputTheme[] | undefined): number {
  return (settings?.find(i => i.name === 'pxratio')?.value as number) ?? 0.8
}

export default defineComponent({
  name: 'BackgroundImage',
  setup() {
    const themeStore = useThemeStore()
    const canvasRef = ref<HTMLCanvasElement | null>(null)
    let bg: VividGL | null = null

    const init = (themeName: string) => {
      bg?.destroy()
      bg = null
      if (!canvasRef.value) return

      const knownThemes = VividGL.themes()
      const name = knownThemes.includes(themeName) ? themeName : knownThemes[0]!
      const params = buildParams(themeStore.activeTheme.settings)

      try {
        bg = new VividGL(canvasRef.value, name, params)
        bg.pxratio = getPxratio(themeStore.activeTheme.settings)
        bg.start()
      } catch (e) {
        console.warn('[BackgroundImage] VividGL error:', e)
      }
    }

    onMounted(() => init(themeStore.activeTheme.component ?? 'random'))

    // Switch theme when selection changes
    watch(() => themeStore.currentTheme, () => {
      init(themeStore.activeTheme.component ?? 'random')
    })

    // Sync individual param updates in real time
    watch(
      () => themeStore.activeTheme.settings,
      (settings) => {
        if (!bg) return
        for (const input of settings ?? []) {
          if (input.type === 'button') continue
          if (input.name === 'pxratio') { bg.pxratio = input.value as number; continue }
          if (!Array.isArray(input.value))
            bg.setParam(toVividParam(input.name), input.value as string | number | boolean)
        }
      },
      { deep: true }
    )

    onBeforeUnmount(() => bg?.destroy())

    return () => (
      <div class="background-image">
        <canvas ref={canvasRef} />
      </div>
    )
  }
})
