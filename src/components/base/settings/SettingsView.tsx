import { defineComponent, computed } from 'vue'
import { useAppStore } from '@/store/app'
import { usePageStore } from '@/store/page'
import SettingsThemes from './SettingsThemes'
import SettingsCustom from './SettingsCustom'
import SettingsGeneral from './general/SettingsGeneral'

export default defineComponent({
  name: 'SettingsView',
  setup() {
    const appStore = useAppStore()
    const pageStore = usePageStore()
    const mainTabIndex = computed(() => pageStore.mainTabIndex)

    return () => {
      const mapTabs = [<SettingsThemes />, <SettingsGeneral />]
      const hasThemeSettings = appStore.activeTheme?.settings?.length

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
