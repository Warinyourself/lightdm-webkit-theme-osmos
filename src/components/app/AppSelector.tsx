import { Component, Prop, Vue } from 'vue-property-decorator'

import { PageModule } from '@/store/page'
import AppIcon from '@/components/app/AppIcon.vue'
import { AppMenuItem } from '@/models/page'

export interface AppSelectorProps {
  value: AppMenuItem | string | undefined;
  items: AppMenuItem[];
  label: string;
}
@Component({
  components: { AppIcon }
})
export default class AppSelector extends Vue implements AppSelectorProps {
  @Prop({ type: [Object, String], default: undefined }) value!: AppMenuItem | string | undefined
  @Prop({ type: [Array], default: () => [] }) items!: AppMenuItem[]
  @Prop({ default: '' }) label!: string

  selectedValue: null | AppMenuItem | string = null

  get fullSelectedItem() {
    const selected = this.value !== null ? this.value : this.selectedValue
    const finalSelectedValue = typeof selected === 'object' ? selected?.value : selected

    return this.items.find((item) => {
      const finalValue = typeof item === 'object' ? item?.value : item
      return finalValue === finalSelectedValue
    })
  }

  get menu() {
    return PageModule.menu
  }

  get isActive() {
    return this.menu?.view && this.menu?.node === this.$refs.selector
  }

  get currentValueLabel() {
    const selected = this.fullSelectedItem ?? this.selectedValue
    return typeof selected === 'object' ? selected?.text : selected
  }

  openSelector(event: Event) {
    event.preventDefault()
    event.stopPropagation()

    if (this.menu.view) {
      return PageModule.ASSIGN_MENU({ view: false })
    }

    PageModule.ASSIGN_MENU({
      node: this.$refs.selector as HTMLElement,
      view: true,
      items: this.items,
      handler: this.callback
    })
  }

  callback(item: AppMenuItem | string) {
    const finalValue = typeof item === 'object' ? item.value : item

    this.selectedValue = item
    this.$emit('input', finalValue)
  }

  render() {
    const selectorIcon = this.fullSelectedItem?.icon ? <AppIcon {...{
      class: 'menu-icon selector-icon',
      props: {
        name: this.fullSelectedItem.icon
      }
    }}/> : null

    return <div
      onClick={ this.openSelector }
      ref="selector"
      class={['selector', this.isActive ? 'active' : '']}
    >
      <h2 class='selector-label'>
        { selectorIcon }
        <p class="selector-label-text">
          { this.currentValueLabel || this.label }
        </p>
      </h2>
      <AppIcon name='arrow' class='icon selector-arrow' />
    </div>
  }
}
