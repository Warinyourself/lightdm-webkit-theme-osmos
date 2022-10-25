import { AppTheme } from '@/models/app'
import {
  pxratio,
  hueSlider,
  randomButton,
  setActiveColor,
  brightnessSlider,
  buildInputSlider,
  buildInvertCheckbox
} from './helper'

const background = '#22233D'

export const defaultTheme: AppTheme = {
  name: 'Random',
  component: 'random',
  color: {
    active: '#04ded4',
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
  {
    name: 'Agida',
    component: 'agida',
    color: {
      active: '#04ded4',
      background: '#19102e'
    }
  },
  defaultTheme,
  {
    name: 'Sphere',
    component: 'sphere',
    color: {
      active: '#04ded4',
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
      active: '#04ded4',
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
      active: '#04ded4',
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
      active: '#04ded4',
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
      active: '#04ded4',
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
      active: '#04ded4',
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
      active: '#04ded4',
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
  {
    name: 'Infinity',
    component: 'infinity',
    settings: [
      {
        name: 'palette',
        type: 'palette',
        label: 'input.slider-amount',
        value: 0,
        values: [
          ['#fcb2bf', '#cf56a1', '#8b2f97', '#511e78'],
          ['#e8f79a', '#49d292', '#3b445b', '#383746'],
          ['#f5f5f5', '#fc5185', '#3fc1c9', '#364f6b'],
          ['#00A8CC', '#0C7B93', '#27496D', '#142850'],
          ['#F9F7F7', '#DBE2EF', '#3F72AF', '#112D4E'],
          ['#ABEDD8', '#46CDCF', '#3D84A8', '#48466D']
        ]
      },
      buildInputSlider({ name: 'size', value: 20, max: 50, min: 2, step: 1, changeOnUpdate: false }),
      buildInputSlider({ name: 'amount', value: 30, max: 100, min: 10, step: 1, changeOnUpdate: false }),
      buildInputSlider({ value: 20, min: 5, max: 100 }),
      randomButton
    ],
    color: {
      active: '#04ded4',
      background: '#19102e'
    }
  },
  {
    name: 'Suprematism',
    component: 'suprematism',
    settings: [
      {
        name: 'activeColor',
        type: 'color',
        label: 'input.color-active',
        value: '#F690FF',
        options: {
          class: 'w-50'
        },
        callback: setActiveColor
      }
    ],
    color: {
      active: '#F690FF',
      background: '#fff'
    }
  },
  {
    name: 'Osmos',
    component: 'osmos',
    color: {
      active: '#e13571',
      background: '#1a0532'
    }
  },
  {
    name: 'Space',
    component: 'space',
    color: {
      active: '#04ded4',
      background: '#19102e'
    }
  }
]

export const osList = [
  {
    text: 'Arch Linux',
    value: 'arch-linux',
    icon: 'arch-linux'
  },
  {
    text: 'Ubuntu',
    value: 'ubuntu',
    icon: 'ubuntu'
  },
  {
    text: 'Fedora',
    value: 'fedora',
    icon: 'fedora'
  },
  {
    text: 'Linux Mint',
    value: 'linux-mint',
    icon: 'linux-mint'
  },
  {
    text: 'Gentoo',
    value: 'gentoo',
    icon: 'gentoo'
  }
]
