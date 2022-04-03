import { ElMessage, ElMessageBox } from 'element-plus'
import { DpDialogService } from './component/dp-dialog'
import setupI18n from '../../locale'

import globalMap from './global-map'
let router: any = null
let commonRequest = globalMap.get('request')
let t: (_v: string) => string

interface ButtonParams {
  params?: Record<string, any>
  callback?: () => void
}

export const btnClick = (btn: Record<string, any>, data: ButtonParams, pageId: string) => {
  if (!router) {
    router = globalMap.get('useRouter')
  }
  if (!commonRequest) {
    commonRequest = globalMap.get('request')
  }
  return new Promise((res: (_v?: any) => void) => {
    if (btn.type === 'dialog') {  // dialog
      const dialogMap = globalMap.get(pageId).dialogMap
      if (dialogMap) {
        DpDialogService({ ...dialogMap.get(btn.dialogTemplateId), params: data.params, pageId, callback: data.callback })
      }
      res()
      return
    }
    const row = data.params && data.params._row
    if (data.params) {
      delete data.params._row
    }
    if (btn.type === 'confirm') { // confirm
      ElMessageBox.confirm($tr(
        btn, pageId, 'message', 'i18nMsg'
      ), $tr(
        btn, pageId, 'title', 'i18nTitle'
      ), {
        type: 'warning',
        draggable: true
      }).then(() => {
        const { url, params } = getApiInfo(
          btn.api, btn.requestParams, row, pageId
        )
        if (url) {
          commonRequest(url, { ...data.params, ...params }, btn.requestType).then((ret: any = {}) => {
            data.callback && data.callback()
            res(ret.result)
          })
        }
      })
    } else if (btn.type === 'link') { // link
      const route = getApiInfo(
        btn.url, '', row, pageId
      )
      if (btn.api) {
        const { url, params } = getApiInfo(
          btn.api, btn.requestParams, row, pageId
        )
        if (url) {
          commonRequest(url, { ...data.params, ...params }, btn.requestType).then((ret: any = {}) => {
            res(ret.result)
            if (route.url) {
              if (btn.externalLink) {
                openNewTab(route.url)
              } else {
                router.push(route.url)
              }
            }
          })
        }
      } else {
        if (route.url) {
          if (btn.externalLink) {
            openNewTab(route.url)
          } else {
            router.push(route.url)
          }
        }
        res()
      }
    } else if (btn.type === 'none') { // none
      const { url, params } = getApiInfo(
        btn.api, btn.requestParams, row, pageId
      )
      if (url) {
        commonRequest(url, { ...data.params, ...params }, btn.requestType).then((ret: any = {}) => {
          data.callback && data.callback()
          res(ret.result)
        })
      }
    } else if (btn.type === 'download') {
      const { url, params } = getApiInfo(
        btn.api, btn.requestParams, row, pageId
      )
      const urlParams = []
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          urlParams.push(`${key}=${params[key]}`)
        }
      }
      if (data.params && data.params.ids && data.params.ids.length) {
        urlParams.push(`ids=${data.params.ids.join(',')}`)
      }
      let result = ''
      if (urlParams.length) {
        result = '?' + urlParams.join('&')
      }
      if (url) {
        window.open(url + result)
      }
    }
  })
}

// 获取自定义函数主体
export const getFunctionBody = (str: string) => {
  let start = 0, end = 0
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '{') {
      start = i + 1
      break
    }
  }
  for (let i = str.length - 1; i >= 0; i--) {
    if (str[i] === '}') {
      end = i
      break
    }
  }
  if (start > end) {
    ElMessage({
      showClose: true,
      message: '自定义函数解析错误！',
      type: 'error'
    })
    return
  }
  const body = str.substring(start, end)

  if (!body.includes('return')) {
    return
  }
  return body
}

// 获取请求信息，占位符替换
export const getApiInfo = (
  url = '',
  params = '',
  vals: Record<string, any> = {},
  pageId: string
) => {
  const globalParams = globalMap.get(pageId)
  const p = {
    ...vals,
    ...globalParams.global,
    ...globalParams.searchData
  }

  const newUrl = url.replace(/\{(.*?)\}/g, (a: string, b: string) => {
    return Object.prototype.hasOwnProperty.call(p, b) ? p[b] : a
  })
  const newParams = params.replace(/\{(.*?)\}/g, (a: string, b: string) => {
    return Object.prototype.hasOwnProperty.call(p, b) ? p[b] : a
  })
  const obj: Record<string, string> = {}
  newParams.replace(/([a-zA-Z0-9]+?)=(.*?)(&|$)/g, (a: string, b: string, c: string) => {
    obj[b] = c
    return a
  })

  return {
    url: newUrl,
    params: obj
  }
}

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

// 数组转hash
export const array2Obj = (origin: { label: string, value: string }[]) => {
  const obj: Record<string, string> = {}
  if (!origin) {
    return obj
  }
  for (const val of origin) {
    obj[val.value] = val.label
  }
  return obj
}

// table列的数据格式化方法
export const columnFormat = {
  // 日期时间格式化
  date: (date: string | Date, fmt = 'YYYY-MM-DD hh:mm:ss') => {
    if (typeof date === 'string') {
      date = new Date(date)
    }
    if (Object.prototype.toString.call(date).slice(8, -1) !== 'Date') {
      return date
    }
    const o: any = {
      'Y+': date.getFullYear(),       // 年份
      'M+': date.getMonth() + 1,      // 月份 
      'D+': date.getDate(),           // 日 
      'h+': date.getHours(),          // 小时 
      'm+': date.getMinutes(),        // 分 
      's+': date.getSeconds(),        // 秒 
      'q+': ((date.getMonth() + 3) / 3) | 0, // 季度 
      'S': date.getMilliseconds()     // 毫秒 
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (a: string, b: number) => {

          if (b !== 0 && String(o[k]).length < 2 && a.length === 2) {
            return `0${o[k]}`
          }

          return o[k]
        })
      }
    }
    return fmt
  },
  // 千位符
  thousandth: (val: string | number) => {
    if (isNaN(+val)) {
      return val
    }
    return (+val).toLocaleString()
  },
  // 百分比
  percentage: (val: string | number, num = 100) => {
    if (isNaN(+val)) {
      return val
    }
    return +val * num + '%'
  },
  // 四舍五入
  round: (val: string | number) => {
    if (isNaN(+val)) {
      return val
    }
    return Math.round(+val)
  },
  // 保留两位小数(默认四舍五入)
  reserveTwo: (val: string | number) => {
    if (isNaN(+val)) {
      return val
    }
    return (Math.round(+val * 100) / 100).toFixed(2)
  },
  // 四舍五入 + 千位符
  roundThousandth: (val: string | number) => {
    if (isNaN(+val)) {
      return val
    }
    return columnFormat.thousandth(Math.round(+val))
  },
  // 保留两位小数 + 百分比
  reserveTwoPer: (val: string | number) => {
    if (isNaN(+val)) {
      return val
    }
    return (Math.round(+val * 10000) / 100).toFixed(2) + '%'
  }
}

// 判断日期的可选范围
export const setDisabledDate = (field: Record<string, any>, model: Record<string, any>, date: Date) => {
  if (!field.useDisabled) {
    return false
  }
  // 判断是否设置了开始禁止日期
  if (field.startDisabled) {
    // 判断是否为有效日期
    if (isNaN((new Date(field.startDisabled)) as any)) {
      if (model[field.startDisabled] && date < new Date(model[field.startDisabled])) {
        return true
      }
    } else if (date < new Date(field.startDisabled)) {
      return true
    }
  }
  // 判断是否设置了结束禁止日期
  if (field.endDisabled) {
    // 判断是否为有效日期
    if (isNaN((new Date(field.endDisabled)) as any)) {
      if (model[field.endDisabled] && date > new Date(model[field.endDisabled])) {
        return true
      }
    } else if (date > new Date(field.endDisabled)) {
      return true
    }
  }
  return false
}

// 多语言
export const $tr = (
  props: Record<string, any> | string, pageId = '', label = 'label', prop = 'i18n'
) => {
  if (!t) {
    t = setupI18n().global.t
  }
  if (typeof props === 'string') {
    return t(props)
  }
  const langCode = pageId && globalMap.get(pageId).global.langCode
  if (props[prop] && langCode) {
    return t(`${langCode}.${props[prop]}`)
  }
  return props[label]
}

// 新开线程跳转新窗口链接
const openNewTab = (url: string) => {
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
