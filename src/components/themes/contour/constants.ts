import type { AppTheme } from '@/models/app'
import {
  pxratio,
  randomButton,
  resetButton,
  buildInputSlider,
  buildInputColor,
} from '../../../utils/theme-inputs'

export const CONTOUR_SETTINGS: AppTheme = {
  name: 'Contour',
  component: 'contour',
  color: {
    background: '#0a001a'
  },
  settings: [
    pxratio({ value: 1 }),
    buildInputSlider({ value: 0.7, min: 0, max: 15, step: 0.1 }),
    buildInputSlider({ name: 'scale',    value: 4,    min: 1,    max: 8,    step: 0.1  }),
    buildInputSlider({ name: 'contour',  value: 18,   min: 2,    max: 64,   step: 1    }),
    buildInputSlider({ name: 'width',    value: 0.01, min: 0.01, max: 1,    step: 0.01 }),
    buildInputSlider({ name: 'max-line', value: 0.03,  min: 0.01, max: 1,    step: 0.01 }),
    buildInputColor({ name: 'color-active', value: '#ed2ce6' }),
    buildInputColor({ name: 'color-second', value: '#1360dd' }),
    buildInputColor({ name: 'color-bg',     value: '#06010e' }),
    randomButton,
    resetButton
  ]
}
