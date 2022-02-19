import { Component, Vue } from 'vue-property-decorator'

import { PageModule } from '@/store/page'
import AppIcon from '@/components/app/AppIcon.vue'
import ShutdownMenu from '@/components/base/ShutdownMenu'
import Mousetrap from 'mousetrap'
import { modKey, systemActionsObject } from '@/utils/helper'

@Component({
  components: { AppIcon, ShutdownMenu }
})
export default class ShutdownBlock extends Vue {
  get isShow() {
    return !!PageModule.activeBlock
  }

  mounted() {
    Mousetrap.bind(`${modKey}+p`, systemActionsObject.shutdown)
  }

  shutdown(event: MouseEvent) {
    event.stopPropagation()
    systemActionsObject.shutdown()
  }

  render() {
    const button = <div class="shutdown-block active-block">
      <ShutdownMenu />
      <div class="shutdown-button" onClick={ this.shutdown }>
        <AppIcon name="shutdown" />
      </div>
    </div>

    return <transition name='fade'>
      { this.isShow ? button : null }
    </transition>
  }
}
