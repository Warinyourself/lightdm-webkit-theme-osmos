import { Component, Vue } from 'vue-property-decorator'

import { AppModule } from '@/store/app'

@Component
export default class SettingsThemes extends Vue {
  get themes() {
    return AppModule.themes
  }

  get activeTheme() {
    return AppModule.activeTheme
  }

  setImage(name: string) {
    let url

    try {
      url = require(`@/assets/images/themes/${name}/index.png`)
    } catch {
      url = 'notFound'
    }

    return url
  }

  render() {
    return <div class='user-settings-themes'>
      {
        this.themes.map(theme => {
          const isActiveTheme = theme.name === this.activeTheme.name

          return <div
            class={`user-settings-theme ${isActiveTheme ? 'active' : ''}`}
            onClick={() => AppModule.changeTheme(theme.name)}
            style={`background: url(${this.setImage(theme.name.toLowerCase())}) no-repeat center/cover`}
          />
        })
      }
    </div>
  }
}
