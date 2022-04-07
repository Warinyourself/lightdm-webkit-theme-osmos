export interface AppSettings {
  currentTheme: string;
  currentOs: string;
  username: string;
  desktop: string;
  defaultColor: string;
  generateRandomThemes: boolean;
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
