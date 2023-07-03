import AppIcon from '@/components/app/AppIcon.vue'
import { defineComponent } from 'vue'
import { useAppStore } from '@/store/app'

export default defineComponent({
  name: 'BrightIcon',
  setup() {
    const appStore = useAppStore()
    return () => (
      <div class="app-bar__bright">
        <AppIcon name="brightness" class="brightness-icon" />
        {appStore.brightness}
      </div>
    )
  }
})
