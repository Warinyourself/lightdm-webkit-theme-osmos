import { RotateCw, Moon, Snowflake } from '@lucide/vue'
import { defineComponent, computed } from 'vue'
import { systemActionsObject } from '@/utils/helper'
import { useLightdm } from '@/composables/useLightdm'

const icons = { restart: RotateCw, suspend: Moon, hibernate: Snowflake }

export default defineComponent({
  name: 'ShutdownMenu',
  setup() {
    const session = useLightdm()

    const actions = computed(() =>
      [
        { icon: 'restart', show: session.canRestart.value, callback: systemActionsObject.restart },
        { icon: 'suspend', show: session.canSuspend.value, callback: systemActionsObject.suspend },
        { icon: 'hibernate', show: session.canHibernate.value, callback: systemActionsObject.hibernate }
      ].filter(({ show }) => show)
    )

    return () => (
      <div class="shutdown-menu active-interface">
        {actions.value.map((action) => {
          const Icon = icons[action.icon as keyof typeof icons]
          return (
            <div class="shutdown-item" onClick={action.callback}>
              <Icon />
            </div>
          )
        })}
      </div>
    )
  }
})
