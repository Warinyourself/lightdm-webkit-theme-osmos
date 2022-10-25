export type ColorArray = [number, number, number]

export interface IConvertOptions {
  view?: 'array' | 'string'
}

export const hexToRgb = (color: string): ColorArray => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0]
}

export const fromBracketsToNumber = (color: string): ColorArray => {
  const colors = color.slice(color.indexOf('(') + 1).replace(')', '').split(',')

  return colors.slice(0, 3).map(parseInt) as ColorArray
}

export const changeHsl = (hsl: string, hAdd: number, sAdd: number, lAdd: number): string => {
  let hslMass = fromBracketsToNumber(hsl)
  return `hsl(${hslMass[0] + hAdd}, ${hslMass[1] + sAdd}%, ${hslMass[2] + lAdd}%)`
}

export function rgbToHsl (colorRGB: ColorArray): string
export function rgbToHsl (colorRGB: ColorArray, convertOptions?: IConvertOptions): string | ColorArray {
  let [r, g, b] = colorRGB
  const { view } = convertOptions || {}
  const isArray = view === 'array'
  r /= 255
  g /= 255
  b /= 255
  let [max, min] = [Math.max(r, g, b), Math.min(r, g, b)]

  let h = 0
  let s = 0
  let l = (max + min) / 2

  const finalArray = (): ColorArray => [Math.round(h), Math.round(s * 100), Math.round(l * 100)]
  const formatString = (hsl: ColorArray) => `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`
  if (max === min) {
    h = s = 0
    return isArray ? finalArray() : formatString(finalArray())
  }

  let d = (max - min)
  s = l >= 0.5 ? d / (2 - (max + min)) : d / (max + min)
  switch (max) {
    case r: h = ((g - b) / d + 0) * 60; break
    case g: h = ((b - r) / d + 2) * 60; break
    case b: h = ((r - g) / d + 4) * 60; break
  }

  return isArray ? finalArray() : formatString(finalArray())
}

function getPrettyDate(timestamp: number): string;
function getPrettyDate(day: string, month: string, year: string): string;
function getPrettyDate(date: Date): string;

// Может принимать от 1 до 3 параметров разных типов, в зависимости от перегрузок
function getPrettyDate(arg1: unknown, arg2?: unknown, arg3?: unknown) {
    let prettyDate: string = '';

    if(typeof arg1 === 'number') {
        const date = new Date(arg1);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        prettyDate = `${day}/${month}/${year}`
    }

    return prettyDate;
}

const timeStamp = new Date().getTime();
getPrettyDate(timeStamp);