import { Component, Vue } from 'vue-property-decorator'

import { PageModule } from '@/store/page'
import AppIcon from '@/components/app/AppIcon.vue'
import ShutdownMenu from '@/components/base/ShutdownMenu'
import { appWindow } from '@/models/lightdm'

@Component({
  components: { AppIcon, ShutdownMenu }
})
export default class ShutdownBlock extends Vue {
  get isShow() {
    return !!PageModule.activeBlock
  }

  shutdown(event: MouseEvent) {
    event.stopPropagation()
    appWindow.lightdm.suspend()
  }

  render() {
    const button = <div class="shutdown-block">
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
