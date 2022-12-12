import { Component, Vue } from 'vue-property-decorator'
import { PageModule } from '@/store/page'
import AppIcon from '@/components/app/AppIcon.vue'
import ShutdownMenu from '@/components/base/ShutdownMenu'
import { systemActionsObject } from '@/utils/helper'

@Component({
  components: { AppIcon, ShutdownMenu }
})
export default class ShutdownBlock extends Vue {
  render() {
    return <div class="shutdown-block active-block">
      <ShutdownMenu />
      <div class="shutdown-button active-interface" onClick={ systemActionsObject.shutdown }>
        <AppIcon name="shutdown" />
      </div>
    </div>
  }
}
