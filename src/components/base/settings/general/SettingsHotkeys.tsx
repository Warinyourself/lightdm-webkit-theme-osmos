import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { hotkeys } from '@/utils/hotkeys'
import type { hotkeysType } from '@/utils/hotkeys'

export default defineComponent({
  name: 'SettingsHotkeys',
  setup() {
    const { t } = useI18n()

    const buildHotKeyBlock = ({ keys, title }: hotkeysType) => (
      <div class="settings-hotkey">
        <p class="settings-hotkey-title">{t(title)}:</p>
        <div class="settings-hotkey-blocks">
          {keys.map((key) => <div class="settings-hotkey-block">{key}</div>)}
        </div>
      </div>
    )

    return () => (
      <div class="hotkeys-section">
        <h2 class="title mb-3">{t('settings.keyboard.title')}:</h2>
        {hotkeys.map(buildHotKeyBlock)}
      </div>
    )
  }
})
