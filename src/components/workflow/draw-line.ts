/**
 * Description: 组件间的连线
 * Created Date: 2022-03-31 10:24:17
 * Author: Kang Dong
 */

import { ComponentType, Next, Direction, CanvasLineType } from './component-list'

export default function drawLine(
  e: MouseEvent, canvasLine: CanvasLineType, cacheLine: CanvasLineType, pagex: number, pagey: number
) {
  const x = e.pageX - pagex
  const y = e.pageY - pagey

  canvasLine.w = cacheLine.w + Math.abs(x)
  canvasLine.h = cacheLine.h + Math.abs(y)
  if (x <= 0) {
    canvasLine.left = cacheLine.left + x
  }
  if (y <= 0) {
    canvasLine.top = cacheLine.top + y
  }
}

// 计算连线区域的x, y
export const calcXY = (type: Direction, component: ComponentType) => {
  const attr = component.attr
  let x = attr.x + 5, y = attr.y + 5

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
}

// 检查是否存在同样的线 
export const checkHasLine = (type: Direction, originNext: Next[], component: ComponentType) => {
  return originNext.findIndex((v: Next) => {
    return v.id === component.id && v.directionEnd === type
  }) > -1
}

export const removeCanvasLine = (canvasLineList: CanvasLineType[], line: CanvasLineType) => {
  let i = 0
  for (const canvasLine of canvasLineList) {
    if (canvasLine.id === line.id) {
      canvasLineList.splice(i, 1)
      return
    }
    i++
  }
}
