import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/app'
import { usePageStore } from '@/store/page'
import { useLightdm } from '@/composables/useLightdm'
import AppButtonGroup from '@/components/app/AppButtonGroup'
import { generateDesktopIcons, languageMap } from '@/utils/helper'

const languageFlags: Record<string, string> = {
  en: '🇺🇸', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', ru: '🇷🇺'
}
import { timePresets } from '@/utils/time'

const timeFormatItems = (Object.keys(timePresets) as Array<keyof typeof timePresets>).map((key) => ({
  value: key,
  text: key,
}))

export default defineComponent({
  name: 'SettingsSelectors',
  setup() {
    const appStore = useAppStore()
    const session = useLightdm()
    const pageStore = usePageStore()
    const { t, locale } = useI18n()

    const languageList = computed(() =>
      pageStore.languages.map((lang) => ({
        value: lang,
        text: [languageFlags[lang], languageMap[lang]].filter(Boolean).join(' ')
      }))
    )

    const changeLanguage = (value: string) => {
      locale.value = value
      localStorage.setItem('language', value)
      pageStore.language = value
    }

    const changeDesktop = (value: string) => {
      session.desktop.value = value
      localStorage.setItem('desktop', value)
    }

    return () => (
      <div class="settings-group">
        {appStore.showTime && (
          <AppButtonGroup
            block
            label={t('settings.time-format')}
            items={timeFormatItems}
            modelValue={appStore.timeFormat}
            onUpdate:modelValue={(value: string) => { appStore.timeFormat = value }}
          />
        )}
        <AppButtonGroup
          block
          label={t('settings.choice-language')}
          items={languageList.value}
          modelValue={pageStore.language}
          onUpdate:modelValue={changeLanguage}
        />
        <AppButtonGroup
          block
          label={t('settings.choice-desktop')}
          items={generateDesktopIcons()}
          modelValue={session.currentDesktop.value?.key}
          onUpdate:modelValue={changeDesktop}
        />
      </div>
    )
  }
})
