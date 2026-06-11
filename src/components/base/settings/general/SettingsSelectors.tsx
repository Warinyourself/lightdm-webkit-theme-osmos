import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'
import { useAppStore } from '@/store/app'
import { usePageStore } from '@/store/page'
import { useRouter } from 'vue-router'
import AppSelector from '@/components/app/AppSelector'
import AppSlider from '@/components/app/AppSlider'
import { generateDesktopIcons, languageMap, setCSSVariable } from '@/utils/helper'

export default defineComponent({
  name: 'SettingsSelectors',
  setup() {
    const appStore = useAppStore()
    const pageStore = usePageStore()
    const { t, locale } = useI18n()
    const router = useRouter()

    const isViewThemeOnly = computed(() => appStore.viewThemeOnly)

    const languageList = computed(() =>
      pageStore.languages.map((lang) => ({ text: languageMap[lang] || lang, value: lang }))
    )

    const changeLanguage = (value: string) => {
      locale.value = value
      localStorage.setItem('language', value)
      pageStore.language = value
    }

    const changeDesktop = (value: string) => {
      appStore.saveStateApp({ key: 'desktop', value })
    }

    const updateZoom = useDebounceFn((value: number) => {
      setCSSVariable('--zoom', value + '' || '1')
      appStore.zoom = parseFloat(value + '')
    }, 100)

    return () => (
      <div class="grid-two">
        <h2 class="title">{t('settings.title')}</h2>
        <AppSelector
          label={t('settings.choice-language')}
          items={languageList.value}
          modelValue={pageStore.language}
          onUpdate:modelValue={changeLanguage}
        />
        {!isViewThemeOnly.value && (
          <AppSelector
            label={t('settings.choice-desktop')}
            items={generateDesktopIcons()}
            modelValue={appStore.currentDesktop?.key}
            onUpdate:modelValue={changeDesktop}
          />
        )}
        {/* {!isViewThemeOnly.value && isSupportFullApi.value && (
          <AppSlider
            label={t('input.zoom-interface')}
            from={0.5}
            to={2}
            step={0.1}
            modelValue={appStore.zoom}
            onUpdate:modelValue={updateZoom}
          />
        )} */}
      </div>
    )
  }
})
