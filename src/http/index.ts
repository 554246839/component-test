/**
 * 项目请求封装文件
 */
import instance, { Axios } from './httpConfig'

class HTTP {
  static $get(
    url: string, params: Record<string, any> = {}, headers: Record<string, any> = {}, isLoading = true
  ) {
    instance.defaults.isLoading = isLoading

    return instance.get(url, { params, headers })
  }
  static $post(
    url: string, params: Record<string, any> = {}, headers: Record<string, any> = {}, isLoading = true
  ) {
    instance.defaults.isLoading = isLoading

    return instance.post(url, params, { headers })
  }
  static $delete(
    url: string, params: Record<string, any> = {}, headers: Record<string, any> = {}, isLoading = true
  ) {
    instance.defaults.isLoading = isLoading

    return instance.delete(url, { params, headers })
  }
}

export { instance, Axios }

export default HTTP
