/**
 * 服务配置
 */
import { ServerOptions } from "vite"

export const server: ServerOptions = {
  host: '0.0.0.0',
  port: 9638,
  proxy: {
    // 字符串简写写法
    '/foo': 'http://localhost:4567',
    // 选项写法
    '/api': {
      target: 'http://jsonplaceholder.typicode.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
      configure: (proxy, options) => {
        // proxy 是 'http-proxy' 的实例
      }
    },
    // 正则表达式写法
    '^/fallback/.*': {
      target: 'http://jsonplaceholder.typicode.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/fallback/, '')
    }
  }
}
