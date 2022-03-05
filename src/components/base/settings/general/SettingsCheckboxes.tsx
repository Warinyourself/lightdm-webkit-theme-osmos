import { Component, Vue } from 'vue-property-decorator'
import AppCheckbox from '@/components/app/AppCheckbox'
import { AppModule } from '@/store/app'

@Component({
  components: {
    AppCheckbox
  }
})
export default class SettingsCheckboxes extends Vue {
  get bodyClass() {
    return AppModule.bodyClass
  }

  buildCheckbox(name: string) {
    return <AppCheckbox
      label={ this.$t(`settings.${name}`) }
      value={ this.bodyClass[name] }
      onInput={ (value: boolean) => {
        AppModule.CHANGE_BODY_CLASS({ key: name, value })
        AppModule.syncStoreWithQuery()
      }}
    />
  }

  render() {
    return <div class="grid-two">
      <h2 class="title"> { this.$t('settings.performance') } </h2>
      { this.buildCheckbox('blur') }
      { this.buildCheckbox('show-framerate') }
      { this.buildCheckbox('no-transition') }
      { this.buildCheckbox('only-ui') }
    </div>
  }
}
