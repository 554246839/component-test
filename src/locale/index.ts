import { createI18n } from 'vue-i18n'

import EnMessage from './en'
import CnMessage from './zh-cn'
import HkMessage from './zh-hk'

const messages: Record<string, any> = {
  'en': EnMessage,
  'zh-cn': CnMessage,
  'zh-tw': HkMessage
}

const map: Record<string, string> = {
  'zh-CN': 'zh-cn',
  'zh-HK': 'zh-tw',
  'en-US': 'en',
}

const langtype = window.localStorage.getItem('headerLang')
const localeType = map[langtype || 'zh-CN'] || langtype
let i18n: any = null, hasLoadLang = false

export default function setupI18n() {
  if (i18n) {
    return i18n
  }
  i18n = createI18n({
    locale: localeType as string,
    fallbackLocale: map['en-US'],
    messages
  })

  window._i18n = i18n
  return i18n
}

export function loadLocaleMessages(gbl: any, globalI18n: Record<string, any>) {
  if (hasLoadLang) {
    return
  }
  hasLoadLang = true
  // set locale and locale message
  const preConfig = gbl.getLocaleMessage(localeType)
  // console.log(preConfig, 'preconfig')
  // console.log(globalI18n.getLocaleMessage(localeType))
  gbl.setLocaleMessage(localeType, { ...preConfig, ...globalI18n.getLocaleMessage(localeType) })
}

