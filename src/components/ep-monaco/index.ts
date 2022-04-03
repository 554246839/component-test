import { App } from 'vue'
import EpMonaco from './index.vue'

EpMonaco.install = function EpMonacoInstall(app: App) {
  app.component(EpMonaco.name, EpMonaco)
}

export default EpMonaco
