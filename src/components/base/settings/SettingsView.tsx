import { Component, Vue } from 'vue-property-decorator'

import { AppModule } from '@/store/app'
import AppIcon from '@/components/app/AppIcon.vue'
import SettingsThemes from '@/components/base/settings/SettingsThemes'
import SettingsCustom from '@/components/base/settings/SettingsCustom'
import SettingsGeneral from '@/components/base/settings/general/SettingsGeneral'
import { PageModule } from '@/store/page'

@Component({
  components: {
    AppIcon,
    SettingsThemes,
    SettingsCustom,
    SettingsGeneral
  }
})
export default class SettingsView extends Vue {
  get mainTabIndex() {
    return PageModule.mainTabIndex
  }

  get user() {
    return AppModule.currentUser
  }

  get users() {
    return AppModule.users
  }

  render() {
    const mapTabs = [<SettingsThemes />, <SettingsGeneral />]
    const hasThemeSettings = AppModule.activeTheme?.settings?.length

    if (hasThemeSettings) {
      mapTabs.splice(1, 0, <SettingsCustom />)
    }

    const activeTab = <div key={this.mainTabIndex}> { mapTabs[this.mainTabIndex] } </div>

    return <div class='user-settings'>
      <keep-alive>
        { activeTab }
      </keep-alive>
    </div>
  }
}
