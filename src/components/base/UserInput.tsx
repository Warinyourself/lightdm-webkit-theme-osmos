import { Settings, Eye, EyeOff, ArrowRight } from '@lucide/vue'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageStore } from '@/store/page'
import { useLightdm } from '@/composables/useLightdm'

export default defineComponent({
  name: 'UserInput',
  setup() {
    const session = useLightdm()
    const pageStore = usePageStore()
    const { t } = useI18n()

    const openSettings = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      pageStore.openBlock({ id: 'settings' })
    }

    const handleKeyup = (event: KeyboardEvent) => {
      session.password.value = (event.target as HTMLInputElement)?.value || ''
    }

    return () => (
      <div class="user-input">
        <Settings class="settings-button" onClick={openSettings} />

        <input
          id="password"
          type={session.showPassword.value ? 'text' : 'password'}
          name="password"
          autocomplete="on"
          autofocus
          placeholder={t('text.password')}
          onKeyup={handleKeyup}
          value={session.password.value}
        />

        {session.showPassword.value
          ? <Eye class="icon icon-eye" onClick={session.toggleShowPassword} />
          : <EyeOff class="icon icon-eye" onClick={session.toggleShowPassword} />}

        <button class="user-input-login" onClick={session.login}>
          <ArrowRight />
        </button>
      </div>
    )
  }
})
