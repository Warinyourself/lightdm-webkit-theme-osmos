import AppIcon from '@/components/app/AppIcon.vue'
import { defineComponent, computed, ref, type PropType } from 'vue'
import { usePageStore } from '@/store/page'
import type { AppMenuItem } from '@/models/page'

export default defineComponent({
  name: 'AppSelector',

  props: {
    modelValue: { type: [Object, String, Number] as PropType<AppMenuItem | string | number | null | undefined>, default: null },
    items: { type: Array as PropType<(AppMenuItem | string)[]>, default: () => [] },
    label: { type: String, default: '' }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const pageStore = usePageStore()
    const selectorRef = ref<HTMLElement | null>(null)
    const selectedValue = ref<AppMenuItem | string | null>(null)

    const fullSelectedItem = computed(() => {
      const selected = props.modelValue !== null ? props.modelValue : selectedValue.value
      const finalSelectedValue = typeof selected === 'object' ? (selected as AppMenuItem)?.value : selected
      return props.items.find((item) => {
        const finalValue = typeof item === 'object' ? item?.value : item
        return finalValue === finalSelectedValue
      })
    })

    const isActive = computed(
      () => pageStore.menu.view && (pageStore.menu as any).node === selectorRef.value
    )

    const currentValueLabel = computed(() => {
      const selected = fullSelectedItem.value ?? selectedValue.value
      return typeof selected === 'object' ? (selected as AppMenuItem)?.text : selected
    })

    const callback = (item: AppMenuItem | string) => {
      const finalValue = typeof item === 'object' ? item.value : item
      selectedValue.value = item
      emit('update:modelValue', finalValue)
    }

    const openSelector = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()

      if (pageStore.menu.view) {
        return pageStore.assignMenu({ view: false })
      }

      pageStore.assignMenu({
        node: selectorRef.value as HTMLElement,
        view: true,
        items: props.items as AppMenuItem[],
        handler: callback
      })
    }

    return () => {
      const iconName = (fullSelectedItem.value as AppMenuItem)?.icon
      const selectorIcon = iconName ? (
        <AppIcon class="menu-icon selector-icon" name={iconName} />
      ) : null

      return (
        <div
          onClick={openSelector}
          ref={selectorRef}
          class={['selector', isActive.value ? 'active' : '']}
        >
          <h2 class="selector-label">
            {selectorIcon}
            <p class="selector-label-text">{currentValueLabel.value || props.label}</p>
          </h2>
          <AppIcon name="arrow" class="icon selector-arrow" />
        </div>
      )
    }
  }
})
