import { defineComponent, watch, computed } from 'vue'
import { useMagicKeys, useDebounceFn, whenever } from '@vueuse/core'
import { useAppStore } from '@/store/app'
import { usePageStore } from '@/store/page'
import { useQuerySync } from '@/composables/useQuerySync'
import { useLightdm, initLightdm } from '@/composables/useLightdm'
import { initSystemInfo } from '@/composables/useSystemInfo'
import { focusInputPassword, setCSSVariable } from '@/utils/helper'
import { hotkeys, toMagicKeyCombo } from '@/utils/hotkeys'
import { initTimer } from '@/utils/time'

export default defineComponent({
  name: 'MainApp',

  setup() {
    const appStore = useAppStore()
    const pageStore = usePageStore()
    const keys = useMagicKeys()

    const initZoom = () => {
      setCSSVariable('--zoom', appStore.zoom + '' || '1')
    }

    const initKeybinds = () => {
      hotkeys.forEach(({ keys: keyList, callback }) => {
        if (!callback) return
        whenever(
          computed(() => !!(keys[toMagicKeyCombo(keyList)]?.value) && appStore.hotkeysEnabled),
          callback
        )
      })

      whenever(keys.escape!, () => {
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

      whenever(keys.enter!, () => {
        const isFocusPassword = document.querySelector('#password:focus')
        if (isFocusPassword) {
          useLightdm().login()
        } else {
          focusInputPassword()
        }
      })
    }

    initTimer()
    initLightdm()
    initSystemInfo()
    appStore.setUpSettings()
    useQuerySync()
    initKeybinds()
    initZoom()

    watch(
      () => appStore.getMainSettings,
      useDebounceFn(() => appStore.syncSettingsWithCache(), 100),
      { deep: true }
    )

    return () => (
      <div id="app" class={appStore.bodyClass}>
        <router-view />
      </div>
    )
  }
})
