import type { AppTheme } from '@/models/app'
import {
  pxratio,
  hueSlider,
  randomButton,
  resetButton,
  brightnessSlider,
  buildInputSlider,
  buildInputColor,
  buildInvertCheckbox,
} from './themeInputs'

const background = '#22233D'

export const defaultTheme: AppTheme = {
  name: 'Random',
  component: 'random',
  color: {
    background: '#19102e'
  },
  settings: [
    pxratio(),
    buildInputSlider({ min: 0.2 }),
    buildInputSlider({ name: 'symmetry', min: 0.01, max: 2, value: 0.1 }),
    buildInputSlider({ name: 'thickness', min: 0.01, max: 0.7, value: 0.1 }),
    hueSlider(),
    brightnessSlider(),
    buildInvertCheckbox(),
    randomButton,
    resetButton
  ]
}

export const AppThemes: AppTheme[] = [
  defaultTheme,
  {
    name: 'Sphere',
    component: 'sphere',
    color: {
      background
    },
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
  },
  {
    name: 'Planet',
    component: 'planet',
    color: {
      background
    },
    settings: [
      pxratio(),
      buildInputSlider(),
      {
        name: 'position',
        type: 'slider',
        label: 'input.position',
        value: 3.9,
        icon: 'position',
        options: {
          step: 0.01,
          max: 20,
          min: 2.8,
          changeOnUpdate: true
        }
      },
      randomButton,
      resetButton
    ]
  },
  {
    name: 'Destruction',
    component: 'destruction',
    color: {
      background: '#13122E'
    },
    settings: [
      pxratio(),
      buildInputSlider({ name: 'position', value: 0.1, icon: 'position', max: 1, min: 0.01 }),
      buildInputSlider({ name: 'perspective', value: 0.1, icon: 'perspective', max: 1, min: 0.01 }),
      buildInputSlider({ value: 10, max: 15 }),
      randomButton,
      resetButton
    ]
  },
  {
    name: 'Rings',
    component: 'rings',
    color: {
      background
    },
    settings: [
      pxratio(),
      buildInputSlider(),
      buildInputSlider({ name: 'hue', value: 0, icon: 'hue', max: 0.5, min: -0.5 }),
      buildInputSlider({ name: 'zoom', value: 32, icon: 'zoom', max: 100, min: 2 }),
      randomButton,
      resetButton
    ]
  },
  {
    name: 'Tenderness',
    component: 'tenderness',
    color: {
      background
    },
    settings: [
      pxratio(),
      buildInputSlider({ value: 10, max: 15 }),
      randomButton,
      resetButton
    ]
  },
  {
    name: 'Plasma',
    component: 'plasma',
    color: {
      background
    },
    settings: [
      pxratio(),
      hueSlider(),
      buildInputSlider({ value: 10, max: 25 }),
      randomButton,
      resetButton
    ]
  },
  {
    name: 'Flow',
    component: 'flow',
    color: {
      background
    },
    settings: [
      pxratio(),
      hueSlider(),
      brightnessSlider(),
      buildInvertCheckbox(),
      buildInputSlider({ value: 10, max: 15 }),
      buildInputSlider({ value: 1, max: 2.8, min: 0.2, name: 'size' }),
      randomButton,
      resetButton
    ]
  },
  {
    name: 'Tunnel',
    component: 'tunnel',
    color: {
      background: '#000014'
    },
    settings: [
      pxratio(),
      buildInputSlider({ value: 5, max: 15 }),
      buildInputSlider({ name: 'step',      value: 0.07, min: 0.01, max: 0.3,  step: 0.01  }),
      buildInputSlider({ name: 'frequency', value: 9,    min: 1,    max: 20,   step: 0.5   }),
      buildInputSlider({ name: 'amplitude', value: 1,    min: 0,    max: 3,    step: 0.1   }),
      buildInputSlider({ name: 'brightness',value: 0.01, min: 0.001,max: 0.05, step: 0.001 }),
      randomButton,
      resetButton
    ]
  },
  {
    name: 'Rings3D',
    component: 'rings3d',
    color: {
      background: '#0a0015'
    },
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
  },
  {
    name: 'Zappy',
    component: 'zappy',
    color: { background: '#000010' },
    settings: [
      pxratio(),
      buildInputSlider({ value: 5,   min: 0,   max: 15,  step: 0.1  }),
      buildInputSlider({ name: 'zoom',        value: 0.2, min: 0.05, max: 0.6, step: 0.01 }),
      buildInputSlider({ name: 'color-shift', value: 0,   min: 0,    max: 6.28, step: 0.05 }),
      randomButton,
      resetButton
    ]
  },
  {
    name: 'Contour',
    component: 'contour',
    color: {
      background: '#0a001a'
    },
    settings: [
      pxratio(),
      buildInputSlider({ value: 3, min: 0, max: 15, step: 0.1 }),
      buildInputSlider({ name: 'scale',    value: 3,    min: 1,    max: 8,    step: 0.1  }),
      buildInputSlider({ name: 'contour',  value: 32,   min: 2,    max: 64,   step: 1    }),
      buildInputSlider({ name: 'width',    value: 0.15, min: 0.01, max: 1,    step: 0.01 }),
      buildInputSlider({ name: 'max-line', value: 0.3,  min: 0.01, max: 1,    step: 0.01 }),

      buildInputColor({ name: 'color-active', value: '#FF00FF' }),
      buildInputColor({ name: 'color-second', value: '#00FFFF' }),
      buildInputColor({ name: 'color-bg',     value: '#000000' }),
      randomButton,
      resetButton
    ]
  },
]
