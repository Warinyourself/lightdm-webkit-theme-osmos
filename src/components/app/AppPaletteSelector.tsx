import { Component, Prop, Vue } from 'vue-property-decorator'
import AppIcon from '@/components/app/AppIcon.vue'

@Component({
  components: { AppIcon }
})
export default class AppPaletteSelector extends Vue {
  @Prop({ type: Number, default: 0 }) value!: number
  @Prop({ type: Array, required: true }) values!: string[][]
  @Prop({ default: '' }) label!: string

  activatePalette(index: number) {
    this.$emit('input', index)
  }

  generatePaletteItem(colors: string[], index: number) {
    const buildColor = (color: string) => <div class="palette-block-color" style={ `background-color: ${color}` }/>
    const classes = `palette-block ${index === this.value ? 'active' : ''}`

    return <div onClick={ () => this.activatePalette(index) } class={ classes }> { colors.map(buildColor) } </div>
  }

  generatePaletteItems() {
    return this.values.map(this.generatePaletteItem)
  }

  render() {
    return <div class="palette-blocks">
      { this.generatePaletteItems() }
    </div>
  }
}
