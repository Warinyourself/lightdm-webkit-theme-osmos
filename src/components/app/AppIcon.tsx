import { defineComponent, computed, h, type Component } from 'vue'

const icons = import.meta.glob('@/assets/icons/*.svg', {
  eager: true,
  import: 'default',
  query: '?component'
}) as Record<string, Component>

export default defineComponent({
  name: 'AppIcon',

  inheritAttrs: false,

  props: {
    name: { type: String, default: 'heart' }
  },

  emits: {
    click: (_event: MouseEvent) => true
  },

  setup(props, { attrs, emit }) {
    const icon = computed(() => {
      const key = Object.keys(icons).find((k) => k.endsWith(`/${props.name}.svg`))
      return key ? icons[key] : null
    })

    return () => {
      if (icon.value) {
        return h(icon.value as any, {
          ...attrs,
          onClick: (event: MouseEvent) => emit('click', event)
        })
      }
      return <div class="widget-user-image" style={`background-image: url(${props.name})`} />
    }
  }
})
