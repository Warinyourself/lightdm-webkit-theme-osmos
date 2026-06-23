import type { AppTheme } from '@/models/app'
import { pxratio, randomButton, resetButton, buildInputSlider, buildInputColor } from '@/utils/theme-inputs'

export const RINGS3D_SETTINGS: AppTheme = {
  name: 'Rings3D',
  component: 'rings3d',
  color: { background: '#0a0015' },
  settings: [
    pxratio(),
    buildInputSlider({ value: 5,    min: 0,    max: 15,   step: 0.1  }),
    buildInputSlider({ name: 'tube-size',      value: 0.2,  min: 0.02, max: 0.6,  step: 0.01 }),
    buildInputSlider({ name: 'bubble-size',    value: 1.85, min: 0.5,  max: 3.5,  step: 0.05 }),
    buildInputSlider({ name: 'fog-density',    value: 0.8,  min: 0.2,  max: 1.0,  step: 0.01 }),
    buildInputSlider({ name: 'spectrum-speed', value: 6.0,  min: 1.0,  max: 12.0, step: 0.5  }),
    buildInputColor({ name: 'color-glow', value: '#AAFFCE' }),
    buildInputColor({ name: 'color-fog',  value: '#9940B3' }),
    randomButton,
    resetButton
  ]
}
