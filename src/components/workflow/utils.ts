/**
 * Description: 公共方法库
 * Created Date: 2022-03-30 22:11:38
 * Author: Kang Dong
 */

import { Direction, ComponentType, LineInfo, LineType, Attr } from './type'

export const getUUID = (pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx') => {
  return pattern.replace(/[xy]/g, (c: string) => {
    const r: number = Math.random() * 16 | 0
    const v: number = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 获取两点间的距离
export function getDist(
  x1: number, y1: number, x2: number, y2: number
) {
  const a = x1 - x2
  const b = y1 - y2
  return Math.sqrt(a * a + b * b)
}

// 获取在组件的哪个点附近
const offsetDire: Direction[] = ['up', 'right', 'down', 'left']
export const getPosition = (component: ComponentType, offsetX: number, offsetY: number) => {
  const { w, h } = component.attr
  const offsetx = offsetX
  const offsety = offsetY

  const points = [[w / 2, 0], [w, h / 2], [w / 2, h], [0, h / 2]]
  let min = Infinity, index = 0

  for (let i = 0; i < 4; i++) {
    const val = getDist(
      offsetx, offsety, points[i][0], points[i][1]
    )
    if (min > val) {
      min = val
      index = i
    }
  }

  // 计算目标坐标
  return offsetDire[index]
}

// 判断当前鼠标位置是否有线
export const isAboveLine = (offsetX: number, offsetY: number, points: LineInfo[]) => {
  for (let i = 0; i < points.length; i++) {
    const innerPonints = points[i].points
    let pre: number[], cur: number[]
    for (let j = 1; j < innerPonints.length; j++) {
      pre = innerPonints[j - 1]
      cur = innerPonints[j]
      // 如果存在线上则返回
      const angle = getAngle([cur[0] - offsetX, cur[1] - offsetY], [pre[0] - offsetX, pre[1] - offsetY])
      if (Math.abs(angle - 180) < 5) {
        return points[i]
      }
    }
  }

  return false
}

// 获取角度，判断是否在同一条线上
const getAngle = ([x1, y1]: number[], [x2, y2]: number[]) => {
  const dot = x1 * x2 + y1 * y2
  const det = x1 * y2 - y1 * x2
  const angle = Math.atan2(det, dot) / Math.PI * 180
  return Math.round(angle + 360) % 360
}

// 删除组件
export const removeComponent = (componentLinst: ComponentType[], allLinePoints: LineInfo[], componentId: string) => {
  for (let i = 0; i < componentLinst.length; i++) {
    const currComponent = componentLinst[i]
    const next = currComponent.props.next
    if (currComponent.id === componentId) { // 出度 源组件
      for (let j = 0; j < next.length; j++) {
        removeLine(componentLinst, allLinePoints, next[j].id, false)
      }
      componentLinst.splice(i, 1)
    } else if (next.length) {
      for (let j = next.length - 1; j >= 0; j--) {
        if (next[j].targetComponentId === componentId) { // 入度 目标组件
          removeLine(componentLinst, allLinePoints, next[j].id, false)
          next.splice(j, 1)
        }
      }
    }
  }
}

// 删除线
export const removeLine = (componentLinst: ComponentType[], allLinePoints: LineInfo[], activeLineId: string, updateComponent: boolean) => {
  for (let i = 0; i < allLinePoints.length; i++) {
    if (allLinePoints[i].id === activeLineId) {
      allLinePoints.splice(i, 1)
    }
  }
  if (updateComponent) {
    for (let i = 0; i < componentLinst.length; i++) {
      const currComponent = componentLinst[i]
      const next = currComponent.props.next
      if (next.length) {
        for (let j = 0; j < next.length; j++) {
          if (next[j].id === activeLineId) {
            next.splice(j, 1)
            return
          }
        }
      }
    }
  }
}

// 选中编辑框内所有内容
export const selectAllContent = (target: HTMLElement) => {
  target.focus()
  window.getSelection()?.selectAllChildren(target)
}

// 获取连接线的中点坐标
export const getCenterPoint = (points: number[][], type: LineType) => {
  if (type === 'straight') {
    return getStraightLineCenterPoint(points)
  }

  if (type === 'broken') {
    return getBrokenCenterPoint(points)
  }

  if (type === 'bezier') {
    return getBezierCenterPoint(points)
  }

  return [0, 0]
}

// 获取一条直线的中点坐标
const getStraightLineCenterPoint = ([[x1, y1], [x2, y2]]: number[][]) => {
  return [(x1 + x2) / 2, (y1 + y2) / 2]
}

// 获取一条折线的中点坐标
const getBrokenCenterPoint = (points: number[][]) => {
  const lineDistancehalf = getLineDistance(points) >> 1

  let distanceSum = 0, pre = 0, tp: number[][] = [], distance = 0

  for (let i = 1; i < points.length; i++) {
    pre = getTwoPointDistance(points[i - 1], points[i])
    if (distanceSum + pre > lineDistancehalf) {
      tp = [points[i - 1], points[i]]
      distance = lineDistancehalf - distanceSum
      break
    }
    distanceSum += pre
  }

  if (!tp.length) {
    return [0, 0]
  }

  let x = tp[0][0], y = tp[0][1]

  if (tp[0][0] === tp[1][0]) {
    if (tp[0][1] > tp[1][1]) {
      y -= distance
    } else {
      y += distance
    }
  } else {
    if (tp[0][0] > tp[1][0]) {
      x -= distance
    } else {
      x += distance
    }
  }

  return [x, y]
}

// 获取一条线的长度
const getLineDistance = (points: number[][]) => {
  let distanceSum = 0

  for (let i = 1; i < points.length; i++) {
    distanceSum += getTwoPointDistance(points[i - 1], points[i])
  }

  return distanceSum | 0
}

// 计算直线的长度
const getTwoPointDistance = ([x1, y1]: number[], [x2, y2]: number[]) => {
  const x = Math.abs(x2 - x1)
  const y = Math.abs(y2 - y1)
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

// 保存连线信息到组件内
export const updateComponentLineText = (componentList: ComponentType[], allLinePoints: LineInfo[], id: string, val: string) => {
  for (let i = 0; i < componentList.length; i++) {
    const currComponent = componentList[i]
    const next = currComponent.props.next
    if (next.length) {
      for (let j = 0; j < next.length; j++) {
        if (next[j].id === id) {
          if (next[j].extra !== val) {
            next[j].extra = val
            updateLineText(allLinePoints, id, val)
            return true
          }
          return false
        }
      }
    }
  }
}

// 保存连线信息到当前渲染的连线列表内
const updateLineText = (allLinePoints: LineInfo[], id: string, val: string) => {
  for (let i = 0; i < allLinePoints.length; i++) {
    if (allLinePoints[i].id === id) {
      allLinePoints[i].extra = val
    }
  }
}

// 获取三阶贝塞尔曲线的中点坐标
const getBezierCenterPoint = (points: number[][]) => {
  return getThreeBezierPoint(0.5, points[0], points[1], points[2], points[3])
}

/**
 * @desc 获取三阶贝塞尔曲线的线上坐标
 * @param {number} t 当前百分比
 * @param {Array} p1 起点坐标
 * @param {Array} p2 终点坐标
 * @param {Array} cp1 控制点1
 * @param {Array} cp2 控制点2
 */
const getThreeBezierPoint = (t: number, p1: number[], cp1: number[], cp2: number[], p2: number[]) => {
  const [x1, y1] = p1
  const [x2, y2] = p2
  const [cx1, cy1] = cp1
  const [cx2, cy2] = cp2
  const x =
    x1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cx1 * t * (1 - t) * (1 - t) +
    3 * cx2 * t * t * (1 - t) +
    x2 * t * t * t
  const y =
    y1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cy1 * t * (1 - t) * (1 - t) +
    3 * cy2 * t * t * (1 - t) +
    y2 * t * t * t
  return [x, y]
}

// 获取范围选中内的组件
export const getSelectedComponent = (componentList: ComponentType[], areaPosi: Attr) => {
  let selectedArea: Attr | null = null
  let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity
  const selectedComponents = componentList.filter((component: ComponentType) => {

    const res = areaPosi.x <= component.attr.x &&
      areaPosi.y <= component.attr.y &&
      areaPosi.x + areaPosi.w >= component.attr.x + component.attr.w &&
      areaPosi.y + areaPosi.h >= component.attr.y + component.attr.h

    if (res) {
      minx = Math.min(minx, component.attr.x)
      miny = Math.min(miny, component.attr.y)
      maxx = Math.max(maxx, component.attr.x + component.attr.w)
      maxy = Math.max(maxy, component.attr.y + component.attr.h)
    }
    return res
  })

  if (selectedComponents.length) {
    selectedArea = {
      x: minx,
      y: miny,
      w: maxx - minx,
      h: maxy - miny
    }
    return {
      selectedArea, selectedComponents
    }
  }
  return null
}
