import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/app'
import { usePageStore } from '@/store/page'
import { useRouter } from 'vue-router'
import AppSelector from '@/components/app/AppSelector'
import AppSlider from '@/components/app/AppSlider'
import { createDebounce, generateDesktopIcons, languageMap, setCSSVariable } from '@/utils/helper'
import type { LoginPosition } from '@/models/page'

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

    const menuPositionItems = computed(() =>
      ['top', 'left', 'right', 'bottom', 'center'].map((word) => ({
        value: word,
        text: t(`settings.login-position.${word}`)
      }))
    )

    const menuPositionValue = computed(() => ({
      value: pageStore.loginPosition,
      text: t(`settings.login-position.${pageStore.loginPosition}`)
    }))

    const changeLanguage = (value: string) => {
      locale.value = value
      localStorage.setItem('language', value)
      pageStore.language = value
    }

    const changeLoginPosition = (position: string) => {
      localStorage.setItem('loginPosition', position)
      pageStore.loginPosition = position as LoginPosition
    }

    const changeDesktop = (value: string) => {
      appStore.saveStateApp({ key: 'desktop', value })
    }

    const updateZoom = createDebounce((value: number) => {
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
        <AppSelector
          label={t('settings.login-position.about')}
          items={menuPositionItems.value}
          modelValue={menuPositionValue.value}
          onUpdate:modelValue={changeLoginPosition}
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
