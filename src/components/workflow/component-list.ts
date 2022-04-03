/**
 * Description: 组件列表的属性及类型定义
 * Created Date: 2022-03-30 21:14:04
 * Author: Kang Dong
 */

export interface Attr {
  x: number
  y: number
  w: number
  h: number
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface Next {
  id: string
  directionStart: Direction
  directionEnd: Direction
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

export interface CanvasLineType {
  id: string
  startx: number
  starty: number
  endx: number
  endy: number
  w: number
  h: number
  left: number
  top: number
}

const componentList: ComponentType[] = [
  {
    id: '',
    name: 'div',
    attr: {
      x: 0,
      y: 0,
      w: 100,
      h: 50
    },
    label: '开始',
    props: {
      next: []
    }
  },
  {
    id: '',
    name: 'div',
    attr: {
      x: 0,
      y: 0,
      w: 100,
      h: 50
    },
    label: '结束',
    props: {
      next: []
    }
  },
  {
    id: '',
    name: 'div',
    attr: {
      x: 0,
      y: 0,
      w: 100,
      h: 100
    },
    label: '分支',
    props: {
      next: []
    }
  },
  {
    id: '',
    name: 'div',
    attr: {
      x: 0,
      y: 0,
      w: 100,
      h: 100
    },
    label: '合并',
    props: {
      next: []
    }
  }
]

export default componentList
