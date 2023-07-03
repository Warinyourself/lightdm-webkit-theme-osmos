import AppIcon from '@/components/app/AppIcon.vue'
import { defineComponent, ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { usePageStore } from '@/store/page'
import { useAppStore } from '@/store/app'
import type { AppMenuItem, AppMenuPosition } from '@/models/page'

export default defineComponent({
  name: 'AppMenu',

  setup() {
    const pageStore = usePageStore()
    const appStore = useAppStore()
    const menuRef = ref<HTMLElement | null>(null)
    const innerPositioned = ref<AppMenuPosition>({ left: 0, top: 0, width: 199 })

    const position = computed(() => (pageStore.menu as any).position ?? innerPositioned.value)

    const style = computed(() =>
      Object.entries(position.value)
        .map(([prop, val]) => `${prop}: ${val}px`)
        .join(';')
    )

    const calculatePosition = () => {
      const node = (pageStore.menu as any).node as HTMLElement | undefined
      if (!node || !pageStore.menu.view) return

      const { bottom, left, top, height, width } = node.getBoundingClientRect()
      const { zoom } = appStore
      const pos: AppMenuPosition = { left: left * zoom, width: width * zoom }

      if (bottom > top) {
        pos.top = (top + height) * zoom
      } else {
        pos.bottom = (window.innerHeight - bottom + height) * zoom
      }

      innerPositioned.value = pos
    }

    const closeMenu = () => pageStore.assignMenu({ view: false })

    const handleClickOutside = (event: MouseEvent) => {
      if (!pageStore.menu.view) return
      const clickOnMenu = menuRef.value?.contains(event.target as Node)
      if (!clickOnMenu) closeMenu()
    }

    const handleResize = () => calculatePosition()

    watch(() => pageStore.menu.view, (isOpen) => {
      if (isOpen) calculatePosition()
    })

    onMounted(() => {
      window.addEventListener('resize', handleResize, { passive: true })
      window.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('click', handleClickOutside)
    })

    const buildItem = (item: AppMenuItem | string, index: number) => {
      const isStr = typeof item === 'string'
      const { text, icon } = isStr ? { text: item, icon: null } : (item as AppMenuItem)
      return (
        <li
          class="menu-list-item"
          key={index}
          onClick={async (event) => {
            if ((pageStore.menu as any).handler) {
              await (pageStore.menu as any).handler(item)
            }
            closeMenu()
          }}
        >
          {text}
          {icon && <AppIcon class="menu-icon" name={icon} />}
        </li>
      )
    }

    return () => (
      <div class="menu-wrapper" ref={menuRef}>
        <transition name="fade-menu">
          {pageStore.menu.view && (
            <ul class="menu-list active-block" id="menu" style={style.value}>
              {pageStore.menu.items.map(buildItem)}
            </ul>
          )}
        </transition>
      </div>
    )
  }
})
