import { Component, Vue } from 'vue-property-decorator'
import { LoginPosition } from '@/models/page'

import { AppModule } from '@/store/app'
import { PageModule } from '@/store/page'

import AppBar from '@/components/app/AppBar'
import AppMenu from '@/components/app/AppMenu'
import AppDialog from '@/components/app/AppDialog'
import SettingsComponent from '@/components/base/SettingsComponent'
import LoginComponent from '@/components/base/LoginComponent'
import FrameRateBlock from '@/components/base/FrameRateBlock'
import BackgroundImage from '@/components/base/BackgroundImage'
import ShutdownButton from '@/components/base/ShutdownButton'
import GithubButton from '@/components/base/GithubButton'
import { hasSomeParentClass } from '@/utils/helper'

@Component({
  components: {
    AppMenu,
    GithubButton,
    ShutdownButton,
    FrameRateBlock,
    LoginComponent,
    BackgroundImage,
    SettingsComponent
  }
})
export default class HomePage extends Vue {
  get activeBlock() {
    return PageModule.activeBlock
  }

  get menu() {
    return PageModule.menu
  }

  get showFrameRate() {
    return AppModule.showFrameRate
  }

  get isOpenLogin() {
    return PageModule.isOpenBlock('login')
  }

  get isOpenBlock() {
    return !!PageModule.activeBlock
  }

  get isOpenSettings() {
    return PageModule.isOpenBlock('settings')
  }

  get isViewThemeOnly() {
    return AppModule.viewThemeOnly
  }

  get isGithubMode() {
    return AppModule.isGithubMode
  }

  get showGithubButton() {
    return this.isGithubMode && this.isOpenBlock
  }

  get showLogin() {
    return !this.isViewThemeOnly && this.isOpenLogin
  }

  get isSupportFullApi() {
    return AppModule.isSupportFullApi
  }

  created() {
    // Set language
    const language = localStorage.getItem('language') || 'en'
    this.$i18n.locale = language
    PageModule.SET_STATE_PAGE({ key: 'language', value: language })

    // Set login position
    const loginPosition = localStorage.getItem('loginPosition') as LoginPosition || 'center'
    PageModule.SET_STATE_PAGE({ key: 'loginPosition', value: loginPosition })

    // Set active block
    PageModule.openBlock({ id: 'login' })
    PageModule.SET_STATE_PAGE({ key: 'languages', value: this.$i18n.availableLocales })

    document.addEventListener('mousedown', this.handleClick)
  }

  handleClick(event: MouseEvent) {
    if (!this.activeBlock) {
      return PageModule.openFirstBlock()
    }

    const target = event.target as HTMLElement
    const activeBlocks = document.querySelectorAll(`.block-${this.activeBlock.id}`)
    const isClickOnAciveBlock = Array.from(activeBlocks).some(node => node.contains(target))
    const isClickOnIgnoreBlock = hasSomeParentClass(target, '.active-block')

    if (isClickOnIgnoreBlock) {
      return undefined
    } else if (!isClickOnAciveBlock) {
      PageModule.closeBlock()
    }
  }

  render() {
    return <div class="index">
      { this.showFrameRate && <FrameRateBlock /> }
      <BackgroundImage />

      <transition-group class="login-transition" name='fade' tag="div">
        { this.showLogin && <LoginComponent key='LoginComponent' /> }
        { this.isOpenSettings && <SettingsComponent key='SettingsComponent' /> }
      </transition-group>

      { !this.isViewThemeOnly && <ShutdownButton /> }
      { this.showGithubButton && <GithubButton /> }
      { this.isSupportFullApi && <AppBar /> }

      <AppDialog />
      <AppMenu />
    </div>
  }
}
