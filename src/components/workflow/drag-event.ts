/**
 * Description: 拖拽事件
 * Created Date: 2022-03-30 21:39:00
 * Author: Kang Dong
 */

import WF from './type'
import { getUUID } from './utils'

export const dragstart = (e: DragEvent, index: number) => {
  e.dataTransfer?.setData('index', String(index))
}

export const dragover = (e: DragEvent) => {
  e.preventDefault()
}

export const drop = (e: DragEvent, componentList: WF.ComponentType[], componentRenderList: WF.ComponentType[]) => {
  const index = +(e.dataTransfer?.getData('index') || 0)

  if ((e.target as HTMLElement).dataset.type !== 'container') {
    return
  }

  const activeComponent: WF.ComponentType = JSON.parse(JSON.stringify(componentList[index]))
  activeComponent.attr.x = e.offsetX
  activeComponent.attr.y = e.offsetY
  activeComponent.id = getUUID()
  activeComponent.next = []
  componentRenderList.push(activeComponent)
}
