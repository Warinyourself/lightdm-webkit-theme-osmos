import {
  Module,
  VuexModule,
  getModule,
  Mutation,
  Action
} from 'vuex-module-decorators'
import store from '@/store/index'
import { InteractiveBlock, InteractiveBlockIds, AppMenu, LoginPosition, AppMenuMain } from '@/models/page'
import { AppModule } from './app'

export interface PageState {
  menu: AppMenuMain | AppMenu;
  language: string;
  languages: string[];
  loginPosition: LoginPosition;
  activeBlocks: InteractiveBlock[];
  interactiveBlocks: InteractiveBlock[];
}

@Module({ dynamic: true, store, name: 'page' })
class Page extends VuexModule implements PageState {
  menu: AppMenuMain | AppMenu = {
    view: false,
    items: []
  }

  mainTabIndex = 0
  language = ''
  loginPosition: LoginPosition = 'center'
  languages: string[] = []
  activeBlocks: InteractiveBlock[] = []
  interactiveBlocks: InteractiveBlock[] = [
    {
      id: 'login',
      closeBeforeMount: ['settings']
    },
    {
      id: 'settings',
      closeBeforeMount: ['login'],
      openAfterDestroy: ['login']
    }
  ]

  get locale() {
    const localesMap: Record<string, string> = {
      en: 'en-US',
      ru: 'ru-RU',
      fr: 'fr-FR',
      de: 'de-DE',
      pl: 'pl-PL',
      es: 'es-ES'
    }

    return localesMap[this.language] || 'en-US'
  }

  get getBlock() {
    return (id: InteractiveBlockIds) => {
      return this.activeBlocks.find((activeBlock) => id === activeBlock.id)
    }
  }

  get isOpenBlock() {
    return (id: InteractiveBlockIds) => {
      return !!this.getBlock(id)
    }
  }

  get activeBlock(): InteractiveBlock | undefined {
    return this.activeBlocks.slice(-1)[0]
  }

  @Mutation
  SET_STATE_PAGE<S extends this, K extends keyof this>({ key, value }: { key: K; value: S[K] }) {
    this[key] = value
  }

  @Mutation
  OPEN_ACTIVE_BLOCK(id: InteractiveBlockIds) {
    const activeBlock = this.interactiveBlocks.find((block) => block.id === id)
    if (activeBlock) {
      this.activeBlocks.push(activeBlock)
    }
  }

  @Mutation
  CLOSE_ACTIVE_BLOCK(idBlock?: string) {
    const index = this.activeBlocks.findIndex(({ id }) => id === idBlock)

    if (index !== -1) {
      this.activeBlocks.splice(index, 1)
    } else if (!idBlock) {
      this.activeBlocks.pop()
    }
  }

  @Mutation
  CLOSE_ALL_ACTIVE_BLOCK() {
    this.activeBlocks = []
  }

  @Mutation
  ASSIGN_MENU(menu: Partial<AppMenu>) {
    this.menu = Object.assign(this.menu, menu)
  }

  @Action
  openTab({ type }: { type: 'settings' | 'themes' | 'custom' }) {
    const hasCustomCurrentTheme = AppModule.activeTheme?.settings?.length !== undefined
    let updatedTabIndex = this.mainTabIndex

    switch (type) {
      case 'settings': {
        updatedTabIndex = hasCustomCurrentTheme ? 2 : 1
        break
      }
      case 'custom': {
        updatedTabIndex = hasCustomCurrentTheme ? 1 : updatedTabIndex
        break
      }
      default: {
        updatedTabIndex = 0
      }
    }

    this.SET_STATE_PAGE({ key: 'mainTabIndex', value: updatedTabIndex })
  }

  @Action
  async openBlock(settings: { id: InteractiveBlockIds }) {
    settings = settings || {}
    const { id } = settings
    if (!id) { return }

    // Already active block
    if (this.activeBlocks.find((block) => block.id === id)) { return }

    const block = this.interactiveBlocks.find((block) => block.id === id)
    if (!block) { return }

    const closeBlocks = block.closeBeforeMount
    if (closeBlocks) {
      closeBlocks.forEach((id) => this.CLOSE_ACTIVE_BLOCK(id))
    }

    this.OPEN_ACTIVE_BLOCK(id)
  }

  @Action
  async closeBlock(settings?: { id?: InteractiveBlockIds }) {
    settings = settings || {}
    const lastIdActiveBlock = this.activeBlocks.slice(-1)[0].id
    const id = settings.id || lastIdActiveBlock
    if (!id) { return }

    const block = this.activeBlocks.find((block) => block.id === id)
    if (!block) { return }

    const openBlocks = block.openAfterDestroy
    if (openBlocks) {
      openBlocks.forEach((id) => this.OPEN_ACTIVE_BLOCK(id))
    }

    let needToClose = true
    if (block.callbackBeforeClose) {
      needToClose = block.callbackBeforeClose?.map(callback => callback()).reduce((a, b) => a && b, true)
    }

    if (needToClose) {
      this.CLOSE_ACTIVE_BLOCK(id)
    }
  }
}

export const PageModule = getModule(Page)
