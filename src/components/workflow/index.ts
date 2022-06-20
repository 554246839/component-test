import type { App } from 'vue'
import Workflow from './index.vue'

(Workflow as any).install = function WorkflowInstall(app: App) {
  app.component(Workflow.name, Workflow)
}

export default Workflow
