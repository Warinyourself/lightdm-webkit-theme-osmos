import AppIcon from '@/components/app/AppIcon.vue'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/app'
import { usePageStore } from '@/store/page'

export default defineComponent({
  name: 'UserInput',
  setup() {
    const appStore = useAppStore()
    const pageStore = usePageStore()
    const { t } = useI18n()

    const openSettings = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      pageStore.openBlock({ id: 'settings' })
    }

    const handleKeyup = (event: KeyboardEvent) => {
      appStore.password = (event.target as HTMLInputElement)?.value || ''
    }

    return () => (
      <div class="user-input">
        <AppIcon class="settings-button" name="settings" onClick={openSettings} />

        <input
          id="password"
          type={appStore.showPassword ? 'text' : 'password'}
          name="password"
          autocomplete="on"
          autofocus
          class="mousetrap"
          placeholder={t('text.password')}
          onKeyup={handleKeyup}
          value={appStore.password}
        />

        <AppIcon
          class={['icon icon-eye', { hide: !appStore.showPassword }]}
          name="eye"
          onClick={() => appStore.toggleShowPassword()}
        />

        <button class="user-input-login" onClick={() => appStore.login()}>
          <AppIcon name="arrow" />
        </button>
      </div>
    )
  }
})
