import type { AppTheme } from '@/models/app'
import { pxratio, randomButton, resetButton, buildInputSlider } from '@/utils/theme-inputs'

export const TUNNEL_SETTINGS: AppTheme = {
  name: 'Tunnel',
  component: 'tunnel',
  color: { background: '#000014' },
  settings: [
    pxratio(),
    buildInputSlider({ value: 5, max: 15 }),
    buildInputSlider({ name: 'step',       value: 0.07, min: 0.01,  max: 0.3,  step: 0.01  }),
    buildInputSlider({ name: 'frequency',  value: 9,    min: 1,     max: 20,   step: 0.5   }),
    buildInputSlider({ name: 'amplitude',  value: 1,    min: 0,     max: 3,    step: 0.1   }),
    buildInputSlider({ name: 'brightness', value: 0.01, min: 0.001, max: 0.05, step: 0.001 }),
    randomButton,
    resetButton
  ]
}
