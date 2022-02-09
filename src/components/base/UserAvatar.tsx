import { Component, Vue } from 'vue-property-decorator'

import { AppModule } from '@/store/app'
import AppIcon from '@/components/app/AppIcon.vue'
import { LightdmUsers } from '@/models/lightdm'
import { PageModule } from '@/store/page'
import { DateTimeFormatOptions } from 'vue-i18n'

@Component({
  components: { AppIcon }
})
export default class UserAvatar extends Vue {
  updater = new Date().getTime()

  get currentTime() {
    const options: DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }

    if (this.isOpenSettings) {
      options.month = 'long'
      options.day = 'numeric'
      options.weekday = 'short'
    }

    return new Intl.DateTimeFormat(this.locale, options).format(new Date())
  }

  get isOpenSettings() {
    return PageModule.isOpenBlock('settings')
  }

  get locale() {
    return PageModule.locale
  }

  get user() {
    return AppModule.currentUser
  }

  get users() {
    return AppModule.users
  }

  mounted() {
    this.updater = new Date().getTime()

    setInterval(() => { this.updater = new Date().getTime() }, 1000)
  }

  render() {
    const buildUserAvatar = (image: string | undefined) => {
      const defaultAvatar = <AppIcon name='user'/>
      const userAvatar = <div
        class='user-avatar'
        style={ { 'background-image': `url("${image}")` } }
      />

      return image ? userAvatar : defaultAvatar
    }

    const buildUser = (user: LightdmUsers) => {
      return <div class='user-choice' key={ user.username }>
        <p class='time' key={ this.updater }> { this.currentTime } </p>
        { buildUserAvatar(user?.image) }
        <div class='user-name'> { user?.display_name } </div>
      </div>
    }

    return <transition-group tag="div" name="fade-bottom" class="transition-group">
      { this.users.filter(({ username }) => username === this.user?.username).map(buildUser) }
    </transition-group>
  }
}
