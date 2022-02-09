import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { PageModule } from '@/store/page'
import AppIcon from '@/components/app/AppIcon.vue'
import { AppMenuItem, AppMenuPosition } from '@/models/page'

@Component({
  components: { AppIcon }
})
export default class AppMenu extends Vue {
  isActive = false
  innerPositioned: AppMenuPosition = { left: 0, top: 0, width: 199 }

  get position() {
    return this.menu.position ?? this.innerPositioned
  }

  get menu() {
    const menu = PageModule.menu
    return menu
  }

  @Watch('menu.view')
  updatePosition(isOpen: boolean) {
    if (isOpen) {
      this.calculatePosition()
    }
  }

  get style() {
    return Object.entries(this.position).reduce((acc, [property, value]) => {
      acc += `${property}: ${value}px;`
      return acc
    }, '')
  }

  get menuNode() {
    return this.$refs.menu as Element
  }

  async handleCallback(item: AppMenuItem | string) {
    if (this.menu.handler) {
      await this.menu.handler(item)
    }

    this.closeMenu()
  }

  mounted() {
    window.addEventListener('resize', this.handleResize, { passive: true })
    this.menuNode && this.menuNode.addEventListener('mousedown', this.stopPreventEvent, { passive: true })
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    this.menuNode && this.menuNode.removeEventListener('mousedown', this.stopPreventEvent)
  }

  handleResize() {
    this.calculatePosition()
  }

  calculatePosition() {
    const node = this.menu.node

    if (!node || !this.menu.view) return

    const { bottom, left, top, height, width } = node.getBoundingClientRect()
    const allHeight = window.innerHeight

    const positionY = bottom > top ? 'bottom' : 'top'
    const position: AppMenuPosition = { left, width }

    if (positionY === 'bottom') {
      position.top = top + height
    } else {
      position.bottom = allHeight - bottom + height
    }

    this.innerPositioned = position
  }

  closeMenu() {
    PageModule.ASSIGN_MENU({ view: false })
  }

  stopPreventEvent(event: Event) {
    event.stopPropagation()
    event.preventDefault()
  }

  buildElementItem(item: AppMenuItem, index: number) {
    return <li
      class='menu-list-item'
      key={index}
      onClick={() => { this.handleCallback(item) }}
    >
      { item.text }
      { item.icon && <AppIcon class='menu-icon' name={item.icon} /> }
    </li>
  }

  render() {
    return <div onClick={ this.stopPreventEvent } class='menu-wrapper' ref='menu'>
      <transition name='fade-menu'>
        { this.menu.view && <ul class='menu-list' id='menu' style={ this.style }>
          { this.menu.items.map(this.buildElementItem) }
        </ul>
        }
      </transition>
    </div>
  }
}
