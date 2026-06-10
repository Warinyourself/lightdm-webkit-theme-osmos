import { defineComponent, computed, h } from 'vue'
import { useAppStore } from '@/store/app'

import flow from '@/components/themes/flow'
import sphere from '@/components/themes/sphere'
import rings from '@/components/themes/rings'
import plasma from '@/components/themes/plasma'
import destruction from '@/components/themes/destruction'
import tenderness from '@/components/themes/tenderness'
import planet from '@/components/themes/planet'
import random from '@/components/themes/random'

const themeMap: Record<string, any> = {
  flow,
  sphere,
  rings,
  plasma,
  destruction,
  tenderness,
  planet,
  random,
}

export default defineComponent({
  name: 'BackgroundImage',
  setup() {
    const appStore = useAppStore()
    const theme = computed(() => appStore.activeTheme)

    return () => {
      const component = themeMap[theme.value.component ?? 'random'] ?? themeMap.random
      return (
        <div class="background-image">
          <div class="mask-background" />
          {h(component)}
        </div>
      )
    }
  }
})
