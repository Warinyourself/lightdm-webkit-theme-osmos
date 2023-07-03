import AppIcon from '@/components/app/AppIcon.vue'
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import Parallax from 'parallax-js'

export default defineComponent({
  name: 'SuprematismTheme',
  setup() {
    const sceneRef = ref<HTMLElement | null>(null)
    let parallax: Parallax | null = null

    onMounted(() => {
      if (sceneRef.value) parallax = new Parallax(sceneRef.value)
    })

    onBeforeUnmount(() => {
      parallax?.destroy()
    })

    return () => (
      <div
        class="suprematism"
        ref={sceneRef}
        data-hover-only="true"
        data-friction-x="0.1"
        data-friction-y="0.1"
        data-scalar-x="25"
        data-scalar-y="15"
      >
        <li class="prllx-block" data-depth="0.0">
          <div class="parralax-item-cube position-center" />
        </li>
        <li class="prllx-block" data-depth="0.05">
          <div class="parralax-item-bottom-left">
            <AppIcon name="suprematism-bottom-left" />
          </div>
          <div class="parralax-item-bottom-right">
            <AppIcon name="suprematism-bottom-right" />
          </div>
          <div class="parralax-item-top-right">
            <AppIcon name="suprematism-top-right" />
          </div>
          <div class="parralax-item-top-left">
            <AppIcon name="suprematism-top-left" />
          </div>
        </li>
        <li class="prllx-block" data-depth=".1">
          <div class="parralax-item-bottom-right-triangle" />
          <div class="parralax-item-top-left-multi" />
          <div class="parralax-item-bottom-left-pattern">
            <AppIcon name="suprematism-bottom-left-pattern" />
          </div>
        </li>
        <li class="prllx-block" data-depth=".2">
          <div class="ps-parralax-item-top-right-circle" />
        </li>
      </div>
    )
  }
})
