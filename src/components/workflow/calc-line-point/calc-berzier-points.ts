/**
 * Description: 计算三阶贝塞尔曲线的坐标
 * Created Date: 2022-04-07 22:57:38
 * Author: Kang Dong
 */
import { Quadrant, CalcType } from '../type'

export default function calcBerzierPoints({ startDire, startx, starty, destDire, destx, desty, w, h, dw, dh }: CalcType,
  points: number[][],
  quadrant: Quadrant) {
  console.log(
    startDire, startx, starty, destDire, destx, desty, w, h, dw, dh
  )
  console.log(points, quadrant)
}
