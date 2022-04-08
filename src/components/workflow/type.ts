/**
 * Description: 组件数据类型定义
 * Created Date: 2022-04-05 22:13:37
 * Author: Kang Dong
 */

export interface Attr {
  x: number
  y: number
  w: number
  h: number
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export type Quadrant = 'lu' | 'ru' | 'rd' | 'ld'

export type LineType = 'broken' | 'bezier' | 'straight'

export interface LineInfo {
  id?: string
  type: LineType
  points: number[][]
  centerPoint: number[]
  extra: string
}

export interface Next {
  id: string
  targetComponentId: string
  directionStart: Direction
  directionEnd: Direction
  lineType: LineType
  extra: string
}

export interface ComponentType {
  id: string
  name: string
  attr: Attr
  label: string
  props: {
    next: Next[]
  }
}

interface Points {
  w: number
  h: number
  dw: number
  dh: number
  startx: number
  starty: number
  destx: number
  desty: number
}

export interface CalcType extends Points {
  startDire: Direction
  destDire?: Direction
  type?: LineType
}

export interface DrawLineType {
  ctx: CanvasRenderingContext2D
  points: number[][]
}

export interface AllType extends CalcType {
  ctx: CanvasRenderingContext2D
  type: LineType
  id?: string
  extra?: string
}

export interface EditingLineInfo {
  id: string
  text: string
  point: number[]
}
