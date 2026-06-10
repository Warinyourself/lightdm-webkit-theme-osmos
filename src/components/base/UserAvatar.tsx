import { User } from '@lucide/vue'
import { defineComponent } from 'vue'
import { useAppStore } from '@/store/app'
import type { LightdmUsers } from '@/models/lightdm'

export default defineComponent({
  name: 'UserAvatar',
  setup() {
    const appStore = useAppStore()

    const buildUserAvatar = (image: string | undefined) =>
      image
        ? <img class="user-avatar" src={image} />
        : <User />

    const buildUser = (user: LightdmUsers) => (
      <div class="user-choice" key={user.username}>
        {buildUserAvatar(user?.image)}
        <div class="user-name">{user?.display_name}</div>
      </div>
    )

    return () => (
      <transition-group tag="div" name="fade-bottom" class="transition-group">
        {appStore.users.filter(({ username }) => username === appStore.currentUser?.username).map(buildUser)}
      </transition-group>
    )
  }
})
