import { Component, Vue } from 'vue-property-decorator'

import { AppModule } from '@/store/app'
import { AppInputButton, AppInputColor, AppInputThemeGeneral, AppInputThemePalette, AppInputThemeSelector, AppInputThemeSlider, AppTheme } from '@/models/app'

import AppSlider from '@/components/app/AppSlider'
import AppButton from '@/components/app/AppButton'
import AppCheckbox from '@/components/app/AppCheckbox'
import AppSelector from '@/components/app/AppSelector'
import AppColorSelector from '@/components/app/AppColorSelector'
import AppPaletteSelector from '@/components/app/AppPaletteSelector'
import { Debounce } from '@/utils/helper'
import { Route } from 'vue-router/types/router'

@Component({
  components: {
    AppSlider,
    AppButton,
    AppSelector,
    AppColorSelector,
    AppPaletteSelector
  }
})
export default class SettingsCustom extends Vue {
  syncThemeWithQuery = true

  get theme() {
    return AppModule.activeTheme as AppTheme
  }

  get inputs() {
    return this.theme.settings || []
  }

  @Debounce()
  updateQuery() {
    if (this.syncThemeWithQuery) {
      AppModule.syncStoreWithQuery()
    }
  }

  buildSlider(input: AppInputThemeSlider) {
    const { label, value, options: { step, min: from, max: to, changeOnUpdate } } = input
    const props = { to, step, from, label, value, changeOnUpdate }
    const handler = (value: number) => {
      AppModule.changeSettingsThemeInput({ key: input.name, value })

      if (input.callback) {
        input.callback(value)
      }
    }

    return <AppSlider {...{ props, on: { input: handler } } } />
  }

  buildSelector(input: AppInputThemeSelector) {
    const { label, value, values } = input
    const props = { label, value, items: values }
    const handler = (value: number) => {
      AppModule.changeSettingsThemeInput({ key: input.name, value })
    }

    return <AppSelector {...{ props, on: { input: handler } } } />
  }

  buildColor(input: AppInputThemeGeneral) {
    const { label, value, options } = input
    const props = { label, value }
    const handler = (color: AppInputColor) => {
      AppModule.changeSettingsThemeInput({ key: input.name, value: color.hex })

      if (input.callback) {
        input.callback(color.hex)
      }
    }

    return <AppColorSelector {...{ props, class: options?.class, on: { input: handler } } } />
  }

  buildCheckbox(input: AppInputThemeGeneral) {
    const { label, value } = input
    const props = { label: this.$t(label), value }
    const handler = (value: boolean) => {
      AppModule.changeSettingsThemeInput({ key: input.name, value })

      if (input.callback) {
        input.callback(value)
      }
    }

    return <AppCheckbox {...{ props, on: { input: handler } } }/>
  }

  buildPalette(input: AppInputThemePalette) {
    const { label, value, values } = input
    const props = { label, value, values }
    const handler = (value: boolean) => {
      AppModule.changeSettingsThemeInput({ key: input.name, value })
    }

    return <AppPaletteSelector {...{ props, on: { input: handler } } } />
  }

  buildButton(input: AppInputButton) {
    return <AppButton onClick={ input.callback }> { this.$t(input.label) } </AppButton>
  }

  buildUnknown(input: AppInputThemeGeneral) {
    return <div> Doesn't exist input - { input.type } </div>
  }

  updated() {
    this.updateQuery()
  }

  render() {
    const builderObject = {
      color: this.buildColor,
      slider: this.buildSlider,
      checkbox: this.buildCheckbox,
      palette: this.buildPalette,
      button: this.buildButton,
      selector: this.buildSelector
    }

    return <div class='user-settings-custom'>
      { this.inputs.map((input) => (builderObject[input.type] || this.buildUnknown)(input as any)) }
    </div>
  }
}
