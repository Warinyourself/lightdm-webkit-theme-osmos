import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import Parallax from 'parallax-js'

export default defineComponent({
  name: 'SpaceTheme',
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
        class="space"
        ref={sceneRef}
        data-hover-only="true"
        data-friction-x="0.1"
        data-friction-y="0.1"
        data-scalar-x="25"
        data-scalar-y="15"
      >
        <li class="prllx-block" data-depth="0.0">
          <div class="main-planet position-center" />
        </li>
        <li class="prllx-block" data-depth="0.2">
          <div class="ufo" />
        </li>
        <li class="prllx-block" data-depth="0.1">
          <div class="meteor" />
        </li>
        <li class="prllx-block" data-depth="0.07">
          <div class="hole" />
        </li>
        <li class="prllx-block" data-depth="0.02">
          <div class="another-planet" />
        </li>
      </div>
    )
  }
})
