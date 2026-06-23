import type { AppTheme } from '@/models/app'
import { pxratio, randomButton, resetButton, buildInputSlider } from '@/utils/theme-inputs'

export const DESTRUCTION_SETTINGS: AppTheme = {
  name: 'Destruction',
  component: 'destruction',
  color: { background: '#13122E' },
  settings: [
    pxratio(),
    buildInputSlider({ name: 'position',    value: 0.1, icon: 'position',    max: 1, min: 0.01 }),
    buildInputSlider({ name: 'perspective', value: 0.1, icon: 'perspective', max: 1, min: 0.01 }),
    buildInputSlider({ value: 10, max: 15 }),
    randomButton,
    resetButton
  ]
}
