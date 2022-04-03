/**
 * 动态页面公共api
 */
import HTTP from '../../http'

/**
 * 保存
 */
export function apiSave(params?: any) {
  return HTTP.$post(`/save/${params.id}`, params)
}

/**
 * 获取动态页面配置Json,以及相关配置
 */
export function apiGetDetail(id: string) {
  return HTTP.$get('/getDetail', { id })
}

/**
 * 获取新增动态页面初始化配置
 */
export function apiAddInit() {
  return HTTP.$get('/add/init', {})
}
