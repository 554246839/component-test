/**
 * Description: 公共方法库
 * Created Date: 2022-03-30 22:11:38
 * Author: Kang Dong
 */

import WF from './type'

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
const offsetDire: WF.Direction[] = ['up', 'right', 'down', 'left']
export const getPosition = (component: WF.ComponentType, offsetX: number, offsetY: number) => {
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
export const isAboveLine = (offsetX: number, offsetY: number, points: WF.LineInfo[]) => {
  for (let i = points.length - 1; i >= 0; --i) {
    const innerPonints = points[i].points
    let pre: [number, number], cur: [number, number]
    if (points[i].type !== 'bezier') {
      for (let j = 1; j < innerPonints.length; j++) {
        pre = innerPonints[j - 1]
        cur = innerPonints[j]
        if (getDistance([offsetX, offsetY], pre, cur) < 20) {
          return points[i]
        }
      }
    } else {
      // 先用 x 求出对应的 t，用 t 求相应位置的 y，再比较得出的 y 与 offsetY 之间的差值
      const tsx = getBezierT(innerPonints[0][0], innerPonints[1][0], innerPonints[2][0], innerPonints[3][0], offsetX)
      for (let x = 0; x < 3; x++) {
        if (tsx[x] <= 1 && tsx[x] >= 0) {
          const ny = getThreeBezierPoint(tsx[x], innerPonints[0], innerPonints[1], innerPonints[2], innerPonints[3])
          if (Math.abs(ny[1] - offsetY) < 8) {
            return points[i]
          }
        }
      }
      // 如果上述没有结果，则用 y 求出对应的 t，再用 t 求出对应的 x，与 offsetX 进行匹配
      const tsy = getBezierT(innerPonints[0][1], innerPonints[1][1], innerPonints[2][1], innerPonints[3][1], offsetY)
      for (let y = 0; y < 3; y++) {
        if (tsy[y] <= 1 && tsy[y] >= 0) {
          const nx = getThreeBezierPoint(tsy[y], innerPonints[0], innerPonints[1], innerPonints[2], innerPonints[3])
          if (Math.abs(nx[0] - offsetX) < 8) {
            return points[i]
          }
        }
      }
    }
  }

  return false
}

// 删除组件
export const removeComponent = (componentLinst: WF.ComponentType[], allLinePoints: WF.LineInfo[], componentId: string) => {
  for (let i = 0; i < componentLinst.length; i++) {
    const currComponent = componentLinst[i]
    const next = currComponent.next
    if (currComponent.id === componentId) { // 出度 源组件
      for (let j = 0; j < next.length; j++) {
        removeLine(
          componentLinst, allLinePoints, next[j].id, false
        )
      }
      componentLinst.splice(i, 1)
    } else if (next.length) {
      for (let j = next.length - 1; j >= 0; j--) {
        if (next[j].targetComponentId === componentId) { // 入度 目标组件
          removeLine(
            componentLinst, allLinePoints, next[j].id, false
          )
          next.splice(j, 1)
        }
      }
    }
  }
}

// 删除线
export const removeLine = (
  componentLinst: WF.ComponentType[], allLinePoints: WF.LineInfo[], activeLineId: string, updateComponent: boolean
) => {
  for (let i = 0; i < allLinePoints.length; i++) {
    if (allLinePoints[i].id === activeLineId) {
      allLinePoints.splice(i, 1)
    }
  }
  if (updateComponent) {
    for (let i = 0; i < componentLinst.length; i++) {
      const currComponent = componentLinst[i]
      const next = currComponent.next
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
export const getCenterPoint = (points: [number, number][], type: WF.LineType): [number, number] => {
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
const getStraightLineCenterPoint = ([[x1, y1], [x2, y2]]: [number, number][]): [number, number] => {
  return [(x1 + x2) / 2, (y1 + y2) / 2]
}

// 获取一条折线的中点坐标
const getBrokenCenterPoint = (points: [number, number][]): [number, number] => {
  const lineDistancehalf = getLineDistance(points) >> 1

  let distanceSum = 0, pre = 0, tp: [number, number][] = [], distance = 0

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
const getLineDistance = (points: [number, number][]) => {
  let distanceSum = 0

  for (let i = 1; i < points.length; i++) {
    distanceSum += getTwoPointDistance(points[i - 1], points[i])
  }

  return distanceSum | 0
}

// 计算直线的长度
const getTwoPointDistance = ([x1, y1]: [number, number], [x2, y2]: [number, number]) => {
  const x = Math.abs(x2 - x1)
  const y = Math.abs(y2 - y1)
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

// 保存连线信息到组件内
export const updateComponentLineText = (
  componentList: WF.ComponentType[], allLinePoints: WF.LineInfo[], id: string, val: string
) => {
  for (let i = 0; i < componentList.length; i++) {
    const currComponent = componentList[i]
    const next = currComponent.next
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
const updateLineText = (allLinePoints: WF.LineInfo[], id: string, val: string) => {
  for (let i = 0; i < allLinePoints.length; i++) {
    if (allLinePoints[i].id === id) {
      allLinePoints[i].extra = val
    }
  }
}

// 获取三阶贝塞尔曲线的中点坐标
const getBezierCenterPoint = (points: [number, number][]) => {
  return getThreeBezierPoint(
    0.5, points[0], points[1], points[2], points[3]
  )
}

/**
 * @desc 获取三阶贝塞尔曲线的线上坐标
 * @param {number} t 当前百分比
 * @param {Array} p1 起点坐标
 * @param {Array} p2 终点坐标
 * @param {Array} cp1 控制点1
 * @param {Array} cp2 控制点2
 */
export const getThreeBezierPoint = (
  t: number,
  p1: [number, number],
  cp1: [number, number],
  cp2: [number, number],
  p2: [number, number]
): [number, number] => {
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
  return [x | 0, y | 0]
}

// 获取范围选中内的组件
export const getSelectedComponent = (componentList: WF.ComponentType[], areaPosi: WF.Attr) => {
  let selectedArea: WF.Attr | null = null
  let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity
  const selectedComponents = componentList.filter((component: WF.ComponentType) => {

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

/**
 * 求点到线段的距离
 * @param {number} pt 直线外的点
 * @param {number} p 直线内的点1
 * @param {number} q 直线内的点2
 * @returns {number} 距离
 */
function getDistance(pt: [number, number], p: [number, number], q: [number, number]) {
  const pqx = q[0] - p[0]
  const pqy = q[1] - p[1]
  let dx = pt[0] - p[0]
  let dy = pt[1] - p[1]
  const d = pqx * pqx + pqy * pqy   // qp线段长度的平方
  let t = pqx * dx + pqy * dy     // p pt向量 点积 pq 向量（p相当于A点，q相当于B点，pt相当于P点）
  if (d > 0) {  // 除数不能为0; 如果为零 t应该也为零。下面计算结果仍然成立。                   
    t /= d      // 此时t 相当于 上述推导中的 r。
  }
  if (t < 0) {  // 当t（r）< 0时，最短距离即为 pt点 和 p点（A点和P点）之间的距离。
    t = 0
  } else if (t > 1) { // 当t（r）> 1时，最短距离即为 pt点 和 q点（B点和P点）之间的距离。
    t = 1
  }

  // t = 0，计算 pt点 和 p点的距离; t = 1, 计算 pt点 和 q点 的距离; 否则计算 pt点 和 投影点 的距离。
  dx = p[0] + t * pqx - pt[0]
  dy = p[1] + t * pqy - pt[1]

  return dx * dx + dy * dy
}

/**
 * 已知四个控制点，及曲线中的某一个点的 x/y，反推求 t
 * @param {number} x1 起点 x/y
 * @param {number} x2 控制点1 x/y
 * @param {number} x3 控制点2 x/y
 * @param {number} x4 终点 x/y
 * @param {number} X 曲线中的某个点 x/y
 * @returns {number[]} t[]
 */
export const getBezierT = (x1: number, x2: number, x3: number, x4: number, X: number) => {
  const a = -x1 + 3 * x2 - 3 * x3 + x4
  const b = 3 * x1 - 6 * x2 + 3 * x3
  const c = -3 * x1 + 3 * x2
  const d = x1 - X

  // 盛金公式, 预先需满足, a !== 0
  // 判别式
  const A = Math.pow(b, 2) - 3 * a * c
  const B = b * c - 9 * a * d
  const C = Math.pow(c, 2) - 3 * b * d
  const delta = Math.pow(B, 2) - 4 * A * C

  let t1 = -100, t2 = -100, t3 = -100

  // 3个相同实数根
  if (A === B && A === 0) {
    t1 = -b / (3 * a)
    t2 = -c / b
    t3 = -3 * d / c
    return [t1, t2, t3]
  }

  // 1个实数根和1对共轭复数根
  if (delta > 0) {
    const v = Math.pow(B, 2) - 4 * A * C
    const xsv = v < 0 ? -1 : 1

    const m1 = A * b + 3 * a * (-B + (v * xsv) ** (1 / 2) * xsv) / 2
    const m2 = A * b + 3 * a * (-B - (v * xsv) ** (1 / 2) * xsv) / 2

    const xs1 = m1 < 0 ? -1 : 1
    const xs2 = m2 < 0 ? -1 : 1

    t1 = (-b - (m1 * xs1) ** (1 / 3) * xs1 - (m2 * xs2) ** (1 / 3) * xs2) / (3 * a)
    // 涉及虚数，可不考虑。i ** 2 = -1
  }

  // 3个实数根
  if (delta === 0) {
    const K = B / A
    t1 = -b / a + K
    t2 = t3 = -K / 2
  }

  // 3个不相等实数根
  if (delta < 0) {
    const xsA = A < 0 ? -1 : 1
    const T = (2 * A * b - 3 * a * B) / (2 * (A * xsA) ** (3 / 2) * xsA)
    const theta = Math.acos(T)

    if (A > 0 && T < 1 && T > -1) {
      t1 = (-b - 2 * A ** (1 / 2) * Math.cos(theta / 3)) / (3 * a)
      t2 = (-b + A ** (1 / 2) * (Math.cos(theta / 3) + 3 ** (1 / 2) * Math.sin(theta / 3))) / (3 * a)
      t3 = (-b + A ** (1 / 2) * (Math.cos(theta / 3) - 3 ** (1 / 2) * Math.sin(theta / 3))) / (3 * a)
    }
  }
  return [t1, t2, t3]
}
