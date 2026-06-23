import type { AppTheme } from '@/models/app'
import { pxratio, randomButton, resetButton, buildInputSlider,
} from '@/utils/theme-inputs'

export const TENDERNESS_SETTINGS: AppTheme = {
  name: 'Tenderness',
  component: 'tenderness',
  color: { background: '#22233D' },
  settings: [
    pxratio(),
    buildInputSlider({ value: 10, max: 15 }),
    randomButton,
    resetButton
  ]
}
