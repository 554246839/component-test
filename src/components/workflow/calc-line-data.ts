/**
 * Description: 计算连线数据
 * Created Date: 2022-04-05 18:10:01
 * Author: Kang Dong
 */

import { ComponentType, Direction, Next } from './type'

export const calcLineData = (componentList: ComponentType[]) => {
  const lines: Record<string, any>[] = []
  const hashComponents = changeArray2Obj(componentList)
  componentList.forEach((component: ComponentType) => {
    if (!component.props.next.length) {
      return
    }
    component.props.next.forEach((next: Next) => {
      const targetComponent = hashComponents[next.targetComponentId]
      lines.push({
        startx: getComponentPosition(component, next.directionStart)[0],
        starty: getComponentPosition(component, next.directionStart)[1],
        startDire: next.directionStart,
        destx: getComponentPosition(targetComponent, next.directionEnd)[0],
        desty: getComponentPosition(targetComponent, next.directionEnd)[1],
        destDire: next.directionEnd,
        w: component.attr.w,
        h: component.attr.h,
        dw: targetComponent.attr.w,
        dh: targetComponent.attr.h,
        type: next.lineType,
        id: next.id,
        extra: next.extra
      })
    })
  })
  return lines
}

// 组件列表转换 hash
const changeArray2Obj = (componentList: ComponentType[]) => {
  const result: Record<string, ComponentType> = {}
  componentList.forEach((c: ComponentType) => {
    result[c.id] = c
  })
  return result
}

// 获取组件不同方向对应的坐标值
export const getComponentPosition = (component: ComponentType, direction: Direction) => {
  const { x, y, w, h } = component.attr

  if (direction === 'up') {
    return [x + w / 2, y]
  }

  if (direction === 'down') {
    return [x + w / 2, y + h]
  }

  if (direction === 'left') {
    return [x, y + h / 2]
  }

  if (direction === 'right') {
    return [x + w, y + h / 2]
  }

  return [0, 0]
}
