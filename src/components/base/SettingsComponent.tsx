import { Component, Vue } from 'vue-property-decorator'

import { AppModule } from '@/store/app'
import { PageModule } from '@/store/page'

import AppIcon from '@/components/app/AppIcon.vue'
import UserAvatar from '@/components/base/UserAvatar'
import SettingsView from '@/components/base/settings/SettingsView'

@Component({
  components: {
    AppIcon,
    UserAvatar,
    SettingsView
  }
})
export default class SettingsComponent extends Vue {
  get theme() {
    return AppModule.activeTheme
  }

  get classObject() {
    return {
      'login-menu': true
    }
  }

  get activeBlock() {
    return PageModule.activeBlock
  }

  get currentDesktop() {
    return AppModule.currentDesktop
  }

  get mainTabIndex() {
    return PageModule.mainTabIndex
  }

  get tabs() {
    const tabs = [this.$t('settings.choice-themes').toString(), this.$t('settings.general').toString()]
    const hasThemeSettings = AppModule.activeTheme?.settings?.length !== undefined

    if (hasThemeSettings) {
      tabs.splice(1, 0, this.$t('settings.customize-theme').toString())
    }

    return tabs
  }

  get isViewThemeOnly() {
    return AppModule.viewThemeOnly
  }

  activateTab(index: number) {
    PageModule.SET_STATE_PAGE({ key: 'mainTabIndex', value: index })
  }

  openLogin(event: Event) {
    event.preventDefault()
    event.stopPropagation()

    PageModule.openBlock({ id: 'login' })
  }

  generateTab(tab: string, index: number) {
    const classes = `user-settings-tab ${this.mainTabIndex === index ? 'active' : ''}`

    return <div class={ classes } onClick={() => this.activateTab(index)}> { tab } </div>
  }

  generateTabs() {
    return <div class='user-settings-tabs'>
      { this.tabs.map(this.generateTab) }
    </div>
  }

  render() {
    return <div class="block-settings login-content-settings">
      <div class="login-view active-interface">
        <AppIcon onClick={ this.openLogin } name='collapse' class='system-icon' />

        { !this.isViewThemeOnly && <UserAvatar /> }
        { this.generateTabs() }
        <SettingsView />
      </div>
    </div>
  }
}
