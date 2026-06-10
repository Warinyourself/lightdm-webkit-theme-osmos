import { defineComponent, computed, onMounted } from 'vue'
import { usePageStore } from '@/store/page'
import UserAvatar from './UserAvatar'
import UserInput from './UserInput'
import { focusInputPassword } from '@/utils/helper'

export default defineComponent({
  name: 'LoginComponent',
  setup() {
    const pageStore = usePageStore()

    const activeBlock = computed(() => pageStore.activeBlock)

    onMounted(() => {
      void Promise.resolve().then(focusInputPassword)
    })

    return () => (
      <div class={`block-${activeBlock.value?.id}`}>
        <div class={`active-interface login-view login-view--${pageStore.loginPosition}`}>
          <UserAvatar />
          <UserInput />
        </div>
      </div>
    )
  }
})
