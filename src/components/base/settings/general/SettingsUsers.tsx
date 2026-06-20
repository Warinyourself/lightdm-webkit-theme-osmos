import { User } from '@lucide/vue'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLightdm } from '@/composables/useLightdm'
import type { LightdmUsers } from '@/models/lightdm'

export default defineComponent({
  name: 'SettingsUsers',
  setup() {
    const session = useLightdm()
    const { t } = useI18n()

    const buildUserBlock = (user: LightdmUsers) => {
      const isActive = user.username === session.username.value
      const activateUser = () => { session.username.value = user.username }

      return (
        <div onClick={activateUser} class={`settings-user-block ${isActive ? 'active' : ''}`}>
          {user.image
            ? <div class="settings-user-image" style={`background-image: url(${user.image})`} />
            : <User class="settings-user-image" />}
          <p class="settings-user-name">{user.display_name}</p>
        </div>
      )
    }

    return () => (
      <div>
        <h2 class="title mb-1">{t('settings.users')}</h2>
        <div class="users-grid">{session.users.value.map(buildUserBlock)}</div>
      </div>
    )
  }
})
