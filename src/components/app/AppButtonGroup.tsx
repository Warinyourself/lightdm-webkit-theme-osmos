import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/components/app/AppIcon.vue'

export interface ButtonGroupItem {
  text?: string
  value: string
  icon?: string
}

export default defineComponent({
  name: 'AppButtonGroup',
  props: {
    label: String,
    items: { type: Array as PropType<ButtonGroupItem[]>, default: () => [] },
    modelValue: String,
    block: Boolean,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => (
      <div class={['app-button-group', { 'app-button-group--block': props.block }]}>
        {props.label && <span class="app-button-group__label">{props.label}</span>}
        <div class="app-button-group__items">
          {props.items.map((item) => (
            <button
              key={item.value}
              class={['app-button-group__item', { active: item.value === props.modelValue }]}
              onClick={() => emit('update:modelValue', item.value)}
            >
              {item.icon && <AppIcon name={item.icon} />}
              {item.text && <span>{item.text}</span>}
            </button>
          ))}
        </div>
      </div>
    )
  }
})
