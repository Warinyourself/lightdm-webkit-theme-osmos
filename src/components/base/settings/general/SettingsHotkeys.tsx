import { Component, Vue } from 'vue-property-decorator'
import { hotkeys, hotkeysType } from '@/utils/hotkeys'

@Component
export default class SettingsHotkeys extends Vue {
  buildHotKeyBlock({ keys, title }: hotkeysType) {
    return <div class="settings-hotkey">
      <p class="settings-hotkey-title"> { this.$t(title) }: </p>
      <div class="settings-hotkey-blocks">
        { keys.map((key) => <div class="settings-hotkey-block"> { key } </div>) }
      </div>
    </div>
  }

  render() {
    return <div class="hotkeys-section">
      <h2 class="title mb-3"> { this.$t('settings.keyboard.title') }: </h2>
      { hotkeys.map(this.buildHotKeyBlock) }
    </div>
  }
}
