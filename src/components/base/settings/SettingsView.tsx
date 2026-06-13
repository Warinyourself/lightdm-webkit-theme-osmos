import { defineComponent, computed } from 'vue'
import { useThemeStore } from '@/store/theme'
import { usePageStore } from '@/store/page'
import SettingsThemes from './SettingsThemes'
import SettingsCustom from './SettingsCustom'
import SettingsGeneral from './general/SettingsGeneral'

export default defineComponent({
  name: 'SettingsView',
  setup() {
    const themeStore = useThemeStore()
    const pageStore = usePageStore()
    const mainTabIndex = computed(() => pageStore.mainTabIndex)

    return () => {
      const mapTabs = [<SettingsThemes />, <SettingsGeneral />]
      const hasThemeSettings = themeStore.activeTheme?.settings?.length

      if (hasThemeSettings) {
        mapTabs.splice(1, 0, <SettingsCustom />)
      }

      return (
        <div class="user-settings">
          <div key={mainTabIndex.value}>{mapTabs[mainTabIndex.value]}</div>
        </div>
      )
    }
  }
})
