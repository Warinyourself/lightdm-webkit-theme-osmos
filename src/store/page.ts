import { defineStore } from 'pinia'
import { useAppStore } from '@/store/app'
import type { InteractiveBlock, InteractiveBlockIds, AppMenu, LoginPosition, AppMenuMain, DialogInterface } from '@/models/page'

export const usePageStore = defineStore('page', {
  state: () => ({
    menu: {
      view: false,
      items: []
    } as AppMenuMain | AppMenu,

    dialog: null as DialogInterface | null,

    mainTabIndex: 0,
    language: '',
    loginPosition: 'center' as LoginPosition,
    languages: [] as string[],
    activeBlocks: [] as InteractiveBlock[],
    interactiveBlocks: [
      {
        id: 'login',
        closeBeforeMount: ['settings'],
        mayOpen: () => !useAppStore().viewThemeOnly
      },
      {
        id: 'settings',
        closeBeforeMount: ['login'],
        openAfterDestroy: ['login']
      }
    ] as InteractiveBlock[]
  }),

  getters: {
    locale: (state): string => {
      const localesMap: Record<string, string> = {
        ru: 'ru-RU',
        en: 'en-US',
        fr: 'fr-FR',
        de: 'de-DE',
        es: 'es-ES'
      }
      return localesMap[state.language] || 'en-US'
    },

    getBlock: (state) => (id: InteractiveBlockIds) =>
      state.activeBlocks.find((b) => b.id === id),

    isOpenBlock: (state) => (id: InteractiveBlockIds) =>
      !!state.activeBlocks.find((b) => b.id === id),

    activeBlock: (state): InteractiveBlock | undefined =>
      state.activeBlocks[state.activeBlocks.length - 1]
  },

  actions: {
    openFirstBlock() {
      for (const block of this.interactiveBlocks) {
        const canOpen = block.mayOpen ? block.mayOpen() : true
        if (canOpen) {
          this.openActiveBlock(block.id)
          break
        }
      }
    },

    openActiveBlock(id: InteractiveBlockIds) {
      const activeBlock = this.interactiveBlocks.find((b) => b.id === id)
      if (!activeBlock) return

      const canOpen = activeBlock.mayOpen ? activeBlock.mayOpen() : true
      if (!canOpen) return

      this.activeBlocks.push(activeBlock)
    },

    closeActiveBlock(idBlock?: string) {
      const index = this.activeBlocks.findIndex(({ id }) => id === idBlock)
      if (index !== -1) {
        this.activeBlocks.splice(index, 1)
      } else if (!idBlock) {
        this.activeBlocks.pop()
      }
    },

    closeAllBlocks() {
      this.activeBlocks = []
    },

    assignMenu(menu: Partial<AppMenu>) {
      this.menu = Object.assign(this.menu, menu)
    },

    openTab({ type }: { type: 'settings' | 'themes' | 'custom' }) {
      const hasCustomCurrentTheme = useAppStore().activeTheme?.settings?.length !== undefined
      let updatedTabIndex = this.mainTabIndex

      switch (type) {
        case 'settings':
          updatedTabIndex = hasCustomCurrentTheme ? 2 : 1
          break
        case 'custom':
          updatedTabIndex = hasCustomCurrentTheme ? 1 : updatedTabIndex
          break
        default:
          updatedTabIndex = 0
      }

      this.mainTabIndex = updatedTabIndex
    },

    async openBlock(settings: { id: InteractiveBlockIds }) {
      const { id } = settings || {}
      if (!id) return

      if (this.activeBlocks.find((b) => b.id === id)) return

      const block = this.interactiveBlocks.find((b) => b.id === id)
      if (!block) return

      block.closeBeforeMount?.forEach((bid) => this.closeActiveBlock(bid))
      this.openActiveBlock(id)
    },

    async closeBlock(settings?: { id?: InteractiveBlockIds }) {
      const lastId = this.activeBlocks[this.activeBlocks.length - 1]?.id
      const id = settings?.id || lastId
      if (!id) return

      const block = this.activeBlocks.find((b) => b.id === id)
      if (!block) return

      block.openAfterDestroy?.forEach((bid) => this.openActiveBlock(bid))

      let needToClose = true
      if (block.callbackBeforeClose) {
        needToClose = block.callbackBeforeClose.map((cb) => cb()).every(Boolean)
      }

      if (needToClose) this.closeActiveBlock(id)
    },

    openDialog(dialog: DialogInterface) {
      this.dialog = dialog
    },

    closeDialog() {
      this.dialog = null
    }
  }
})
