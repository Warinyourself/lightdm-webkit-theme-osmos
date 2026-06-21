import { defineComponent, computed, h } from 'vue'
import { useThemeStore } from '@/store/theme'

import flow from '@/components/themes/flow'
import sphere from '@/components/themes/sphere'
import rings from '@/components/themes/rings'
import plasma from '@/components/themes/plasma'
import destruction from '@/components/themes/destruction'
import tenderness from '@/components/themes/tenderness'
import planet from '@/components/themes/planet'
import random from '@/components/themes/random'
import tunnel from '@/components/themes/tunnel'
import contour from '@/components/themes/contour'
import rings3d from '@/components/themes/rings3d'
import zappy from '@/components/themes/zappy'

const themeMap: Record<string, any> = {
  flow,
  sphere,
  rings,
  plasma,
  destruction,
  tenderness,
  planet,
  random,
  tunnel,
  contour,
  rings3d,
  zappy,
}

export default defineComponent({
  name: 'BackgroundImage',
  setup() {
    const themeStore = useThemeStore()
    const theme = computed(() => themeStore.activeTheme)

    return () => {
      const component = themeMap[theme.value.component ?? 'random'] ?? themeMap.random
      return (
        <div class="background-image">
          {h(component)}
        </div>
      )
    }
  }
})
