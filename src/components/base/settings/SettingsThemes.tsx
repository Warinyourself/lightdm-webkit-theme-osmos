import { defineComponent, computed } from 'vue'
import { useThemeStore } from '@/store/theme'

const themeImages = import.meta.glob('@/assets/images/themes/*/index.png', { eager: true, import: 'default' }) as Record<string, string>

function getThemeImage(name: string): string {
  const key = Object.keys(themeImages).find((k) => k.includes(`/${name.toLowerCase()}/`))
  return key ? (themeImages[key] ?? 'notFound') : 'notFound'
}

export default defineComponent({
  name: 'SettingsThemes',
  setup() {
    const themeStore = useThemeStore()
    const themes = computed(() => themeStore.themes)
    const activeTheme = computed(() => themeStore.activeTheme)

    return () => (
      <div class="user-settings-themes">
        {themes.value.map((theme) => {
          const isActive = theme.name === activeTheme.value.name
          return (
            <img
              class={`user-settings-theme ${isActive ? 'active' : ''}`}
              onClick={() => themeStore.changeTheme(theme.name)}
              src={getThemeImage(theme.name)}
            />
          )
        })}
      </div>
    )
  }
})
