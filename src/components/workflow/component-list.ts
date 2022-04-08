/**
 * Description: 组件列表的属性及类型定义
 * Created Date: 2022-03-30 21:14:04
 * Author: Kang Dong
 */

import { ComponentType } from './type'

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
