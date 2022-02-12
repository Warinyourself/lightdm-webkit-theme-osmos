import { AppModule } from '@/store/app'

export interface AppSettings {
  currentTheme: string;
  currentOs: string;
  username: string;
  desktop: string;
  defaultColor: string;
  bodyClass: Record<string, boolean>;
  themes: AppTheme[];
}

export interface AppTheme {
  component: string;
  settings?: AppInputTheme[];
  snapshots?: AppThemeSnapshot[];
  name: string;
  color: {
    active: string;
    background: string;
  };
}

export interface AppThemeSnapshot {
  title: string;
  values: Record<string, AppInputThemeValue>;
}

export type AppInputTheme = AppInputThemeGeneral | AppInputThemeSlider | AppInputThemeSlider | AppInputButton
export type AppInputThemeType = 'color' | 'slider' | 'checkbox' | 'palette' | 'button'
export type AppInputThemeValue = string | boolean | string[] | number

export interface AppInputThemeGeneral {
  name: string;
  value: AppInputThemeValue;
  label: string;
  type: AppInputThemeType;
  values?: string[][];
  options?: AppInputThemeOptions;
  callback?: (value: AppInputThemeValue) => void;
}

export interface AppInputThemeSlider extends AppInputThemeGeneral {
  type: 'slider';
  icon: string;
  options: AppInputThemeOptionsSlider;
}

export interface AppInputButton {
  // TODO: "name" and "value" useless property, need to delete them
  name: 'button';
  value: 'button';
  label: string;
  icon?: string;
  type: 'button';
  callback?: () => void;
}

export interface AppInputThemeOptions {
  class?: string;
  changeOnUpdate?: boolean;
}

export interface AppInputThemeOptionsSlider extends AppInputThemeOptions {
  min: number;
  max: number;
  step: number;
}

export interface AppInputColor {
  a: string;
  hex: string;
  hex8: string;
  hsl: string;
  hsv: string;
  oldHue: string;
  rgba: string;
  source: string;
}

function setActiveColor(color: AppInputThemeValue) {
  document.documentElement.style.setProperty('--color-active', color + '')
}

const randomButton: AppInputButton = {
  name: 'button',
  value: 'button',
  label: 'input.random',
  type: 'button',
  icon: 'random',
  callback() {
    AppModule.randomizeSettingsTheme()
  }
}

function buildInputSlider({
  name = 'animation-speed',
  value = 5,
  min = 1,
  max = 10,
  step = 0.01,
  icon = 'time'
} = {}): AppInputThemeSlider {
  return {
    name,
    label: `input.${name}`,
    value,
    icon,
    type: 'slider',
    options: { changeOnUpdate: true, max, step, min }
  }
}

const pxratio = () => buildInputSlider({ name: 'pxratio', icon: 'pxratio', min: 0.01, max: 1, value: 0.8 })
const hueInput = () => buildInputSlider({ name: 'hue', min: 1, max: 360, step: 1, value: 0 })
const brightnessInput = () => buildInputSlider({ name: 'brightness', min: 0, max: 1, step: 0.01, value: 1 })

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
    hueInput(),
    brightnessInput(),
    {
      name: 'invert',
      label: 'input.invert',
      type: 'checkbox',
      value: false
    },
    randomButton
  ]
}

export const AppThemes: AppTheme[] = [
  defaultTheme,
  {
    name: 'Sphere',
    component: 'sphere',
    color: {
      active: '#04ded4',
      background: 'black'
    },
    settings: [
      pxratio(),
      {
        name: 'invert',
        label: 'input.invert',
        type: 'checkbox',
        value: false
      },
      hueInput(),
      brightnessInput(),
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
      background: 'black'
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
      background: 'black'
    },
    settings: [
      pxratio(),
      {
        name: 'position',
        type: 'slider',
        label: 'input.position',
        value: 0.1,
        icon: 'position',
        options: {
          step: 0.01,
          max: 1,
          min: 0.01,
          changeOnUpdate: true
        }
      },
      {
        name: 'perspective',
        type: 'slider',
        label: 'input.perspective',
        value: 0.1,
        icon: 'perspective',
        options: {
          step: 0.01,
          max: 1,
          min: 0.01,
          changeOnUpdate: true
        }
      },
      buildInputSlider({ value: 10, max: 15 }),
      randomButton
    ]
  },
  {
    name: 'Rings',
    component: 'rings',
    color: {
      active: '#04ded4',
      background: 'black'
    },
    settings: [
      pxratio(),
      buildInputSlider(),
      // TODO: rewrite on css hue property
      {
        name: 'hue',
        type: 'slider',
        label: 'input.hue',
        value: 0,
        icon: 'hue',
        options: {
          changeOnUpdate: true,
          max: 0.5,
          step: 0.01,
          min: -0.5
        }
      },
      {
        name: 'zoom',
        type: 'slider',
        label: 'input.zoom',
        value: 32,
        icon: 'zoom',
        options: {
          changeOnUpdate: true,
          max: 100,
          step: 0.1,
          min: 2
        }
      },
      randomButton
    ]
  },
  {
    name: 'Tenderness',
    component: 'tenderness',
    color: {
      active: '#04ded4',
      background: 'black'
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
      background: 'black'
    },
    settings: [
      pxratio(),
      hueInput(),
      buildInputSlider({ value: 10, max: 25 }),
      randomButton
    ]
  },
  {
    name: 'Flow',
    component: 'flow',
    color: {
      active: '#04ded4',
      background: 'black'
    },
    settings: [
      pxratio(),
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
        // TODO: Add more colors
        values: [
          ['#fcb2bf', '#cf56a1', '#8b2f97', '#511e78'],
          ['#e3fdfd', '#cbf1f5', '#a6e3e9', '#71c9ce'],
          ['#e8f79a', '#49d292', '#3b445b', '#383746'],
          ['#f5f5f5', '#fc5185', '#3fc1c9', '#364f6b']
        ]
      },
      {
        name: 'size',
        type: 'slider',
        label: 'input.size',
        value: 20,
        options: {
          class: '',
          min: 2,
          max: 50
        }
      },
      {
        name: 'amount',
        type: 'slider',
        label: 'input.amount',
        value: 30,
        options: {
          class: '',
          min: 10,
          max: 100
        }
      },
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
