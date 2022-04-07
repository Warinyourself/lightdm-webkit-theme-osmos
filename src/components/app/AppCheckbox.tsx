import { Component, Prop, Vue } from 'vue-property-decorator'
import AppIcon from '@/components/app/AppIcon.vue'

@Component({
  components: { AppIcon }
})
export default class AppCheckbox extends Vue {
  @Prop({ default: false }) value!: boolean
  @Prop({ default: '' }) label!: string

  get isActive() {
    return this.value
  }

  get classes() {
    return {
      checkbox: true,
      'checkbox--active': this.value
    }
  }

  get idCheckbox() {
    return `input-${(this as any)._uid}`
  }

  changeState() {
    this.$emit('input', !this.value)
  }

  render() {
    return <label class={ this.classes }>
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
