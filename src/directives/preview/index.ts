
import { defineComponent } from 'vue'
import { createComponent, unmountComponent } from '@/components/component'
import PreviewVue from './index.vue'

const dialogBoxConstructor = defineComponent(<any>PreviewVue)

let instance: any

const showPreview = (options: any) => {

  instance = createComponent(dialogBoxConstructor, options, null)

  document.body.appendChild(instance.vnode.el)
}

export const previewService = function (options: any) {
  showPreview({
    onClose: () => {
      unmountComponent(instance)
    }, ...options
  })
}
