
import { defineComponent } from 'vue'
import { createComponent, unmountComponent } from '@/components/component'
import DpDialogVue from './index.vue'

const dialogBoxConstructor = defineComponent(<any>DpDialogVue)

let instance: any

const showDpDialog = (options: any) => {

  instance = createComponent(dialogBoxConstructor, options, null)

  document.body.appendChild(instance.vnode.el)
}

export const DpDialogService = function (options: any) {
  showDpDialog({
    onClose: () => {
      setTimeout(() => {
        unmountComponent(instance)
      }, 500)
    }, ...options
  })
}
