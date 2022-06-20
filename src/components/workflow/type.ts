/**
 * Description: 组件数据类型定义
 * Created Date: 2022-04-05 22:13:37
 * Author: Kang Dong
 */

namespace WF {

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
    points: [number, number][]
    centerPoint: [number, number]
    displayName: string
    props?: Record<string, any>
  }

  export interface Next {
    id: string
    targetComponentId: string
    directionStart: Direction
    directionEnd: Direction
    lineType: LineType
    displayName: string
    componentId?: string
    props?: Record<string, any>
  }

  export interface PropItem {
    label?: string
    name: string
    value: string,
    type: 'input' | 'select',
    props?: Record<string, any>
    options?: {
      label: string,
      value: string
    }[]
  }

  export interface ComponentType {
    id: string
    name: string
    attr: Attr
    label: string
    displayName?: string
    className?: string
    next: Next[]
    props: PropItem[]
    events?: Record<string, any>
  }

  interface DrawDirections {
    startx: number
    starty: number
    destx: number
    desty: number
  }

  interface Points extends DrawDirections {
    w: number
    h: number
    dw: number
    dh: number
  }

  export interface CalcType extends Points {
    startDire: Direction
    destDire?: Direction
    type?: LineType
  }

  export interface CalcBezierType extends DrawDirections {
    startDire: Direction
    destDire?: Direction
    type?: LineType
  }

  export interface DrawLineType {
    ctx: CanvasRenderingContext2D
    points: [number, number][]
  }

  export interface AllType extends CalcType {
    ctx: CanvasRenderingContext2D
    type: LineType
    id?: string
    displayName?: string
    props?: Record<string, any>
  }

  export interface EditingLineInfo {
    id: string
    text: string
    point: [number, number]
  }

}

export default WF
