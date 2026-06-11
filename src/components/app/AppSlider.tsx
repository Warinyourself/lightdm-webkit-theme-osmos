import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'AppSlider',

  props: {
    modelValue: { type: Number, default: 0 },
    label: { type: String, default: '' },
    from: { type: Number, default: 0 },
    to: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    changeOnUpdate: { type: Boolean, default: false }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const { t } = useI18n()

    const progress = computed(() => {
      const range = props.to - props.from
      return range === 0 ? 0 : ((props.modelValue - props.from) / range) * 100
    })

    const onChange = (event: Event) => {
      emit('update:modelValue', parseFloat((event.target as HTMLInputElement).value))
    }

    return () => (
      <div class="app-slider">
        <div class="app-slider__content">
          <p class="mb-2">{t(props.label)}</p>
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
            onInput={props.changeOnUpdate ? onChange : undefined}
            onChange={!props.changeOnUpdate ? onChange : undefined}
          />
        </div>
      </div>
    )
  }
})
