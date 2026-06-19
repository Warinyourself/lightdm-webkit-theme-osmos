import { defineComponent, computed } from 'vue'
import { useAppStore } from '@/store/app'
import { usePageStore } from '@/store/page'
import timeRef, { timePresets, type TimePreset } from '@/utils/time'

export default defineComponent({
  name: 'UserClock',
  setup() {
    const appStore = useAppStore()
    const pageStore = usePageStore()

    const formatted = computed(() => {
      const preset = (appStore.timeFormat as TimePreset) || 'HH:mm'
      const options = timePresets[preset] ?? timePresets['HH:mm']
      return new Intl.DateTimeFormat(pageStore.locale, options).format(timeRef.time)
    })

    return () => <div class="user-clock">{formatted.value}</div>
  }
})
