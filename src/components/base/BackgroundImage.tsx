import { Component, Vue } from 'vue-property-decorator'
import { CreateElement } from 'vue/types/umd'

import { AppModule } from '@/store/app'
import { PageModule } from '@/store/page'
import { AppTheme } from '@/models/app'

const components: { [k: string]: Vue } = {}

const requireComponent = require.context(
  '@/components/themes', true, /\.(vue|tsx)$/
)

requireComponent.keys().forEach(fileName => {
  let componentName = fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
  const isInFolder = componentName.includes('/')

  if (isInFolder) {
    componentName = componentName.split('/')[0]
  }

  const componentConfig = requireComponent(fileName)
  components[componentName] = componentConfig.default || componentConfig
})

@Component({ components })
export default class BackgroundImage extends Vue {
  get theme(): AppTheme {
    return AppModule.activeTheme
  }

  get isOpenLogin(): boolean {
    return PageModule.isOpenBlock('login')
  }

  render(h: CreateElement): JSX.Element {
    const body = h(components[this.theme.component ?? 'random'])

    return <div class='background-image'>
      <div class="mask-background"></div>
      { body }
    </div>
  }
}
