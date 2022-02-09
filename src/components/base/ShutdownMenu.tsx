import { Component, Vue } from 'vue-property-decorator'

import AppIcon from '@/components/app/AppIcon.vue'
import { appWindow } from '@/models/lightdm'

@Component({
  components: { AppIcon }
})
export default class ShutdownMenu extends Vue {
  get actions() {
    return [
      {
        icon: 'restart',
        show: appWindow.lightdm.can_restart,
        callback: appWindow.lightdm.restart
      },
      {
        icon: 'suspend',
        show: appWindow.lightdm.can_suspend,
        callback: appWindow.lightdm.suspend
      },
      {
        icon: 'hibernate',
        show: appWindow.lightdm.can_hibernate,
        callback: appWindow.lightdm.hibernate
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
