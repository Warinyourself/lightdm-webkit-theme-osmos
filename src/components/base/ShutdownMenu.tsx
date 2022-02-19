import { Component, Vue } from 'vue-property-decorator'

import AppIcon from '@/components/app/AppIcon.vue'
import { appWindow } from '@/models/lightdm'
import { systemActionsObject } from '@/utils/helper'

@Component({
  components: { AppIcon }
})
export default class ShutdownMenu extends Vue {
  get actions() {
    return [
      {
        icon: 'restart',
        show: appWindow.lightdm.can_restart,
        callback: systemActionsObject.restart
      },
      {
        icon: 'suspend',
        show: appWindow.lightdm.can_suspend,
        callback: systemActionsObject.suspend
      },
      {
        icon: 'hibernate',
        show: appWindow.lightdm.can_hibernate,
        callback: systemActionsObject.hibernate
      }
    ].filter(({ show }) => show)
  }

  render() {
    return <div class="shutdown-menu">
      { this.actions.map((action) => {
        return <div class="shutdown-item" onClick={ action.callback }>
          <AppIcon name={ action.icon } />
        </div>
      })}
    </div>
  }
}
