import type { AppTheme } from '@/models/app'
import { pxratio, hueSlider, brightnessSlider, randomButton, resetButton, buildInputSlider, buildInvertCheckbox,
} from '@/utils/theme-inputs'

export const RANDOM_SETTINGS: AppTheme = {
  name: 'Random',
  component: 'random',
  color: { background: '#19102e' },
  settings: [
    pxratio(),
    buildInputSlider({ min: 0.2 }),
    buildInputSlider({ name: 'symmetry',  min: 0.01, max: 2,   value: 0.1 }),
    buildInputSlider({ name: 'thickness', min: 0.01, max: 0.7, value: 0.1 }),
    hueSlider(),
    brightnessSlider(),
    buildInvertCheckbox(),
    randomButton,
    resetButton
  ]
}
