import { defineComponent, computed, onUpdated, type VNode } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/app'
import AppSlider from '@/components/app/AppSlider'
import AppButton from '@/components/app/AppButton'
import AppCheckbox from '@/components/app/AppCheckbox'
import AppSelector from '@/components/app/AppSelector'
import AppColorSelector from '@/components/app/AppColorSelector'
import AppPaletteSelector from '@/components/app/AppPaletteSelector'
import { createDebounce } from '@/utils/helper'
import type {
  AppInputButton,
  AppInputColor,
  AppInputThemeGeneral,
  AppInputThemePalette,
  AppInputThemeSelector,
  AppInputThemeSlider
} from '@/models/app'

export default defineComponent({
  name: 'SettingsCustom',
  setup() {
    const appStore = useAppStore()
    const { t } = useI18n()

    const inputs = computed(() => appStore.activeTheme?.settings || [])
    const debouncedSync = createDebounce(() => appStore.syncStoreWithQuery(), 300)

    onUpdated(() => debouncedSync())

    const buildSlider = (input: AppInputThemeSlider) => {
      const { label, value, options: { step, min: from, max: to } } = input
      return (
        <AppSlider
          to={to}
          step={step}
          from={from}
          label={label}
          modelValue={value as number}
          onUpdate:modelValue={(v: number) => {
            appStore.changeSettingsThemeInput({ key: input.name, value: v })
            input.callback?.(v)
          }}
        />
      )
    }

    const buildSelector = (input: AppInputThemeSelector) => {
      const { label, value, values } = input
      return (
        <AppSelector
          label={label}
          items={[...values]}
          modelValue={value as string}
          onUpdate:modelValue={(v: string) => {
            appStore.changeSettingsThemeInput({ key: input.name, value: v })
          }}
        />
      )
    }

    const buildColor = (input: AppInputThemeGeneral) => {
      const { label, value, options } = input
      return (
        <AppColorSelector
          class={options?.class}
          label={label}
          modelValue={value as string}
          onUpdate:modelValue={(color: AppInputColor) => {
            appStore.changeSettingsThemeInput({ key: input.name, value: color.hex })
            input.callback?.(color.hex)
          }}
        />
      )
    }

    const buildCheckbox = (input: AppInputThemeGeneral) => {
      const { label, value } = input
      return (
        <AppCheckbox
          label={t(label)}
          modelValue={value as boolean}
          onUpdate:modelValue={(v: boolean) => {
            appStore.changeSettingsThemeInput({ key: input.name, value: v })
            input.callback?.(v)
          }}
        />
      )
    }

    const buildPalette = (input: AppInputThemePalette) => {
      const { label, value, values } = input
      return (
        <AppPaletteSelector
          label={label}
          modelValue={value as number}
          values={values}
          onUpdate:modelValue={(v: number) => {
            appStore.changeSettingsThemeInput({ key: input.name, value: v })
          }}
        />
      )
    }

    const buildButton = (input: AppInputButton) => (
      <AppButton onClick={input.callback}>{t(input.label)}</AppButton>
    )

    const buildUnknown = (input: AppInputThemeGeneral) => (
      <div>Doesn't exist input - {input.type}</div>
    )

    const builderObject: Record<string, (input: any) => VNode> = {
      color: buildColor,
      slider: buildSlider,
      checkbox: buildCheckbox,
      palette: buildPalette,
      button: buildButton,
      selector: buildSelector
    }

    return () => (
      <div class="user-settings-custom">
        {inputs.value.map((input) => (builderObject[input.type] || buildUnknown)(input))}
      </div>
    )
  }
})
