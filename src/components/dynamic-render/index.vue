<template>
  <dp-search
    v-if="jsonData.search"
    :data="jsonData.search"
    :blank-span="blankSpan"
    :default-value="searchData"
    :options="options"
    :page-id="pageId"
    :search-status="searchStatus"
    @confirmSearch="confirmSearch"
    @spreadSearch="spreadSearch"
  />
  <div class="dynamic-main">
    <!-- <dp-aside v-if="jsonData.aside" :data="jsonData.aside" /> -->
    <dp-table
      v-if="jsonData.table"
      ref="dpTableRef"
      :data="jsonData.table"
      :search-data="searchData"
      :search-status="searchStatus"
      :page-id="pageId"
      @spreadSearch="spreadSearch"
    >
      <template #table-up-btns="scope">
        <slot
          name="table-up-btns"
          v-bind="scope"
        />
      </template>
      <template #column-opreate-btns="scope">
        <slot
          name="column-opreate-btns"
          v-bind="scope"
        />
      </template>
    </dp-table>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DynamicRender'
}
</script>

<script lang="ts" setup>
import { PropType, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DpSearch from './component/DpSearch.vue'
// import DpAside from './component/dp-aside.vue'
import DpTable from './component/DpTable.vue'

import globalMap from './global-map'
import setupI18n, { loadLocaleMessages } from '../../locale'
const route = useRoute()

const props = defineProps({
  // 预览数据
  data: {
    type: Object
  },
  // 页面id
  pageId: {
    type: String,
    required: true
  },
  // 页面code
  pageCode: {
    type: String,
    required: true
  },
  initDataInfo: {
    type: Object as PropType<{ url: string, params: Record<string, any>, type: 'get' | 'post' }>,
    required: true
  },
  // 通用请求方法
  request: {
    type: Function as PropType<(url: string, params: Record<string, any>, type: 'get' | 'post') => any>,
    required: true
  }
})

const i18n = setupI18n()
// 加载多语言配置
loadLocaleMessages(i18n.global, useI18n())

const globalParams = {
  global: {
    pageId: props.pageId,
    pageCode: props.pageCode,
    langCode: ''
  },
  searchData: {},
  options: {},
  dialogMap: new Map
}
globalMap.set(props.pageId, globalParams)

if (!globalMap.has('request')) {
  globalMap.set('request', props.request)
}
if (!globalMap.has('useRouter')) {
  globalMap.set('useRouter', useRouter())
}

const jsonData = ref<Record<string, any>>({})
const searchData = ref<Record<string, any>>({})
const options = ref<Record<string, any>>({})
const blankSpan = ref(0)

const updateDialog = (dialogTems: Record<string, any>[] = []) => {
  dialogTems.forEach((v: Record<string, any>) => {
    globalParams.dialogMap.set(v.id, v)
  })
}
const getSearchDefaultData = (fields?: Record<string, any>[]) => {
  if (!fields) {
    return
  }
  const model: Record<string, any> = route.query
  let totalSpan = 0
  fields.forEach((v: Record<string, any>) => {
    if (!model[v.properties.prop]) {
      if (v.type === 'select' && v.properties.multiple) {
        model[v.properties.prop] = v.properties.defaultValue || []
      } else if (v.type === 'date' && v.properties.type.endsWith('range')) {
        if (v.properties.defaultValue) {
          try {
            const val = JSON.parse(v.properties.defaultValue.replace(/'/g, '"'))
            if (Array.isArray(val)) {
              model[v.properties.prop] = val
            } else {
              model[v.properties.prop] = null
            }
          } catch (e) {
            model[v.properties.prop] = null
          }
        } else {
          model[v.properties.prop] = null
        }
      } else {
        model[v.properties.prop] = v.properties.defaultValue || ''
      }
    }

    const span = +v.properties.span
    if (totalSpan + span > 24) {
      totalSpan = span
    } else {
      totalSpan += span
    }
    totalSpan %= 24
  })
  return { model, blankSpan: totalSpan + 6 > 24 ? 18 : 18 - totalSpan }
}
const init = () => {
  if (props.data) {
    const res = getSearchDefaultData(props.data.search?.children)
    if (res) {
      searchData.value = res.model
      blankSpan.value = res.blankSpan
      globalParams.searchData = res.model
    }
    updateDialog(props.data.dialogTemplate)
    props.request(props.initDataInfo.url, props.initDataInfo.params, props.initDataInfo.type).then((response: any) => {
      jsonData.value = props.data!
      globalParams.global.langCode = jsonData.value.properties.langCode
      // 获取页面内所有的下拉选项
      globalParams.options = response.result.options
      options.value = response.result.options
    })
  } else {
    // 请求获取json数据
    props.request(props.initDataInfo.url, props.initDataInfo.params, props.initDataInfo.type).then((response: any) => {
      jsonData.value = response.result.dynamicPageConfig
      const res = getSearchDefaultData(jsonData.value.search?.children)
      if (res) {
        searchData.value = res.model
        blankSpan.value = res.blankSpan
        globalParams.searchData = res.model
      }
      updateDialog(jsonData.value.dialogTemplate)
      // 获取页面内所有的下拉选项
      globalParams.options = response.result.options
      options.value = response.result.options
    })
  }
}
init()

const dpTableRef = ref<InstanceType<typeof DpTable>>()
const searchStatus = ref(true)

const confirmSearch = (model: Record<string, any>) => {
  Object.assign(searchData.value, model)
  Object.assign(globalParams.searchData, model)
  dpTableRef.value!.init(model)
}
const spreadSearch = (status: boolean) => {
  searchStatus.value = status
}
defineExpose({
  dpTableRef,
  searchData,
  refreshTable: (params: Record<string, any> = {}) => {
    dpTableRef.value!.init({ ...params, ...searchData.value })
  }
})
</script>

<style lang="scss">
@import "./index.scss";
</style>
