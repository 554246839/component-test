/**
 * 公共函数
 */

import { ElMessage, ElMessageBox } from 'element-plus'

// 获取 UUID
export const getUUID = (pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx') => {
  return pattern.replace(/[xy]/g, (c: string) => {
    const r: number = Math.random() * 16 | 0
    const v: number = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 解析style
// example
/**
 * font-size: 20px;
 * margin: 10px 20px;
 * z-index: 1000;
 */
export const parseStyle = (style: string) => {
  if (typeof style !== 'string') {
    return {}
  }
  const sty: Record<string, string> = {}
  style.replace(/([a-zA-Z0-9_-]+?)\s*:\s*(.+?)\s*;/g, (a: string, $1: string, $2: string) => {
    sty[$1] = $2
    return a
  })
  return sty
}

// table列的数据格式化
/**
 * 百分比
 * 千位符
 * 四舍五入
 * 保留两位小数(默认四舍五入)
 * 四舍五入 + 千位符
 * 保留两位小数 + 百分比
 */
export const columnFormatList = [
  {
    label: '日期格式',
    value: 'date'
  },
  {
    label: '百分比',
    value: 'percentage'
  },
  {
    label: '千位符',
    value: 'thousandth'
  },
  {
    label: '四舍五入',
    value: 'round'
  },
  {
    label: '保留两位小数',
    value: 'reserveTwo'
  },
  {
    label: '四舍五入 + 千位符',
    value: 'roundThousandth'
  },
  {
    label: '保留两位小数 + 百分比',
    value: 'reserveTwoPer'
  }
]

// 递归替换所有组件的id
export const changeTempId = (temp: Record<string, any>) => {
  temp.id = getUUID()
  temp.buttons?.forEach((btn: Record<string, any>) => {
    btn.id = getUUID()
  })
  temp.children?.forEach((tep: Record<string, any>) => {
    tep.id = getUUID()
    changeTempId(tep)
  })
}

/**
 * 初始化多语言配置
 * 该操作会把各组件内的prop值复制给i18n字段
 * @param dp 页面配置
 */
export const initI18nConfig = (dp: Record<string, any>) => {
  ElMessageBox.confirm('初始化自动配置有可能会覆盖之前的设置！', '提示', {
    type: 'warning',
    draggable: true
  }).then(() => {
    // dialogTemplate
    dp.dialogTemplate?.forEach((dialog: Record<string, any>) => {
      recursion(dialog)
    })
    // search
    recursion(dp.search)
    // table
    recursion(dp.table)

    console.log(dp)
    ElMessage.success({
      message: '多语言初始化配置完成',
      showClose: true
    })
  })
}
const recursion = (config: Record<string, any>) => {
  if (config.properties?.prop) {
    config.properties.i18n = config.properties.prop
  }
  // buttons
  config.buttons?.forEach((btn: Record<string, any>) => {
    recursion(btn)
  })
  // children
  config.children?.forEach((child: Record<string, any>) => {
    recursion(child)
  })
}

// 下载
export const downloadJson = (dp: Record<string, any>) => {
  console.log(dp)
  const str = JSON.stringify(dp, null, 2)
  const blob = new Blob([str])
  if ('download' in document.createElement('a')) { // 非IE下载
    const elink = document.createElement('a')
    elink.download = dp.properties.title + '.txt'
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL对象
    elink.remove()
  }
}
