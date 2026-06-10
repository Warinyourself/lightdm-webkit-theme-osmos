import { defineComponent, watch } from 'vue'
import { debounce } from 'lodash'
import Mousetrap from 'mousetrap'
import { useAppStore } from '@/store/app'
import { usePageStore } from '@/store/page'
import { focusInputPassword, setCSSVariable } from '@/utils/helper'
import { hotkeys } from '@/utils/hotkeys'

export default defineComponent({
  name: 'MainApp',

  setup() {
    const appStore = useAppStore()
    const pageStore = usePageStore()

    const initZoom = () => {
      setCSSVariable('--zoom', appStore.zoom + '' || '1')
    }

    const initKeybinds = () => {
      hotkeys.forEach(({ keys, callback }) => Mousetrap.bind(keys.join('+'), callback))

      Mousetrap.bind('escape', () => {
        const isFocusPassword = document.querySelector('#password:focus') as HTMLInputElement
        if (pageStore.dialog) {
          pageStore.closeDialog()
        } else if (pageStore.menu.view) {
          pageStore.assignMenu({ view: false })
        } else if (isFocusPassword) {
          isFocusPassword.blur()
        } else if (pageStore.activeBlock) {
          pageStore.closeBlock()
        }
      })

      Mousetrap.bind('enter', () => {
        const isFocusPassword = document.querySelector('#password:focus')
        if (isFocusPassword) {
          appStore.login()
        } else {
          focusInputPassword()
        }
      })
    }

    appStore.setUpSettings()
    initKeybinds()
    initZoom()

    watch(
      () => appStore.getMainSettings,
      debounce(() => appStore.syncSettingsWithCache(), 100),
      { deep: true }
    )

    return () => (
      <div id="app" class={appStore.bodyClass}>
        <router-view />
      </div>
    )
  }
})
