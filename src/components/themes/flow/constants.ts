import type { AppTheme } from '@/models/app'
import { pxratio, hueSlider, brightnessSlider, randomButton, resetButton, buildInputSlider, buildInvertCheckbox,
} from '@/utils/theme-inputs'

export const FLOW_SETTINGS: AppTheme = {
  name: 'Flow',
  component: 'flow',
  color: { background: '#22233D' },
  settings: [
    pxratio(),
    hueSlider(),
    brightnessSlider(),
    buildInvertCheckbox(),
    buildInputSlider({ value: 10, max: 15 }),
    buildInputSlider({ value: 1, max: 2.8, min: 0.2, name: 'size' }),
    randomButton,
    resetButton
  ]
}
