import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/app'
import AppIcon from '@/components/app/AppIcon.vue'
import { LightdmUsers } from '@/models/lightdm'

@Component({ components: { AppIcon } })
export default class SettingsUsers extends Vue {
  get users() {
    return AppModule.users
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

  render() {
    return <div>
      <h2 class="title mb-1"> { this.$t('settings.users') } </h2>
      <div class="users-grid"> { this.users.map(this.buildUserBlock) } </div>
    </div>
  }
}
