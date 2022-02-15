import { Component, Vue } from 'vue-property-decorator'

import { AppModule } from '@/store/app'
import { PageModule } from '@/store/page'

import AppIcon from '@/components/app/AppIcon.vue'
import UserAvatar from '@/components/base/UserAvatar'
import UserInput from '@/components/base/UserInput'
import SettingsView from '@/components/base/settings/SettingsView'

@Component({
  components: {
    AppIcon,
    UserInput,
    UserAvatar,
    SettingsView
  }
})
export default class LoginComponent extends Vue {
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
    const tabs = [this.$t('settings.choice-themes'), this.$t('settings.general')]
    const hasThemeSettings = AppModule.activeTheme?.settings?.length !== undefined

    if (hasThemeSettings) {
      tabs.splice(1, 0, this.$t('settings.customize-theme'))
    }

    return tabs
  }

  activateTab(index: number) {
    PageModule.SET_STATE_PAGE({ key: 'mainTabIndex', value: index })
  }

  openSettings(event: Event) {
    event.preventDefault()
    event.stopPropagation()

    PageModule.openBlock({ id: 'settings' })
  }

  render() {
    const nativeOn = {
      click: (event: Event) => {
        this.openSettings(event)
        PageModule.openTab({ type: 'settings' })
      }
    }

    return <div class={ `block-${this.activeBlock?.id}` }>
      <div class={ `login-view login-view--${PageModule.loginPosition}` }>
        <AppIcon name={ this.currentDesktop?.key } class='desktop-icon'/>
        <AppIcon name={ AppModule.currentOs } class='system-icon'/>
        <UserAvatar />
        <UserInput />
      </div>
    </div>
  }
}
