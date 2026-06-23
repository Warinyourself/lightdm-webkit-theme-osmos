import type { AppTheme } from '@/models/app'
import { pxratio, hueSlider, randomButton, resetButton, buildInputSlider,
} from '@/utils/theme-inputs'

export const PLASMA_SETTINGS: AppTheme = {
  name: 'Plasma',
  component: 'plasma',
  color: { background: '#22233D' },
  settings: [
    pxratio(),
    hueSlider(),
    buildInputSlider({ value: 10, max: 25 }),
    randomButton,
    resetButton
  ]
}
