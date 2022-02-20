import { Component, Vue } from 'vue-property-decorator'

import AppSelector, { AppSelectorProps as SProps } from '@/components/app/AppSelector'
import AppCheckbox from '@/components/app/AppCheckbox'
import { PageModule } from '@/store/page'
import { LoginPosition } from '@/models/page'
import { AppModule } from '@/store/app'
import AppIcon from '@/components/app/AppIcon.vue'
import { generateDesktopIcons, languageMap } from '@/utils/helper'
import AppButton from '@/components/app/AppButton'
import { osList } from '@/models/app'
import { LightdmUsers } from '@/models/lightdm'

@Component({ components: { AppIcon, AppSelector } })
export default class SettingsGeneral extends Vue {
  get bodyClass() {
    return AppModule.bodyClass
  }

  get users() {
    return AppModule.users
  }

  get showFrameRate() {
    return AppModule.showFrameRate
  }

  get isViewThemeOnly() {
    return AppModule.viewThemeOnly
  }

  get languageList() {
    return PageModule.languages.map((language) => ({
      text: languageMap[language],
      value: language
    }))
  }

  get menuPositionItems() {
    const positions = ['top', 'left', 'right', 'bottom', 'center']
    return positions.map(word => ({
      value: word,
      text: this.$t(`settings.login-position.${word}`).toString()
    }))
  }

  get menuPositionValue() {
    return {
      value: PageModule.loginPosition,
      text: this.$t(`settings.login-position.${PageModule.loginPosition}`).toString()
    }
  }

  changeLanguage(value: string) {
    this.$i18n.locale = value
    localStorage.setItem('language', value)
    PageModule.SET_STATE_PAGE({ key: 'language', value })
  }

  changeLoginPosition(position: string) {
    localStorage.setItem('loginPosition', position)
    PageModule.SET_STATE_PAGE({ key: 'loginPosition', value: position as LoginPosition })
  }

  changeDesktop(value: string) {
    AppModule.SAVE_STATE_APP({ key: 'desktop', value })
  }

  changeOs(value: string) {
    AppModule.SAVE_STATE_APP({ key: 'currentOs', value })
  }

  buildCheckbox(name: string) {
    return <AppCheckbox
      label={ this.$t(`settings.${name}`) }
      value={ this.bodyClass[name] }
      onInput={ (value: boolean) => {
        AppModule.CHANGE_BODY_CLASS({ key: name, value })
        AppModule.syncStoreWithQuery()
      }}
    />
  }

  buildSelector(labelI18n: SProps['label'], items: SProps['items'], value: SProps['value'], callback: (value: string) => void) {
    const label = this.$t(`settings.${labelI18n}`)
    return <AppSelector
      label={ label }
      items={ items }
      value={ value }
      onInput={ callback }
    />
  }

  resetSettings() {
    localStorage.clear()
    AppModule.setUpSettings()

    const hasQyery = Object.keys(this.$route.query).length
    if (hasQyery) { this.$router.replace({}) }
  }

  buildUserBlock(user: LightdmUsers) {
    const isActive = user.username === AppModule.username
    const activateUser = () => AppModule.SAVE_STATE_APP({ key: 'username', value: user.username })

    return <div
      onClick={ activateUser }
      class={`settings-user-block ${isActive ? 'active' : ''}`}
    >
      <AppIcon class='settings-user-image' name={ user.image || 'user' } />
      <p class="settings-user-name"> { user.display_name } </p>
    </div>
  }

  buildUsersBlock() {
    return [
      <h2 class="title mb-1"> { this.$t('settings.users') } </h2>,
      <div class="users-grid"> { this.users.map(this.buildUserBlock) } </div>
    ]
  }

  buildSettingsSection() {
    return <div class="grid-two">
      <h2 class="title"> { this.$t('settings.title') } </h2>
      { this.buildSelector('choice-language', this.languageList, PageModule.language, this.changeLanguage) }
      { this.buildSelector('login-position.about', this.menuPositionItems, this.menuPositionValue, this.changeLoginPosition) }
      { !this.isViewThemeOnly && this.buildSelector('choice-desktop', generateDesktopIcons(), AppModule.currentDesktop?.key, this.changeDesktop) }
      { !this.isViewThemeOnly && this.buildSelector('choice-os', osList, AppModule.currentOs, this.changeOs) }
    </div>
  }

  buildCheckboxSection() {
    return <div class="grid-two">
      <h2 class="title"> { this.$t('settings.performance') } </h2>
      { this.buildCheckbox('blur') }
      { this.buildCheckbox('show-framerate') }
      { this.buildCheckbox('no-transition') }
      { this.buildCheckbox('only-ui') }
    </div>
  }

  render() {
    return <div class='user-settings-general'>
      { this.buildCheckboxSection() }
      { this.buildSettingsSection() }

      { !this.isViewThemeOnly && this.buildUsersBlock() }

      <div class="help-block">
        <AppButton onClick={ this.resetSettings } block>
          { this.$t('settings.reset-settings') }
        </AppButton>
      </div>
    </div>
  }
}
