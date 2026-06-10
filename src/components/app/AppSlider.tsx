import { defineComponent, onMounted, onUpdated, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import noUiSlider from 'nouislider'
import { debounce } from '@/utils/helper'

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
    const sliderRef = ref<HTMLElement | null>(null)

    const syncSliderValue = debounce(() => {
      const slider = sliderRef.value as any
      if (!slider?.noUiSlider) return
      const sliderValue = parseFloat(slider.noUiSlider.get())
      if (sliderValue !== props.modelValue) {
        slider.noUiSlider.set(props.modelValue)
      }
    }, 100)

    onMounted(() => {
      const slider = sliderRef.value as any
      const isValidValue = props.modelValue !== undefined

      noUiSlider.create(slider, {
        start: isValidValue ? props.modelValue : props.to,
        connect: 'lower',
        step: props.step,
        range: { min: props.from, max: props.to }
      })

      const eventChange = props.changeOnUpdate ? 'update' : 'set'
      slider.noUiSlider.on(eventChange, (values: string[]) => {
        emit('update:modelValue', parseFloat(values[0] ?? '0'))
      })
    })

    onUpdated(syncSliderValue)

    return () => (
      <div class="app-slider">
        <div class="app-slider__content">
          <p class="mb-2">{t(props.label)}</p>
        </div>
        <div class="center-x">
          <div ref={sliderRef} class="slider-input" />
        </div>
      </div>
    )
  }
})
