/**
 * Description: 计算三阶贝塞尔曲线的坐标
 * Created Date: 2022-04-07 22:57:38
 * Author: Kang Dong
 */
import WF from '../type'

const coeff = 0.5
export default function calcBezierPoints({ startDire, startx, starty, destDire, destx, desty }: WF.CalcBezierType,
  points: [number, number][]) {

  const p = Math.max(Math.abs(destx - startx), Math.abs(desty - starty)) * coeff
  switch (startDire) {
    case 'down':
      points.push([startx, starty + p])
      break
    case 'up':
      points.push([startx, starty - p])
      break
    case 'left':
      points.push([startx - p, starty])
      break
    case 'right':
      points.push([startx + p, starty])
      break
    // no default
  }
  switch (destDire) {
    case 'down':
      points.push([destx, desty + p])
      break
    case 'up':
      points.push([destx, desty - p])
      break
    case 'left':
      points.push([destx - p, desty])
      break
    case 'right':
      points.push([destx + p, desty])
      break
    // no default
  }
}
