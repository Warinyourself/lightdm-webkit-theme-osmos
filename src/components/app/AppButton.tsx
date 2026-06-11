import { defineComponent, computed, h, type PropType } from 'vue'
import { LoaderCircle } from '@lucide/vue'

const prefix = 'app-button'

export default defineComponent({
  name: 'AppButton',

  props: {
    label: String,
    icon: String,
    type: String,
    fab: Boolean,
    link: Boolean,
    block: Boolean,
    target: String,
    loading: Boolean,
    nuxt: Boolean,
    color: { type: String, default: 'transparent' },
    disabled: Boolean,
    tag: { type: String, default: 'button' },
    to: [Object, String],
    href: [Object, String],
    onClick: Function as PropType<(event: MouseEvent) => void>
  },

  setup(props, { slots, attrs }) {
    const classes = computed(() => ({
      [prefix]: true,
      [`${prefix}--${props.color}`]: true,
      [`${prefix}--fab`]: !!props.fab,
      [`${prefix}--block`]: !!props.block
    }))

    const handleClick = (event: MouseEvent) => {
      if (props.disabled || props.loading) return
      props.onClick?.(event)
    }

    return () => {
      let tag = props.tag || 'button'
      if (props.to) tag = 'router-link'
      else if (props.href) tag = 'a'

      const btnProps: Record<string, any> = {
        class: classes.value,
        ...attrs,
        onClick: handleClick
      }

      if (tag === 'button') {
        btnProps.type = props.type
        btnProps.disabled = props.disabled
      }
      if (tag === 'router-link') btnProps.to = props.to
      if (tag === 'a') btnProps.href = props.href
      if (props.target) btnProps.target = props.target

      const content = <span class={`${prefix}__content`}>{slots.default?.()}</span>
      const loader = props.loading && (
        <span class={`${prefix}__loader`}>
          {slots.loader?.() || <LoaderCircle class="spin" />}
        </span>
      )

      return h(tag, btnProps, [content, loader])
    }
  }
})
