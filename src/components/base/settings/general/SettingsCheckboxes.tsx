import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/app'
import AppSwitch from '@/components/app/AppSwitch'

export default defineComponent({
  name: 'SettingsCheckboxes',
  setup() {
    const appStore = useAppStore()
    const { t } = useI18n()

    const buildCheckbox = (name: string) => (
      <AppSwitch
        label={t(`settings.${name}`)}
        modelValue={appStore.bodyClass[name]}
        onUpdate:modelValue={(value: boolean) => {
          appStore.changeBodyClass({ key: name, value })
        }}
      />
    )

    return () => (
      <div class="grid-two">
        <h2 class="title">{t('settings.performance')}</h2>
        {buildCheckbox('blur')}
        {buildCheckbox('show-framerate')}
        {buildCheckbox('no-transition')}
        {buildCheckbox('only-ui')}
      </div>
    )
  }
})
