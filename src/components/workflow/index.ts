import type { App } from 'vue'
import Workflow from './index.vue'

Workflow.install = function WorkflowInstall(app: App) {
  app.component(Workflow.name, Workflow)
}

export default Workflow
