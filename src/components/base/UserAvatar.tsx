import AppIcon from '@/components/app/AppIcon.vue'
import { defineComponent, computed } from 'vue'
import { useAppStore } from '@/store/app'
import { usePageStore } from '@/store/page'
import timer from '@/utils/time'
import type { LightdmUsers } from '@/models/lightdm'

export default defineComponent({
  name: 'UserAvatar',
  setup() {
    const appStore = useAppStore()
    const pageStore = usePageStore()

    const isOpenSettings = computed(() => pageStore.isOpenBlock('settings'))
    const currentTime = computed(() => isOpenSettings.value ? timer.longTime : timer.shortTime)

    const buildUserAvatar = (image: string | undefined) =>
      image
        ? <img class="user-avatar" src={image} />
        : <AppIcon name="user" />

    const buildUser = (user: LightdmUsers) => (
      <div class="user-choice" key={user.username}>
        <p class="time">{appStore.isSupportFullApi ? '' : currentTime.value}</p>
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
