import { User } from '@lucide/vue'
import { defineComponent } from 'vue'
import { useLightdm } from '@/composables/useLightdm'
import { usePageStore } from '@/store/page'

export default defineComponent({
  name: 'UserAvatar',
  setup() {
    const session = useLightdm()
    const pageStore = usePageStore()

    const openSettings = () => {
      pageStore.openTab({ type: 'settings' })
      pageStore.openBlock({ id: 'settings' })
    }

    return () => {
      const user = session.currentUser.value
      return (
        <div class="user-choice" onClick={openSettings}>
          {user?.image
            ? <img class="user-avatar" src={user.image} />
            : <User />}
          <div class="user-name">{user?.display_name}</div>
        </div>
      )
    }
  }
})
