import { Power } from '@lucide/vue'
import { defineComponent } from 'vue'
import { systemActionsObject } from '@/utils/helper'
import ShutdownMenu from './ShutdownMenu'

export default defineComponent({
  name: 'ShutdownButton',
  setup() {
    return () => (
      <div class="shutdown-block active-block">
        <ShutdownMenu />
        <div class="shutdown-button active-interface" onClick={systemActionsObject.shutdown}>
          <Power />
        </div>
      </div>
    )
  }
})
