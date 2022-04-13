/**
 * Description: 吸附相关运算逻辑
 * Created Date: 2022-04-07 17:17:37
 * Author: Kang Dong
 */

import WF from './type'

// 先将所有的组件的四条边的坐标算出来，缓存起来
// 在移动组件的时候，去匹配缓存下来的坐标集合
// 在可吸附距离内，将移动组件自动对齐，并显示全局的对齐线条

export const clearupPostions = (componentList: WF.ComponentType[], currId: string) => {
  // x 坐标集合
  const coordx = new Set<number>()
  // y 坐标集合
  const coordy = new Set<number>()

  componentList.forEach((component: WF.ComponentType) => {
    if (component.id === currId) {
      return
    }
    const { x, y, w, h } = component.attr
    coordx.add(x)
    coordx.add(x + (w >> 1))
    coordx.add(x + w)
    coordy.add(y)
    coordy.add(y + (h >> 1))
    coordy.add(y + h)
  })

  return [coordx, coordy]
}

// 可吸附范围
const ADSORBRANGE = 2
// 查询是否有可吸附坐标
const hasAdsorbable = (
  coords: Set<number>[], x: number, y: number, w: number, h: number
) => {
  // x, y, w, h, w/2, h/2
  const coord: (number | null)[] = [null, null, null, null, null, null]
  // 查询 x 坐标
  for (let i = 0; i <= ADSORBRANGE; i++) {
    if (coords[0].has(x + i)) {
      coord[0] = i
      break
    }
    if (coords[0].has(x - i)) {
      coord[0] = -i
      break
    }
  }

  // 查询 y 坐标
  for (let i = 0; i <= ADSORBRANGE; i++) {
    if (coords[1].has(y + i)) {
      coord[1] = i
      break
    }
    if (coords[1].has(y - i)) {
      coord[1] = -i
      break
    }
  }

  // 查询 x + w 坐标
  for (let i = 0; i <= ADSORBRANGE; i++) {
    if (coords[0].has(x + w + i)) {
      coord[2] = i
      break
    }
    if (coords[0].has(x + w - i)) {
      coord[2] = -i
      break
    }
  }

  // 查询 y + h 坐标
  for (let i = 0; i <= ADSORBRANGE; i++) {
    if (coords[1].has(y + h + i)) {
      coord[3] = i
      break
    }
    if (coords[1].has(y + h - i)) {
      coord[3] = -i
      break
    }
  }

  // 查询 x + w/2 坐标
  for (let i = 0; i <= ADSORBRANGE; i++) {
    if (coords[0].has(x + (w >> 1) + i)) {
      coord[4] = i
      break
    }
    if (coords[0].has(x + (w >> 1) - i)) {
      coord[4] = -i
      break
    }
  }

  // 查询 y + h/2 坐标
  for (let i = 0; i <= ADSORBRANGE; i++) {
    if (coords[1].has(y + (h >> 1) + i)) {
      coord[5] = i
      break
    }
    if (coords[1].has(y + (h >> 1) - i)) {
      coord[5] = -i
      break
    }
  }

  return coord
}

// 获取修正后的 x, y，还有吸附线的状态
export const getAdsordXY = (
  coords: Set<number>[], x: number, y: number, w: number, h: number
) => {
  const vals = hasAdsorbable(
    coords, x, y, w, h
  )

  let linex = null
  let liney = null

  if (vals[0] !== null) { // x
    x += vals[0]
    linex = x
  } else if (vals[2] !== null) { // x + w
    x += vals[2]
    linex = x + w
  } else if (vals[4] !== null) { // x + w/2
    x += vals[4]
    linex = x + (w >> 1)
  }

  if (vals[1] !== null) { // y
    y += vals[1]
    liney = y
  } else if (vals[3] !== null) { // y + h
    y += vals[3]
    liney = y + h
  } else if (vals[5] !== null) { // y + h/2
    y += vals[5]
    liney = y + (h >> 1)
  }

  return {
    x, y, linex, liney
  }
}
