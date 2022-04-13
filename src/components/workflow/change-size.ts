/**
 * Description: 调整组件的大小
 * Created Date: 2022-03-31 10:24:27
 * Author: Kang Dong
 */

import WF from './type'

export default function changeComponentSize(
  e: MouseEvent,
  component: WF.ComponentType,
  direction: 'lu' | 'ru' | 'rd' | 'ld',
  pagex: number,
  pagey: number,
  cacheAttr: WF.Attr,
  areaPoint: WF.Attr | undefined = undefined,
  areaPointCacheAttr?: WF.Attr
) {
  if (!component) {
    return
  }

  // 右下角改变宽、高
  if (direction === 'rd') {
    component.attr.w = Math.max(0, cacheAttr.w + e.pageX - pagex)
    component.attr.h = Math.max(0, cacheAttr.h + e.pageY - pagey)
    if (areaPoint && areaPointCacheAttr) { // 范围选择操作
      areaPoint.w = Math.max(0, areaPointCacheAttr.w + e.pageX - pagex)
      areaPoint.h = Math.max(0, areaPointCacheAttr.h + e.pageY - pagey)
    }
  }

  // 右上角改变宽、高、top
  if (direction === 'ru') {
    component.attr.w = Math.max(0, cacheAttr.w + e.pageX - pagex)
    component.attr.h = Math.max(0, cacheAttr.h + pagey - e.pageY)
    component.attr.y = Math.min(cacheAttr.y + cacheAttr.h, cacheAttr.y + e.pageY - pagey)
    if (areaPoint && areaPointCacheAttr) { // 范围选择操作
      areaPoint.w = Math.max(0, areaPointCacheAttr.w + e.pageX - pagex)
      areaPoint.h = Math.max(0, areaPointCacheAttr.h + pagey - e.pageY)
      areaPoint.y = Math.min(areaPointCacheAttr.y + areaPointCacheAttr.h, areaPointCacheAttr.y + e.pageY - pagey)
    }
  }

  // 左下角改变宽、高、left
  if (direction === 'ld') {
    component.attr.w = Math.max(0, cacheAttr.w + pagex - e.pageX)
    component.attr.h = Math.max(0, cacheAttr.h + e.pageY - pagey)
    component.attr.x = Math.min(cacheAttr.x + cacheAttr.w, cacheAttr.x + e.pageX - pagex)
    if (areaPoint && areaPointCacheAttr) { // 范围选择操作
      areaPoint.w = Math.max(0, areaPointCacheAttr.w + pagex - e.pageX)
      areaPoint.h = Math.max(0, areaPointCacheAttr.h + e.pageY - pagey)
      areaPoint.x = Math.min(areaPointCacheAttr.x + areaPointCacheAttr.w, areaPointCacheAttr.x + e.pageX - pagex)
    }
  }

  // 左上角改变宽、高、left、top
  if (direction === 'lu') {
    component.attr.w = Math.max(0, cacheAttr.w + pagex - e.pageX)
    component.attr.h = Math.max(0, cacheAttr.h + pagey - e.pageY)
    component.attr.x = Math.min(cacheAttr.x + cacheAttr.w, cacheAttr.x + e.pageX - pagex)
    component.attr.y = Math.min(cacheAttr.y + cacheAttr.h, cacheAttr.y + e.pageY - pagey)
    if (areaPoint && areaPointCacheAttr) { // 范围选择操作
      areaPoint.w = Math.max(0, areaPointCacheAttr.w + pagex - e.pageX)
      areaPoint.h = Math.max(0, areaPointCacheAttr.h + pagey - e.pageY)
      areaPoint.x = Math.min(areaPointCacheAttr.x + areaPointCacheAttr.w, areaPointCacheAttr.x + e.pageX - pagex)
      areaPoint.y = Math.min(areaPointCacheAttr.y + areaPointCacheAttr.h, areaPointCacheAttr.y + e.pageY - pagey)
    }
  }
}

// 选择区域选择
export const changeAreaSize = (
  e: MouseEvent,
  pagex: number,
  pagey: number,
  areaPosi: WF.Attr,
  cacheAttr: WF.Attr
) => {
  const w = e.pageX - pagex
  const h = e.pageY - pagey

  areaPosi.w = Math.abs(w)
  areaPosi.h = Math.abs(h)

  areaPosi.x = cacheAttr.x + Math.min(0, w)
  areaPosi.y = cacheAttr.y + Math.min(0, h)
}
