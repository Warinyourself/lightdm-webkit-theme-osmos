import { defineComponent, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'AppSlider',

  props: {
    modelValue: { type: Number, default: 0 },
    label: { type: String, default: '' },
    from: { type: Number, default: 0 },
    to: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    changeOnUpdate: { type: Boolean, default: false } // kept for API compat, ignored
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const { t } = useI18n()
    const dragging = ref(false)

    // Local display value tracks thumb position during drag without touching the store
    const localValue = ref<number | null>(null)
    const displayValue = computed(() => localValue.value ?? props.modelValue)

    const progress = computed(() => {
      const range = props.to - props.from
      return range === 0 ? 0 : ((displayValue.value - props.from) / range) * 100
    })

    const onInput = (event: Event) => {
      const v = parseFloat((event.target as HTMLInputElement).value)
      localValue.value = v
      emit('update:modelValue', v)
    }

    const onPointerDown = () => { dragging.value = true }

    const onPointerUp = (event: Event) => {
      dragging.value = false
      localValue.value = null
      // Emit final value on release to guarantee sync
      emit('update:modelValue', parseFloat((event.target as HTMLInputElement).value))
    }

    return () => (
      <div class="app-slider">
        <div class="app-slider__content">
          <p class="mb-2">{t(props.label)}</p>
          <span class="caption">{displayValue.value}</span>
        </div>
        <div class="center-x">
          <input
            type="range"
            class="slider-input"
            style={{ '--progress': `${progress.value}%` }}
            min={props.from}
            max={props.to}
            step={props.step}
            value={props.modelValue}
            onInput={onInput}
            onPointerdown={onPointerDown}
            onPointerup={onPointerUp}
          />
        </div>
      </div>
    )
  }
})
