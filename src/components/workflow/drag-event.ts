/**
 * Description: 拖拽事件
 * Created Date: 2022-03-30 21:39:00
 * Author: Kang Dong
 */

import componentList, { ComponentType } from './component-list'
import { getUUID } from './utils'

export const dragstart = (e: DragEvent, index: number) => {
  e.dataTransfer?.setData('index', String(index))
}

export const dragover = (e: DragEvent) => {
  e.preventDefault()
}

export const drop = (e: DragEvent, componentRenderList: ComponentType[]) => {
  const index = +(e.dataTransfer?.getData('index') || 0)

  if ((e.target as HTMLElement).dataset.type !== 'container') {
    return
  }

  const activeComponent: ComponentType = JSON.parse(JSON.stringify(componentList[index]))
  activeComponent.attr.x = e.offsetX
  activeComponent.attr.y = e.offsetY
  activeComponent.id = getUUID()
  componentRenderList.push(activeComponent)
}
