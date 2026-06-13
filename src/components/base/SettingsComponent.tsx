import { CircleX, Palette, SlidersHorizontal, Settings } from '@lucide/vue'
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/store/theme'
import { usePageStore } from '@/store/page'
import SettingsView from './settings/SettingsView'

export default defineComponent({
  name: 'SettingsComponent',
  setup() {
    const themeStore = useThemeStore()
    const pageStore = usePageStore()
    const { t } = useI18n()

    const mainTabIndex = computed(() => pageStore.mainTabIndex)

    const tabs = computed(() => {
      const list = [
        { label: t('settings.choice-themes'), icon: Palette },
        { label: t('settings.title'), icon: Settings }
      ]
      if (themeStore.activeTheme?.settings?.length !== undefined) {
        list.splice(1, 0, { label: t('settings.customize-theme'), icon: SlidersHorizontal })
      }
      return list
    })

    const openLogin = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      pageStore.openBlock({ id: 'login' })
    }

    const activateTab = (index: number) => {
      pageStore.mainTabIndex = index
    }

    const generateTab = (tab: { label: string, icon: typeof Palette }, index: number) => {
      const classes = `user-settings-tab ${mainTabIndex.value === index ? 'active' : ''}`
      const Icon = tab.icon
      return (
        <div class={classes} onClick={() => activateTab(index)}>
          <Icon class="user-settings-tab-icon" />
          <span>{tab.label}</span>
        </div>
      )
    }

    return () => (
      <div class="block-settings login-content-settings">
        <div class="login-view active-interface">
          <CircleX onClick={openLogin} class="system-icon" />
          <div class="user-settings-tabs">{tabs.value.map(generateTab)}</div>
          <SettingsView />
        </div>
      </div>
    )
  }
})
