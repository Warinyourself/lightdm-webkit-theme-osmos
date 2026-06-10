import { CircleX } from '@lucide/vue'
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/app'
import { usePageStore } from '@/store/page'
import UserAvatar from './UserAvatar'
import SettingsView from './settings/SettingsView'

export default defineComponent({
  name: 'SettingsComponent',
  setup() {
    const appStore = useAppStore()
    const pageStore = usePageStore()
    const { t } = useI18n()

    const isViewThemeOnly = computed(() => appStore.viewThemeOnly)
    const mainTabIndex = computed(() => pageStore.mainTabIndex)

    const tabs = computed(() => {
      const list = [t('settings.choice-themes'), t('settings.general')]
      if (appStore.activeTheme?.settings?.length !== undefined) {
        list.splice(1, 0, t('settings.customize-theme'))
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

    const generateTab = (tab: string, index: number) => {
      const classes = `user-settings-tab ${mainTabIndex.value === index ? 'active' : ''}`
      return (
        <div class={classes} onClick={() => activateTab(index)}>
          {tab}
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
