import { Component, Vue } from 'vue-property-decorator'

import AppIcon from '@/components/app/AppIcon.vue'
import { systemActionsObject } from '@/utils/helper'
import { LightdmHandler } from '@/utils/lightdm'

@Component({
  components: { AppIcon }
})
export default class ShutdownMenu extends Vue {
  get actions() {
    return [
      {
        icon: 'restart',
        show: LightdmHandler.canRestart,
        callback: systemActionsObject.restart
      },
      {
        icon: 'suspend',
        show: LightdmHandler.canSuspend,
        callback: systemActionsObject.suspend
      },
      {
        icon: 'hibernate',
        show: LightdmHandler.canHibernate,
        callback: systemActionsObject.hibernate
      }
    ].filter(({ show }) => show)
  }

  render() {
    return <div class="shutdown-menu active-interface">
      { this.actions.map((action) => {
        return <div class="shutdown-item" onClick={ action.callback }>
          <AppIcon name={ action.icon } />
        </div>
      })}
    </div>
  }
}
