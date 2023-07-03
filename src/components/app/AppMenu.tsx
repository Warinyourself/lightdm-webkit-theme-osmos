import { Component, Vue, Watch } from 'vue-property-decorator'
import { PageModule } from '@/store/page'
import AppIcon from '@/components/app/AppIcon.vue'
import { AppMenuItem, AppMenuPosition } from '@/models/page'
import { AppModule } from '@/store/app'

@Component({
  components: { AppIcon }
})
export default class AppMenu extends Vue {
  innerPositioned: AppMenuPosition = { left: 0, top: 0, width: 199 }

  get position() {
    return this.menu.position ?? this.innerPositioned
  }

  get menu() {
    return PageModule.menu
  }

  get isShow() {
    return this.menu.view
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

  async handleCallback(event: MouseEvent, item: AppMenuItem | string) {
    if (this.menu.handler) {
      await this.menu.handler(item)
    }

    this.closeMenu()
  }

  handleClickOutside(event: MouseEvent) {
    if (!this.isShow) return false

    const clickOnMenu = this.$el.contains(event.target as Node)
    !clickOnMenu && this.closeMenu()
  }

  mounted() {
    window.addEventListener('resize', this.handleResize, { passive: true })
    window.addEventListener('click', this.handleClickOutside)
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('click', this.handleClickOutside)
  }

  handleResize() {
    this.calculatePosition()
  }

  calculatePosition() {
    const node = this.menu.node
    const { zoom } = AppModule

    if (!node || !this.menu.view) return

    const { bottom, left, top, height, width } = node.getBoundingClientRect()
    const allHeight = window.innerHeight

    const positionY = bottom > top ? 'bottom' : 'top'
    const position: AppMenuPosition = {
      left: left * zoom, 
      width: width * zoom
    }

    if (positionY === 'bottom') {
      position.top = (top + height) * zoom
    } else {
      position.bottom = (allHeight - bottom + height) * zoom
    }

    this.innerPositioned = position
  }

  closeMenu() {
    PageModule.ASSIGN_MENU({ view: false })
  }

  buildElementItem(item: AppMenuItem | string, index: number) {
    const isSting = typeof item === 'string'
    const { text, icon } = isSting ? { text: item, icon: null } : item
    return <li
      class='menu-list-item'
      key={index}
      onClick={(event) => { this.handleCallback(event, item) }}
    >
      { text }
      { icon && <AppIcon class='menu-icon' name={icon} /> }
    </li>
  }

  render() {
    return <div class='menu-wrapper' ref='menu'>
      <transition name='fade-menu'>
        { this.menu.view && <ul class='menu-list active-block' id='menu' style={ this.style }>
          { this.menu.items.map(this.buildElementItem) }
        </ul>
        }
      </transition>
    </div>
  }
}
