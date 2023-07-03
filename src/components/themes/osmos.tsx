import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import Parallax from 'parallax-js'

export default defineComponent({
  name: 'OsmosTheme',
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
        class="osmos"
        ref={sceneRef}
        data-hover-only="true"
        data-friction-x="0.1"
        data-friction-y="0.1"
        data-scalar-x="25"
        data-scalar-y="15"
      >
        <li class="prllx-block" data-depth="0.0">
          <div class="stars" />
        </li>
        <li class="prllx-block" data-depth="0.0">
          <div class="sun" />
        </li>
        <li class="prllx-block" data-depth="0.1">
          <div class="clouds">
            <div /><div /><div />
          </div>
          <div class="clouds-reflex">
            <div /><div /><div />
          </div>
        </li>
        <li class="prllx-block" data-depth="0.0">
          <div class="sea">
            <div class="rocks">
              <div class="rocks_left">
                <div /><div /><div />
              </div>
              <div class="rocks_right">
                <div /><div /><div />
              </div>
            </div>
          </div>
        </li>
      </div>
    )
  }
})
