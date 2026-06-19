import type { AppTheme } from '@/models/app'
import {
  pxratio,
  hueSlider,
  randomButton,
  brightnessSlider,
  buildInputSlider,
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
    randomButton
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
      randomButton
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
      randomButton
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
      randomButton
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
      randomButton
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
      randomButton
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
      randomButton
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
      randomButton
    ]
  },
]
