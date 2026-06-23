import type { AppTheme } from '@/models/app'
import { pxratio, hueSlider, brightnessSlider, randomButton, resetButton, buildInputSlider, buildInvertCheckbox,
} from '@/utils/theme-inputs'

export const SPHERE_SETTINGS: AppTheme = {
  name: 'Sphere',
  component: 'sphere',
  color: { background: '#22233D' },
  settings: [
    pxratio(),
    buildInvertCheckbox(),
    hueSlider(),
    brightnessSlider(),
    buildInputSlider({ max: 10 }),
    buildInputSlider({ value: 2, max: 3, min: 1.4, name: 'size' }),
    randomButton,
    resetButton
  ]
}
