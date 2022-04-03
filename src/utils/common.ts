import HTTP from '@/http'

const commonFn = {
  // 扩展eycf的isEmpty方法
  // isEmpty(val: any) {
  //   if (val === 0) {
  //     return false
  //   }
  //   return eycf.isEmpty.call(null, val)
  // }
}

export const commonRequest = (url: string, params: Record<string, any> = {}, type: 'post' | 'get' = 'get') => {
  return (HTTP as any)[`$${type}`](url, params)
}


export default commonFn
