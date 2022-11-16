import { computeControlPoints } from './bezier-spline'
const svgns = 'http://www.w3.org/2000/svg'

export interface WaveConfigAnimationInterface {
  time?: number;
  steps?: number;
}

export interface WaveConfigInterface {
  height: number;
  width: number;
  segmentCount: number;
  layerCount: number;
  variance: number;
  strokeWidth?: number;
  fillColor?: string;
  strokeColor?: string;
  transform?: string;
  animation?: boolean | WaveConfigAnimationInterface;
}

interface Point {
  x: number;
  y: number;
}

const defaultAnimationValues = {
  steps: 3,
  time: 40000,
  timingFunction: 'ease',
  iteration: 'infinite'
}

export class Wavery {
  properties!: WaveConfigInterface
  points: Point[][] = []
  animationPoints: Point[][][] = [];

  constructor(properties: WaveConfigInterface) {
    this.properties = properties
    this.points = this.generatePoints()

    if (this.needAnimation) {
      const { steps } = this.animation

      Array.from(Array(steps)).forEach(() => {
        this.animationPoints.push(this.generatePoints())
      })
    }
  }

  get animation() {
    const animation = this.properties.animation
    const isBoolean = typeof animation === 'boolean'

    return isBoolean ? defaultAnimationValues : { ...defaultAnimationValues, ...animation }
  }

  get cellWidth() {
    return this.properties.width / this.properties.segmentCount
  }

  get cellHeight() {
    return this.properties.height / this.properties.layerCount
  }

  get needAnimation() {
    return this.properties.animation
  }

  get pathList() {
    const pathList = []

    for (let i = 0; i < this.points.length; i++) {
      pathList.push(this.generateClosedPath(i))
    }

    return pathList
  }

  generatePoints(): Point[][] {
    const { cellWidth, cellHeight } = this
    const { width, height, variance } = this.properties
    const moveLimitX = cellWidth * variance * 0.2
    const moveLimitY = cellHeight * variance
    const points = []

    for (let y = cellHeight; y <= height; y += cellHeight) {
      const pointsPerLayer = []
      pointsPerLayer.push({ x: 0, y: Math.floor(y) })

      for (let x = cellWidth; x < width; x += cellWidth) {
        const varietalY = y - moveLimitY / 2 + Math.random() * moveLimitY
        const varietalX = x - moveLimitX / 2 + Math.random() * moveLimitX
        pointsPerLayer.push({
          x: Math.floor(varietalX),
          y: Math.floor(varietalY)
        })
      }
      pointsPerLayer.push({ x: width, y: Math.floor(y) })
      points.push(pointsPerLayer)
    }

    return points
  }

  generateClosedPath(index: number) {
    const animatedPathList: string[] = []

    const { fillColor, strokeColor, strokeWidth, transform } = this.properties
    const style = { fillColor, strokeColor, strokeWidth, transform }

    const path = this.generatePath(this.points[index])

    if (this.needAnimation) {
      this.animationPoints.forEach((waves) => {
        animatedPathList.push(this.generatePath(waves[index]))
      })
    }

    return {
      ...style,
      d: path,
      animatedPath: animatedPathList
    }
  }

  generatePath(points: Point[]) {
    const xPoints = points.map((p) => p.x)
    const yPoints = points.map((p) => p.y)

    const leftCornerPoint = { x: 0, y: this.properties.height + this.cellHeight }
    const rightCornerPoint = { x: this.properties.width, y: this.properties.height + this.cellHeight }
    const xControlPoints = computeControlPoints(xPoints)
    const yControlPoints = computeControlPoints(yPoints)

    let path =
      `M ${leftCornerPoint.x},${leftCornerPoint.y} ` +
      `C ${leftCornerPoint.x},${leftCornerPoint.y} ` +
      `${xPoints[0]},${yPoints[0]} ` +
      `${xPoints[0]},${yPoints[0]} `

    for (let i = 0; i < xPoints.length - 1; i++) {
      path +=
        `C ${xControlPoints.p1[i]},${yControlPoints.p1[i]} ` +
        `${xControlPoints.p2[i]},${yControlPoints.p2[i]} ` +
        `${xPoints[i + 1]},${yPoints[i + 1]} `
    }

    path +=
      `C ${xPoints[xPoints.length - 1]},${yPoints[xPoints.length - 1]} ` +
      `${rightCornerPoint.x},${rightCornerPoint.y} ` +
      `${rightCornerPoint.x},${rightCornerPoint.y} Z`

    return path
  }

  private generateKeyframe(percent: number, d: string) {
    return `${percent}% {d: path("${d}")}`
  }

  generateAnimationStyle(index: number) {
    const path = this.pathList[index]
    const { steps } = this.animation
    if (!path) { return }

    const animationList = Array.from(Array(steps + 2)).map((_, index, { length }) => {
      const isBound = index === 0 || index + 1 === length
      const percent = index * (100 / (steps + 1))
      return this.generateKeyframe(percent, isBound ? path.d : path.animatedPath[index - 1])
    })

    return `.path-${index}{
      animation:pathAnim-${index} ${this.animation.time}ms;
      animation-timing-function: ${this.animation.timingFunction};
      animation-iteration-count: ${this.animation.iteration};
    }

    @keyframes pathAnim-${index}{
      ${animationList.join('')}
    }`
  }

  generateSvg() {
    return {
      svg: {
        width: this.properties.width,
        height: this.properties.height + this.cellHeight,
        xmlns: svgns,
        paths: this.pathList
      }
    }
  }
}
