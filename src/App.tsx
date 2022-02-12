import { Component, Vue } from 'vue-property-decorator'
import Mousetrap from 'mousetrap'
import { AppModule } from '@/store/app'
import { PageModule } from './store/page'

@Component
export default class MainApp extends Vue {
  get bodyClass() {
    return AppModule.bodyClass
  }

  created() {
    AppModule.setUpSettings()
    this.initKeybinds()
  }

  initKeybinds() {
    const modKey = 'fn'

    Mousetrap.bind(`${modKey}+t`, () => {
      PageModule.openTab({ type: 'themes' })
      PageModule.openBlock({ id: 'settings' })
    })

    Mousetrap.bind(`${modKey}+c`, () => {
      PageModule.openTab({ type: 'custom' })
      PageModule.openBlock({ id: 'settings' })
    })

    Mousetrap.bind(`${modKey}+s`, () => {
      PageModule.openTab({ type: 'settings' })
      PageModule.openBlock({ id: 'settings' })
    })

    Mousetrap.bind('escape', () => {
      const isFocusPassword = document.querySelector('#password:focus') as HTMLInputElement

      if (isFocusPassword) {
        isFocusPassword.blur()
      } else if (PageModule.menu.view) {
        PageModule.ASSIGN_MENU({ view: false })
      } else if (PageModule.activeBlock) {
        PageModule.closeBlock()
      }
    })

    Mousetrap.bind('enter', () => {
      const isFocusPassword = document.querySelector('#password:focus')
      const inputPassword = document.querySelector('#password') as HTMLInputElement

      if (isFocusPassword) {
        AppModule.login()
      } else if (inputPassword) {
        inputPassword.focus()
      }
    })

    // keyPress(event: KeyboardEvent) {
    //   if (PageModule.activeBlocks.length === 0) {
    //     PageModule.openBlock({ id: 'login' })
    //   }
    // }

    Mousetrap.bind(`${modKey}+h`, () => {
      console.log('hide all windows')
      PageModule.CLOSE_ALL_ACTIVE_BLOCK()
    })

    Mousetrap.bind(`${modKey}+p`, () => {
      console.log('power off')
    })

    Mousetrap.bind(`${modKey}+r`, () => {
      console.log('restart')
    })

    Mousetrap.bind(`${modKey}+R`, () => {
      AppModule.randomizeSettingsTheme()
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
