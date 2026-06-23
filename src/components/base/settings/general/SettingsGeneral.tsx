import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/app'
import { useSettingsStorage } from '@/composables/useSettingsStorage'
import { useRouter, useRoute } from 'vue-router'
import AppButton from '@/components/app/AppButton'
import SettingsUsers from './SettingsUsers'
import SettingsHotkeys from './SettingsHotkeys'
import SettingsSelectors from './SettingsSelectors'
import SettingsCheckboxes from './SettingsCheckboxes'

export default defineComponent({
  name: 'SettingsGeneral',
  setup() {
    const appStore = useAppStore()
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()

    const storage = useSettingsStorage()

    const resetSettings = () => {
      storage.clear()
      appStore.setUpSettings()
      if (Object.keys(route.query).length) {
        router.replace({})
      }
      window.location.reload()
    }

    return () => (
      <div class="user-settings-general">
        <SettingsCheckboxes />
        <SettingsSelectors />
        <SettingsUsers />
        {appStore.hotkeysEnabled && <SettingsHotkeys />}
        <div class="help-block">
          <AppButton onClick={resetSettings}>
            {t('settings.reset-settings')}
          </AppButton>
          {appStore.isDebugMode && (
            <AppButton onClick={() => { throw new Error('Debug: manual error') }}>
              Throw error
            </AppButton>
          )}
        </div>
      </div>
    )
  }
})
