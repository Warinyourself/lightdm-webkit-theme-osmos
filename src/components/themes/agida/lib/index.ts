import { Wavery, WaveConfigInterface } from './wave'

export function waveInit(data: WaveConfigInterface) {
  const wavery = new Wavery(data)

  return wavery.generateSvg()
}
