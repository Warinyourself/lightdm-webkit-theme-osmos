import { defineComponent, computed, type VNode } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/store/theme'
import AppSlider from '@/components/app/AppSlider'
import AppButton from '@/components/app/AppButton'
import AppSwitch from '@/components/app/AppSwitch'
import AppSelector from '@/components/app/AppSelector'
import AppColorSelector from '@/components/app/AppColorSelector'
import AppPaletteSelector from '@/components/app/AppPaletteSelector'
import type {
  AppInputButton,
  AppInputThemeGeneral,
  AppInputThemePalette,
  AppInputThemeSelector,
  AppInputThemeSlider
} from '@/models/app'

export default defineComponent({
  name: 'SettingsCustom',
  setup() {
    const themeStore = useThemeStore()
    const { t } = useI18n()

    const inputs = computed(() => themeStore.activeTheme?.settings || [])

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
            themeStore.changeSettingsThemeInput({ key: input.name, value: v })
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
            themeStore.changeSettingsThemeInput({ key: input.name, value: v })
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
          onUpdate:modelValue={(color: string) => {
            themeStore.changeSettingsThemeInput({ key: input.name, value: color })
            input.callback?.(color)
          }}
        />
      )
    }

    const buildCheckbox = (input: AppInputThemeGeneral) => {
      const { label, value } = input
      return (
        <AppSwitch
          label={t(label)}
          modelValue={value as boolean}
          onUpdate:modelValue={(v: boolean) => {
            themeStore.changeSettingsThemeInput({ key: input.name, value: v })
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
            themeStore.changeSettingsThemeInput({ key: input.name, value: v })
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
