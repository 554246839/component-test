/**
 * Description: 公共方法库
 * Created Date: 2022-03-30 22:11:38
 * Author: Kang Dong
 */

import { ComponentType } from './component-list'

export const getUUID = (pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx') => {
  return pattern.replace(/[xy]/g, (c: string) => {
    const r: number = Math.random() * 16 | 0
    const v: number = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
