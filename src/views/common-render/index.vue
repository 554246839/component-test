<template>
  <dynamic-render
    ref="dynamicRef"
    :data="fakeData"
    :page-id="pageId"
    :page-code="pageCode"
    :init-data-info="initRequestInfo"
    :request="commonRequest"
  >
    <!-- table上方自定义按钮 -->
    <!-- <template #table-up-btns>
      <el-button size="small" @click="custom">自定义</el-button>
      <el-button size="small" @click="refreshTable">刷新table</el-button>
    </template>-->
    <!-- table操作列自定义按钮 -->
    <!-- <template #column-opreate-btns="prop">
      <el-button size="small" @click="print(props)">自定义1</el-button>
    </template>-->
  </dynamic-render>
</template>

<script lang="ts">
export default {
  name: 'CommonRender'
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import DynamicRender from '@/components/dynamic-render'

import globalMap from '@/utils/global-properties'
import { commonRequest } from '@/utils/common'

const route = useRoute()
const pageId = route.query.pageId as string
const pageCode = route.query.pageCode as string || ''

// 用于预览
const fakeData = globalMap.get('prevView') || undefined
const dynamicRef = ref<any>()

// 获取初始数据的请求信息
const initRequestInfo = ref<{ url: string, params: Record<string, any>, type: 'get' | 'post' }>({
  url: '/render/init',
  params: {
    pageId
  },
  type: 'get'
})
if (fakeData) {
  globalMap.delete('prevView')
  initRequestInfo.value = {
    url: '/render/previewInit',
    params: {
      dynamicPageConfig: fakeData,
      dynamicPageCode: fakeData.properties.code,
      dynamicPageName: fakeData.properties.title
    },
    type: 'post'
  }
}
</script>
