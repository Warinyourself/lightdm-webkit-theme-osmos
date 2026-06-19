import { defineComponent, onMounted, onBeforeUnmount } from 'vue'
import { useAppStore } from '@/store/app'
import { usePageStore } from '@/store/page'
import { useI18n } from 'vue-i18n'
import { hasSomeParentClass } from '@/utils/helper'

import AppMenu from '@/components/app/AppMenu'
import AppDialog from '@/components/app/AppDialog'
import SettingsComponent from '@/components/base/SettingsComponent'
import LoginComponent from '@/components/base/LoginComponent'
import FrameRateBlock from '@/components/base/FrameRateBlock'
import BackgroundImage from '@/components/base/BackgroundImage'
import ShutdownButton from '@/components/base/ShutdownButton'
import GithubButton from '@/components/base/GithubButton'

export default defineComponent({
  name: 'HomePage',

  setup() {
    const appStore = useAppStore()
    const pageStore = usePageStore()
    const { locale } = useI18n()

    const handleClick = (event: MouseEvent) => {
      if (!pageStore.activeBlock) {
        return pageStore.openFirstBlock()
      } else if (pageStore.menu.view) {
        return
      }

      const target = event.target as HTMLElement
      const activeBlocks = document.querySelectorAll(`.block-${pageStore.activeBlock.id}`)
      const isClickOnActiveBlock = Array.from(activeBlocks).some((node) => node.contains(target))
      const ignoreClick = hasSomeParentClass(target, '.active-block')

      if (!ignoreClick && !isClickOnActiveBlock) {
        pageStore.closeBlock()
      }
    }

    // Initialize language from localStorage
    const language = localStorage.getItem('language') || 'en'
    locale.value = language
    pageStore.language = language
    pageStore.languages = ['en', 'ru', 'fr', 'de', 'es']
    pageStore.openBlock({ id: 'login' })

    onMounted(() => {
      document.addEventListener('mousedown', handleClick)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', handleClick)
    })

    return () => {
      const showFrameRate = appStore.showFrameRate
      const isOpenLogin = pageStore.isOpenBlock('login') && !appStore.viewThemeOnly
      const isOpenSettings = pageStore.isOpenBlock('settings')
      const hasActiveBlock = !!pageStore.activeBlock
      const showShutdownButton = !appStore.viewThemeOnly && hasActiveBlock
      const showGithubButton = appStore.isGithubMode && hasActiveBlock

      return (
        <div class="index">
          {showFrameRate && <FrameRateBlock />}
          <BackgroundImage />

          <transition-group class="login-transition" name="fade" tag="div">
            {isOpenLogin && <LoginComponent key="LoginComponent" />}
            {isOpenSettings && <SettingsComponent key="SettingsComponent" />}
            {showShutdownButton && <ShutdownButton key="ShutdownButton" />}
            {showGithubButton && <GithubButton key="GithubButton" />}
          </transition-group>

          <AppDialog />
          <AppMenu />
        </div>
      )
    }
  }
})
