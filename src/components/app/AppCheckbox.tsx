import { Component, Prop, Vue } from 'vue-property-decorator'
import AppIcon from '@/components/app/AppIcon.vue'

@Component({
  components: { AppIcon }
})
export default class AppCheckbox extends Vue {
  @Prop({ default: false }) value!: boolean
  @Prop({ default: '' }) label!: string

  get classes(): Record<string, boolean> {
    return {
      checkbox: true,
      'checkbox--active': this.value
    }
  }

  get idCheckbox(): string {
    return `input-${(this as any)._uid}`
  }

  changeState(): void {
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
      <p class="input-label">
        { this.label }
      </p>
    </label>
  }
}
