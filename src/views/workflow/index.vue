<template>
  <workflow
    ref="workflowRef"
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
        @click="print"
      >打印</el-button>
    </template>
    <template #left="{ component }">
      <el-icon class="left-list-icon">
        <Document />
      </el-icon>
      <span>{{ component.label }}</span>
    </template>
    <template #right="{ component }">
      <div class="component-attr-title">{{ component?.label }}</div>
      <el-form label-position="top">
        <el-form-item
          v-for="copProp in component?.props"
          :key="copProp.name"
          :label="copProp.label || copProp.name"
        >
          <el-input
            v-if="copProp.type === 'input'"
            v-model="copProp.value"
            clearable
            v-bind="copProp.props || {}"
          >
          </el-input>
          <el-select
            v-else-if="copProp.type === 'select'"
            v-model="copProp.value"
            clearable
            v-bind="copProp.props || {}"
          >
            <el-option
              v-for="opt in copProp.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </workflow>
</template>

<script lang="ts">
export default {
  name: 'WorkflowPage'
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'
import { Document } from '@element-plus/icons-vue'
import Workflow from '@/components/workflow'
import { commonRequest } from '@/utils/common'

const getActiveComponent = (component: Record<string, any>) => {
  console.log('active component', component)
}

const getActiveLine = (line: Record<string, any>) => {
  console.log('active line', line)
}

const workflowRef = ref<InstanceType<typeof Workflow>>()

const getConfig = () => {
  commonRequest('/workflow/getConfig').then((res: Record<string, any>) => {
    setTimeout(() => {
      workflowRef.value?.setConfig(res.result)
    }, 1000)
  })
}
getConfig()

const getData = () => {
  commonRequest('/workflow/getData').then((res: Record<string, any>) => {
    setTimeout(() => {
      workflowRef.value?.setData(res.result)
    }, 1000)
  })
}
getData()

const print = () => {
  console.log(workflowRef.value?.getData())
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
