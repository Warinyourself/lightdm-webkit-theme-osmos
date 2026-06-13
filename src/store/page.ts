import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAppStore } from '@/store/app'
import { useThemeStore } from '@/store/theme'
import type { InteractiveBlock, InteractiveBlockIds, AppMenu, AppMenuMain, DialogInterface } from '@/models/page'

export const usePageStore = defineStore('page', () => {
  const menu = ref<AppMenuMain | AppMenu>({ view: false, items: [] })
  const dialog = ref<DialogInterface | null>(null)

  const mainTabIndex = ref(0)
  const language = ref('')
  const languages = ref<string[]>([])
  const activeBlocks = ref<InteractiveBlock[]>([])
  const interactiveBlocks = ref<InteractiveBlock[]>([
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
  ])

  const locale = computed((): string => {
    const localesMap: Record<string, string> = {
      ru: 'ru-RU',
      en: 'en-US',
      fr: 'fr-FR',
      de: 'de-DE',
      es: 'es-ES'
    }
    return localesMap[language.value] || 'en-US'
  })

  const getBlock = (id: InteractiveBlockIds) => activeBlocks.value.find((b) => b.id === id)

  const isOpenBlock = (id: InteractiveBlockIds) => !!activeBlocks.value.find((b) => b.id === id)

  const activeBlock = computed((): InteractiveBlock | undefined =>
    activeBlocks.value[activeBlocks.value.length - 1])

  function openFirstBlock() {
    for (const block of interactiveBlocks.value) {
      const canOpen = block.mayOpen ? block.mayOpen() : true
      if (canOpen) {
        openActiveBlock(block.id)
        break
      }
    }
  }

  function openActiveBlock(id: InteractiveBlockIds) {
    const block = interactiveBlocks.value.find((b) => b.id === id)
    if (!block) return

    const canOpen = block.mayOpen ? block.mayOpen() : true
    if (!canOpen) return

    activeBlocks.value.push(block)
  }

  function closeActiveBlock(idBlock?: string) {
    const index = activeBlocks.value.findIndex(({ id }) => id === idBlock)
    if (index !== -1) {
      activeBlocks.value.splice(index, 1)
    } else if (!idBlock) {
      activeBlocks.value.pop()
    }
  }

  function closeAllBlocks() {
    activeBlocks.value = []
  }

  function assignMenu(partialMenu: Partial<AppMenu>) {
    menu.value = Object.assign(menu.value, partialMenu)
  }

  function openTab({ type }: { type: 'settings' | 'themes' | 'custom' }) {
    const hasCustomCurrentTheme = useThemeStore().activeTheme?.settings?.length !== undefined
    let updatedTabIndex = mainTabIndex.value

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

    mainTabIndex.value = updatedTabIndex
  }

  async function openBlock(settings: { id: InteractiveBlockIds }) {
    const { id } = settings || {}
    if (!id) return

    if (activeBlocks.value.find((b) => b.id === id)) return

    const block = interactiveBlocks.value.find((b) => b.id === id)
    if (!block) return

    block.closeBeforeMount?.forEach((bid) => closeActiveBlock(bid))
    openActiveBlock(id)
  }

  async function closeBlock(settings?: { id?: InteractiveBlockIds }) {
    const lastId = activeBlocks.value[activeBlocks.value.length - 1]?.id
    const id = settings?.id || lastId
    if (!id) return

    const block = activeBlocks.value.find((b) => b.id === id)
    if (!block) return

    block.openAfterDestroy?.forEach((bid) => openActiveBlock(bid))

    let needToClose = true
    if (block.callbackBeforeClose) {
      needToClose = block.callbackBeforeClose.map((cb) => cb()).every(Boolean)
    }

    if (needToClose) closeActiveBlock(id)
  }

  function openDialog(newDialog: DialogInterface) {
    dialog.value = newDialog
  }

  function closeDialog() {
    dialog.value = null
  }

  return {
    menu,
    dialog,
    mainTabIndex,
    language,
    languages,
    activeBlocks,
    interactiveBlocks,
    locale,
    getBlock,
    isOpenBlock,
    activeBlock,
    openFirstBlock,
    openActiveBlock,
    closeActiveBlock,
    closeAllBlocks,
    assignMenu,
    openTab,
    openBlock,
    closeBlock,
    openDialog,
    closeDialog
  }
})
