import { Component, Vue } from 'vue-property-decorator'

import { AppModule } from '@/store/app'
import AppIcon from '@/components/app/AppIcon.vue'
import { LightdmUsers } from '@/models/lightdm'
import { PageModule } from '@/store/page'
import timer from '@/utils/time'

@Component({
  components: { AppIcon }
})
export default class UserAvatar extends Vue {
  get currentTime() {
    return this.isOpenSettings ? timer.longTime : timer.shortTime
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

  buildUserAvatar(image: string | undefined) {
    const defaultAvatar = <AppIcon name='user'/>
    const userAvatar = <div
      class='user-avatar'
      style={ { 'background-image': `url("${image}")` } }
    />

    return image ? userAvatar : defaultAvatar
  }

  buildUser(user: LightdmUsers) {
    return <div class='user-choice' key={ user.username }>
      <p class='time'> { this.currentTime } </p>
      { this.buildUserAvatar(user?.image) }
      <div class='user-name'> { user?.display_name } </div>
    </div>
  }

  render() {
    return <transition-group tag="div" name="fade-bottom" class="transition-group">
      { this.users.filter(({ username }) => username === this.user?.username).map(this.buildUser) }
    </transition-group>
  }
}
