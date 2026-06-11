import { Settings, Eye, EyeOff, ArrowRight } from '@lucide/vue'
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
        <Settings class="settings-button" onClick={openSettings} />

        <input
          id="password"
          type={appStore.showPassword ? 'text' : 'password'}
          name="password"
          autocomplete="on"
          autofocus
          placeholder={t('text.password')}
          onKeyup={handleKeyup}
          value={appStore.password}
        />

        {appStore.showPassword
          ? <Eye class="icon icon-eye" onClick={() => appStore.toggleShowPassword()} />
          : <EyeOff class="icon icon-eye" onClick={() => appStore.toggleShowPassword()} />}

        <button class="user-input-login" onClick={() => appStore.login()}>
          <ArrowRight />
        </button>
      </div>
    )
  }
})
