<template>
  <!-- v-if="processId" -->
  <workflow
    ref="workflowRef"
    main-height="calc(100vh - 65px)"
    @component-change="getActiveComponent"
    @line-change="getActiveLine"
  >
    <template #btn>
      <el-button
        size="small"
        @click="downloadConfig"
      >下载</el-button>
      <el-button
        size="small"
        @click="saveConfig"
      >保存</el-button>
    </template>
    <!-- <template #left="{ component }">
      <el-icon class="left-list-icon" :size="20">
        <Document />
      </el-icon>
      <span>{{ component.label }}</span>
    </template>
    <template #right="{ properties, title }">
      <div class="component-attr-title">{{ title }}</div>
      <el-form label-position="top">
        <el-form-item v-for="copProp in properties" :key="copProp.name" :label="copProp.label || copProp.name">
          <el-input v-if="copProp.type === 'input'" v-model="copProp.value" clearable v-bind="copProp.props || {}">
          </el-input>
          <el-select v-else-if="copProp.type === 'select'" v-model="copProp.value" clearable
            v-bind="copProp.props || {}">
            <el-option v-for="opt in copProp.options" :key="opt.value" :label="opt.label" :value="opt.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template> -->
  </workflow>
  <!-- <el-empty v-else></el-empty> -->
</template>

<script lang="ts">
export default {
  name: 'WorkflowConfig'
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'
import Workflow from '@/components/workflow'
import { commonRequest } from '@/utils/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'

const route = useRoute()

const processId = route.query.processId // || 'testca08c433c34046e4bb2a8d3ce3ebc'
const getActiveComponent = (component: Record<string, any>) => {
  console.log('active component', component)
}

const getActiveLine = (line: Record<string, any>) => {
  console.log('active line', line)
}

const workflowRef = ref<InstanceType<typeof Workflow>>()

const getConfig = () => {
  commonRequest('/workflow/getConfig').then((res: Record<string, any>) => {
    // 需要把所有的属性根据name转换成 key - value 形式
    const props: Record<string, any> = {}
    transferOptions(res.result.nodes, props)
    workflowRef.value?.setConfig(res.result)
    getData(props)
  })
}
const getData = (props: Record<string, any>) => {
  commonRequest('/workflow/getData').then((res: Record<string, any>) => {
    // 调整属性
    adjustProps(props, res.result.processJson)
    workflowRef.value?.setData(res.result.processJson, res.result.type || 'add')
  })
}

const init = () => {
  // if (!processId) {
  //   ElMessageBox.alert('当前没有流程id')
  //   return
  // }
  getConfig()
}
init()

const saveConfig = () => {
  commonRequest('/workflow/saveData', {
    id: processId,
    processJson: JSON.stringify(workflowRef.value?.getData())
  }, 'post').then(() => {
    ElMessage.success({
      message: '保存成功',
      showClose: true
    })
  })
}

const downloadConfig = () => {
  const dp = workflowRef.value?.getData()
  const str = JSON.stringify(dp, null, 2)
  const blob = new Blob([str])
  if ('download' in document.createElement('a')) { // 非IE下载
    const elink = document.createElement('a')
    elink.download = 'config.txt'
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL对象
    elink.remove()
  }
}

const transferOptions = (nodes: Record<string, any>[], props: Record<string, any>) => {
  nodes?.forEach((node: Record<string, any>) => {
    props[node.name] = node.props
  })
}

const adjustProps = (props: Record<string, any>, nodes: Record<string, any>[]) => {
  nodes.forEach((node: Record<string, any>) => {
    const oldProp: Record<string, any>[] = node.props
    const res = transferKV(oldProp)
    node.props = JSON.parse(JSON.stringify(props[node.name]))
    node.props.forEach((prop: Record<string, any>) => {
      prop.value = res[prop.name]
    })
  })
}

const transferKV = (props: Record<string, any>[]) => {
  const res: Record<string, any> = {}
  props.forEach((prop: Record<string, any>) => {
    res[prop.name] = prop.value
  })
  return res
}

</script>

<style lang="scss">
// 开始
.icon-circle {
  border-radius: 50%;
  border: none;

  &.start {
    background: radial-gradient(circle at 70px 70px, #00B289, #eee);
  }

  &.end {
    background: radial-gradient(circle at 70px 70px, #FE6752, #eee);
  }
}
</style>
