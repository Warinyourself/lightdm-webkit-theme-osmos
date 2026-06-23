import type { AppTheme } from '@/models/app'
import { pxratio, randomButton, resetButton, buildInputSlider,
} from '@/utils/theme-inputs'

export const RINGS_SETTINGS: AppTheme = {
  name: 'Rings',
  component: 'rings',
  color: { background: '#22233D' },
  settings: [
    pxratio(),
    buildInputSlider(),
    buildInputSlider({ name: 'hue',  value: 0,  icon: 'hue',  max: 0.5, min: -0.5 }),
    buildInputSlider({ name: 'zoom', value: 32, icon: 'zoom', max: 100, min: 2     }),
    randomButton,
    resetButton
  ]
}
