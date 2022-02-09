import { Component, Prop, Vue } from 'vue-property-decorator'
import AppIcon from '@/components/app/AppIcon.vue'

@Component({
  components: { AppIcon }
})
export default class AppCheckbox extends Vue {
  @Prop({ type: Boolean, default: false }) value!: boolean
  @Prop({ default: '' }) label!: string

  get isActive() {
    return this.value
  }

  get idCheckbox() {
    return `input-${(this as any)._uid}`
  }

  changeState() {
    this.$emit('input', !this.value)
  }

  render() {
    return <label class={['checkbox', this.value ? 'checkbox--active' : '']}>
      <div class="checkbox-control">
        <div class="checkbox-control-box">
          <AppIcon name="checkbox"></AppIcon>
        </div>
        <input
          type="checkbox"
          value={ this.value }
          aria-checked={ this.value }
          id={ this.idCheckbox }
          onInput={ this.changeState }
        />
      </div>
      <p for={ this.idCheckbox } class="input-label">
        { this.label }
      </p>
    </label>
  }
}
