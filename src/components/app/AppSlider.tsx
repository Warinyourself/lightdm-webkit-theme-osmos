import { Component, Prop, Vue } from 'vue-property-decorator'
import noUiSlider from 'nouislider'
import { Debounce } from '@/utils/helper'

@Component
export default class AppSlider extends Vue {
  @Prop({ type: [Number], default: '' }) value!: number | string
  @Prop({ default: '' }) label!: string
  @Prop({ type: Number, default: 0 }) from!: number
  @Prop({ type: Number, default: 100 }) to!: number
  @Prop({ type: Number, default: 1 }) step!: number
  @Prop({ type: Boolean, default: false }) changeOnUpdate!: boolean

  preValue = 0

  @Debounce(100)
  syncSliderValue() {
    const slider = (this.$refs.slider as any).noUiSlider
    const sliderValue = parseFloat(slider.get())
    const isDifferentValues = sliderValue !== this.value

    if (isDifferentValues) {
      slider.set(this.value)
    }
  }

  updated() {
    this.syncSliderValue()
  }

  mounted() {
    const slider = this.$refs.slider as any
    const isValidValue = this.value !== 'undefined'

    noUiSlider.create(slider, {
      start: isValidValue ? this.value : this.to,
      connect: 'lower',
      step: this.step,
      range: {
        min: this.from,
        max: this.to
      }
    })

    slider.noUiSlider.on('slide', (values: string[]) => {
      this.preValue = parseFloat(values[0])
    })

    const eventChange = this.changeOnUpdate ? 'update' : 'set'

    slider.noUiSlider.on(eventChange, (values: string[]) => {
      const value = parseFloat(values[0])

      this.$emit('input', value)
    })
  }

  render() {
    return <div class="app-slider">
      <div class="app-slider__content">
        <p class="mb-2"> { this.$t(this.label) } </p>
      </div>
      <div class="center-x">
        <div ref="slider" class="slider-input"></div>
      </div>
    </div>
  }
}
