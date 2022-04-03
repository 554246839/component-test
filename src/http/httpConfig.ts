/**
 * 请求方法配置
 */

import Axios, { AxiosResponse, AxiosRequestConfig, AxiosInstance } from 'axios'
import config from '@/constant/configs'

import { ElMessage, ElLoading } from 'element-plus'

let isLoading: any = false
let requestCnt = 0

interface _config extends AxiosRequestConfig {
  isLoading: boolean
}

interface AxiosIns extends AxiosInstance {
  defaults: _config
}

const instance: AxiosIns = Axios.create({
  baseURL: config.baseUrl,
  timeout: config.timeout
}) as AxiosIns

// 添加请求拦截器
instance.interceptors.request.use((config: AxiosRequestConfig) => {
  requestCnt++
  if (!isLoading && (config as _config).isLoading) {
    isLoading = ElLoading.service()
  }

  return config
}, (error: any) => {
  console.log(error, 'request')
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use((response: AxiosResponse<any>) => {
  if (--requestCnt === 0 && isLoading) {
    isLoading.close()
    isLoading = null
  }
  if (response?.data?.status !== 200) {
    ElMessage.error('接口数据错误: ' + response?.data?.msg)
    throw new Error('接口数据错误: ' + response?.data?.msg)
  }
  return response.data
}, (error: any) => {
  try {
    if (!error.response) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error(error.response.data.msg)
    }
  } catch (e) {
    ElMessage.error('网络错误')
    console.error(e)
  }
  if (--requestCnt === 0 && isLoading) {
    isLoading.close()
    isLoading = null
  }
  return Promise.reject(error.response)
})

export default instance

export { Axios }
