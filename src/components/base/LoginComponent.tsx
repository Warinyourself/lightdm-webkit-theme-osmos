import AppIcon from '@/components/app/AppIcon.vue'
import { defineComponent, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/app'
import { usePageStore } from '@/store/page'
import UserAvatar from './UserAvatar'
import UserInput from './UserInput'
import SettingsView from './settings/SettingsView'
import { focusInputPassword, getDesktopIcon } from '@/utils/helper'

export default defineComponent({
  name: 'LoginComponent',
  setup() {
    const appStore = useAppStore()
    const pageStore = usePageStore()

    const activeBlock = computed(() => pageStore.activeBlock)
    const currentDesktopIcon = computed(() => getDesktopIcon(appStore.currentDesktop?.key))

    const openSettingsTab = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      pageStore.openBlock({ id: 'settings' })
      pageStore.openTab({ type: 'settings' })
    }

    onMounted(() => {
      void Promise.resolve().then(focusInputPassword)
    })

    return () => (
      <div class={`block-${activeBlock.value?.id}`}>
        <div class={`active-interface login-view login-view--${pageStore.loginPosition}`}>
          <AppIcon name={currentDesktopIcon.value} onClick={openSettingsTab} class="desktop-icon" />
          <UserAvatar />
          <UserInput />
        </div>
      </div>
    )
  }
})
