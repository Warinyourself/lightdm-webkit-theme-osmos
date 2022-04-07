import { Component, Vue, Watch } from 'vue-property-decorator'
import Mousetrap from 'mousetrap'
import { AppModule } from '@/store/app'
import { PageModule } from './store/page'
import { Debounce, focusInputPassword } from './utils/helper'
import { hotkeys } from '@/utils/hotkeys'

@Component
export default class MainApp extends Vue {
  get bodyClass() {
    return AppModule.bodyClass
  }

  get getMainSettings() {
    return AppModule.getMainSettings
  }

  @Debounce(100)
  @Watch('getMainSettings', { deep: true })
  handleSettingsThemes() {
    console.log('Update Settings')
    AppModule.syncSettingsWithCache()
  }

  created() {
    AppModule.setUpSettings()
    this.initKeybinds()
  }

  initKeybinds() {
    hotkeys.forEach(({ keys, callback }) => Mousetrap.bind(keys.join('+'), callback))

    Mousetrap.bind('escape', () => {
      const isFocusPassword = document.querySelector('#password:focus') as HTMLInputElement
      const isShowModal = !!PageModule.dialog

      if (isShowModal) {
        PageModule.closeDialog()
      } else if (PageModule.menu.view) {
        PageModule.ASSIGN_MENU({ view: false })
      } else if (isFocusPassword) {
        isFocusPassword.blur()
      } else if (PageModule.activeBlock) {
        PageModule.closeBlock()
      }
    })

    Mousetrap.bind('enter', () => {
      const isFocusPassword = document.querySelector('#password:focus')

      if (isFocusPassword) {
        AppModule.login()
      } else {
        focusInputPassword()
      }
    })
  }

  render() {
    return (
      <div id="app" class={ this.bodyClass }>
        <router-view />
      </div>
    )
  }
}
