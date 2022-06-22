/**
 * Description: 图片预览
 * Created Date: 2022-06-22 18:21:56
 * Author: Kang Dong
 */
import type { Directive } from 'vue'
import { previewService } from './preview'

function handleClick(el: HTMLImageElement, src: string) {
  // 调用弹窗显示预览图片
  previewService({
    el, src
  })
}

let bindingFunction: () => void

const preview: Directive<HTMLImageElement> = {
  // 在绑定元素的父组件挂载之前调用
  beforeMount(el, binding) {
    bindingFunction = handleClick.bind(null, el, binding.value || el.src)
    el.addEventListener('click', bindingFunction)
  },
  // 在绑定元素的父组件卸载之前调用
  beforeUnmount(el) {
    el.removeEventListener('click', bindingFunction)
  }
}

export default preview
