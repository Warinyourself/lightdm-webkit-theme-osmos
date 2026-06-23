import type { AppTheme } from '@/models/app'
import { pxratio, randomButton, resetButton, buildInputSlider,
} from '@/utils/theme-inputs'

export const ZAPPY_SETTINGS: AppTheme = {
  name: 'Zappy',
  component: 'zappy',
  color: { background: '#000010' },
  settings: [
    pxratio(),
    buildInputSlider({ value: 5,   min: 0,   max: 15,  step: 0.1  }),
    buildInputSlider({ name: 'zoom',        value: 0.2, min: 0.05, max: 0.6,  step: 0.01 }),
    buildInputSlider({ name: 'color-shift', value: 0,   min: 0,    max: 6.28, step: 0.05 }),
    randomButton,
    resetButton
  ]
}
