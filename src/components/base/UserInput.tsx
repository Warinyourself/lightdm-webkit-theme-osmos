import { Component, Vue } from 'vue-property-decorator'

import { AppModule } from '@/store/app'
import AppIcon from '@/components/app/AppIcon.vue'
import { PageModule } from '@/store/page'

@Component({
  components: { AppIcon }
})
export default class UserInput extends Vue {
  logging = false

  get user() {
    return AppModule.currentUser
  }

  get passwordValue() {
    return AppModule.password
  }

  get showPassword() {
    return AppModule.showPassword
  }

  login() {
    AppModule.login()
  }

  handleKeyup(event: InputEvent) {
    AppModule.SET_STATE_APP({ key: 'password', value: (event.target as HTMLInputElement)?.value || '' })
  }

  openSettings(event: Event) {
    event.preventDefault()
    event.stopPropagation()

    PageModule.openBlock({ id: 'settings' })
  }

  render() {
    return <div class='user-input'>
      <AppIcon class='settings-button' name='settings' onClick={ this.openSettings } />

      <input
        id='password'
        type={ this.showPassword ? 'text' : 'password'}
        name='password'
        autocomplete='on'
        autofocus
        ref='password'
        class='mousetrap'
        placeholder={ this.$t('text.password') }
        onKeyup={this.handleKeyup}
        value={this.passwordValue}
        readonly={this.logging}
      />

      <AppIcon
        class={ ['icon icon-eye', { hide: !this.showPassword }] }
        name='eye'
        onClick={ AppModule.toggleShowPassword }
      />

      <button
        class='user-input-login'
        onClick={this.login}
      >
        <AppIcon name='arrow' />
      </button>
    </div>
  }
}
