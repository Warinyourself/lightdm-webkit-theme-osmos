import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/app'
import AppSwitch from '@/components/app/AppSwitch'

export default defineComponent({
  name: 'SettingsCheckboxes',
  setup() {
    const appStore = useAppStore()
    const { t } = useI18n()

    const buildBodyClassSwitch = (name: string) => (
      <AppSwitch
        label={t(`settings.${name}`)}
        modelValue={appStore.bodyClass[name]}
        onUpdate:modelValue={(value: boolean) => appStore.changeBodyClass({ key: name, value })}
      />
    )

    return () => (
      <div class="settings-group">
        {buildBodyClassSwitch('blur')}
        {buildBodyClassSwitch('show-framerate')}
        {buildBodyClassSwitch('no-transition')}
        {buildBodyClassSwitch('only-ui')}
        <AppSwitch
          label={t('settings.hotkeys')}
          modelValue={appStore.hotkeysEnabled}
          onUpdate:modelValue={(value: boolean) => { appStore.hotkeysEnabled = value }}
        />
        <AppSwitch
          label={t('settings.show-time')}
          modelValue={appStore.showTime}
          onUpdate:modelValue={(value: boolean) => { appStore.showTime = value }}
        />
      </div>
    )
  }
})
