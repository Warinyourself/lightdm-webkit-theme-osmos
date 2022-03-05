import { Component, Vue } from 'vue-property-decorator'

import { AppModule } from '@/store/app'
import AppIcon from '@/components/app/AppIcon.vue'
import AppButton from '@/components/app/AppButton'
import SettingsUsers from './SettingsUsers'
import SettingsHotkeys from './SettingsHotkeys'
import SettingsCheckboxes from './SettingsCheckboxes'
import SettingsSelectors from './SettingsSelectors'

@Component({
  components: {
    AppIcon,
    SettingsUsers,
    SettingsHotkeys,
    SettingsSelectors,
    SettingsCheckboxes
  }
})
export default class SettingsGeneral extends Vue {
  get showFrameRate() {
    return AppModule.showFrameRate
  }

  get isViewThemeOnly() {
    return AppModule.viewThemeOnly
  }

  resetSettings() {
    localStorage.clear()
    AppModule.setUpSettings()

    const hasQyery = Object.keys(this.$route.query).length
    if (hasQyery) { this.$router.replace({}) }
  }

  render() {
    return <div class='user-settings-general'>
      <SettingsCheckboxes />
      <SettingsSelectors />

      { !this.isViewThemeOnly && <SettingsUsers /> }
      <SettingsHotkeys />

      <div class="help-block">
        <AppButton onClick={ this.resetSettings } block>
          { this.$t('settings.reset-settings') }
        </AppButton>
      </div>
    </div>
  }
}
