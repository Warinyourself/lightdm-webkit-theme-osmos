import AppIcon from '@/components/app/AppIcon.vue'
import { defineComponent, computed } from 'vue'
import { systemActionsObject } from '@/utils/helper'
import { LightdmHandler } from '@/utils/lightdm'

export default defineComponent({
  name: 'ShutdownMenu',
  setup() {
    const actions = computed(() =>
      [
        { icon: 'restart', show: LightdmHandler.canRestart, callback: systemActionsObject.restart },
        { icon: 'suspend', show: LightdmHandler.canSuspend, callback: systemActionsObject.suspend },
        { icon: 'hibernate', show: LightdmHandler.canHibernate, callback: systemActionsObject.hibernate }
      ].filter(({ show }) => show)
    )

    return () => (
      <div class="shutdown-menu active-interface">
        {actions.value.map((action) => (
          <div class="shutdown-item" onClick={action.callback}>
            <AppIcon name={action.icon} />
          </div>
        ))}
      </div>
    )
  }
})
