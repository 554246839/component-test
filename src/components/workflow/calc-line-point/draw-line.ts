/**
 * Description: 组件间的连线
 * Created Date: 2022-03-31 10:24:17
 * Author: Kang Dong
 */

import {
  ComponentType, Next, Direction, Quadrant, LineType,
  AllType, DrawLineType, CalcType
} from '../type'
import drawArrow from '../draw-arrow'
import { getCenterPoint } from '../utils'
import calcStraightPoints from './calc-straight-points'
import calcBerzierPoints from './calc-berzier-points'

// 高亮连线的处理
const SHADOWCOLOR = '#f56c6c'
const shadowLine = (ctx: CanvasRenderingContext2D, highlight?: boolean) => {
  if (highlight) {
    ctx.shadowBlur = 2
    ctx.shadowColor = SHADOWCOLOR
  } else {
    ctx.shadowBlur = 0
    ctx.shadowColor = 'transparent'
  }
}

export default function drawLine({ ctx, startx, starty, startDire, destx, desty, destDire, w, h, dw, dh, type = 'broken', id, extra = '' }: AllType) {

  if (!destDire) {
    if (Math.abs(desty - starty) >= Math.abs(destx - startx)) {
      if (starty > desty) {
        destDire = 'down'
      } else {
        destDire = 'up'
      }
    } else {
      if (startx > destx) {
        destDire = 'right'
      } else {
        destDire = 'left'
      }
    }
  }

  const points = calcPoints({ startx, starty, startDire, destx, desty, destDire, type, w, h, dw, dh, })

  if (type === 'broken') {
    drawBrokenLine({ ctx, points })
  } else if (type === 'bezier') {
    drawBezier({ ctx, points })
  } else {
    drawStraightLine(ctx, [[startx, starty], [destx, desty]])
  }

  drawArrow(ctx, points[points.length - 2], points[points.length - 1])

  // 获取终点坐标
  const centerPoint = getCenterPoint(points, type)

  return { type, points, id, centerPoint, extra }
}

// 绘制缓存line
export const drawCacheLine = (
  ctx: CanvasRenderingContext2D, type: LineType, points: number[][], highlight?: boolean
) => {
  if (points?.length) {
    if (type === 'broken') {
      drawBrokenLine({ ctx, points }, highlight)
    } else if (type === 'bezier') {
      drawBezier({ ctx, points }, highlight)
    } else {
      drawStraightLine(ctx, points, highlight)
    }
  }

  drawArrow(ctx, points[points.length - 2], points[points.length - 1])
}

// 计算连线区域的x, y
export const calcXY = (type: Direction, component: ComponentType) => {
  const attr = component.attr
  let { x, y } = attr

  switch (type) {
    case 'up':
      x += attr.w >> 1
      break
    case 'down':
      x += attr.w >> 1
      y += attr.h
      break
    case 'left':
      y += attr.h >> 1
      break
    case 'right':
      x += attr.w
      y += attr.h >> 1
      break
    default:
  }

  return { x, y }
}

// 网格背景
export const drawGridLine = (
  ctx: CanvasRenderingContext2D, width: number, height: number, cellSize: number
) => {
  const maxX = width / cellSize | 0, maxY = height / cellSize | 0
  ctx.beginPath()
  for (let i = 1; i <= maxY; i++) {
    ctx.moveTo(0, i * cellSize)
    ctx.lineTo(width, i * cellSize)
  }

  for (let i = 1; i <= maxX; i++) {
    ctx.moveTo(i * cellSize, 0)
    ctx.lineTo(i * cellSize, height)
  }
  ctx.lineWidth = 1
  ctx.strokeStyle = '#efefef'
  ctx.stroke()
  ctx.restore()
  ctx.closePath()
}

// 检查是否存在同样的线 
export const checkHasLine = (type: Direction, originNext: Next[], component: ComponentType) => {
  return originNext.findIndex((v: Next) => {
    return v.id === component.id && v.directionEnd === type
  }) > -1
}

// 绘制直线
const drawStraightLine = (ctx: CanvasRenderingContext2D, points: number[][], highlight?: boolean) => {
  ctx.beginPath()
  ctx.moveTo(points[0][0], points[0][1])
  ctx.lineTo(points[1][0], points[1][1])
  ctx.lineWidth = 2
  ctx.strokeStyle = '#000'
  shadowLine(ctx, highlight)
  ctx.stroke()
  ctx.restore()
  ctx.closePath()
}

// 绘制折线
const drawBrokenLine = ({ ctx, points }: DrawLineType, highlight?: boolean) => {
  ctx.beginPath()
  ctx.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1])
  }
  ctx.lineWidth = 2
  ctx.strokeStyle = '#000'
  shadowLine(ctx, highlight)
  ctx.stroke()
  ctx.restore()
  ctx.closePath()
}

// 绘制贝塞尔曲线
const drawBezier = ({ ctx, points }: DrawLineType, highlight?: boolean) => {
  ctx.beginPath()
  ctx.strokeStyle = 'blue'
  ctx.beginPath()
  ctx.moveTo(points[0][0], points[0][1])
  ctx.bezierCurveTo(
    points[1][0], points[1][1], points[2][0], points[2][1], points[3][0], points[3][1]
  )
  shadowLine(ctx, highlight)
  ctx.stroke()
  ctx.restore()
  ctx.globalCompositeOperation = 'source-over'    //目标图像上显示源图像

  //绘制上面曲线的控制点和控制线，控制点坐标为两直线的交点(75,50)
  ctx.strokeStyle = 'red'
  ctx.beginPath()
  ctx.moveTo(points[0][0], points[0][1])
  ctx.lineTo(points[1][0], points[1][1])
  ctx.lineTo(points[2][0], points[2][1])
  ctx.lineTo(points[3][0], points[3][1])
  ctx.stroke()

  ctx.closePath()
}

let quadrant: Quadrant
const calcPoints = ({ startDire, startx, starty, destDire, destx, desty, type, w, h, dw, dh }: CalcType) => {
  const points: number[][] = [[startx, starty]]

  if (startx > destx) {
    if (starty > desty) {
      quadrant = 'lu'
    } else {
      quadrant = 'ld'
    }
  } else {
    if (starty > desty) {
      quadrant = 'ru'
    } else {
      quadrant = 'rd'
    }
  }

  if (type === 'broken') {
    calcStraightPoints({ startDire, startx, starty, destDire, destx, desty, w, h, dw, dh, }, points, quadrant)
  } else {
    calcBerzierPoints({ startDire, startx, starty, destDire, destx, desty, w, h, dw, dh, }, points, quadrant)
  }

  points.push([destx, desty])

  return points
}
