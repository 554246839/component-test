import { App } from 'vue'
import EpDynamicRender from './index.vue'

EpDynamicRender.install = function dynamicRenderInstall(app: App) {
  app.component(EpDynamicRender.name, EpDynamicRender)
}

export default EpDynamicRender
