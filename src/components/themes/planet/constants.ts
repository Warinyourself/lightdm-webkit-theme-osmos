import type { AppTheme } from '@/models/app'
import { pxratio, randomButton, resetButton, buildInputSlider,
} from '@/utils/theme-inputs'

export const PLANET_SETTINGS: AppTheme = {
  name: 'Planet',
  component: 'planet',
  color: { background: '#22233D' },
  settings: [
    pxratio(),
    buildInputSlider(),
    buildInputSlider({ name: 'position', value: 3.9, icon: 'position', step: 0.01, max: 20, min: 2.8 }),
    randomButton,
    resetButton
  ]
}
