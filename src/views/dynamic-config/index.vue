<template>
  <div class="dynamic-config">
    <div class="dynamic-title">
      <span>页面配置</span>
      <div class="title-btn">
        <el-button
          size="small"
          type="primary"
          @click="initI18nConfig(dp)"
        >初始化多语言配置</el-button>
        <el-button
          size="small"
          type="primary"
          @click="prevView"
        >预览</el-button>
        <el-button
          size="small"
          type="primary"
          @click="downloadJson(dp)"
        >下载</el-button>
        <el-button
          size="small"
          type="primary"
          @click="save"
        >保存</el-button>
      </div>
    </div>
    <div class="contanier">
      <!-- 组件列表 -->
      <div class="dynamic-left">
        <component-list
          ref="componentListRef"
          :dp="dp"
          :component="component"
          @update-component="updateComponent"
          @show-template="showTemplate"
          @delete-component="deleteComponent"
          @get-copy-comp="getCopyComp"
          @fixed-position-component="fixedPositionComponent"
        />
      </div>
      <!-- 展示区域 -->
      <div class="dynamic-middle">
        <dynamic-body
          ref="dynamicBodyRef"
          v-model:copyComponent="copyComp"
          :dp="dp"
          :component="component"
          @delete-component="deleteComponent"
          @set-property="setProperty"
          @update-component="updateComponent"
        />
      </div>
      <!-- 属性配置 -->
      <div class="dynamic-right">
        <div class="dynamic-properties">
          <h3>属性配置</h3>
          <el-form
            size="small"
            label-suffix=":"
            label-position="top"
            label-width="100px"
          >
            <el-row :gutter="20">
              <template
                v-for="item in getShowProperties"
                :key="item.value"
              >
                <el-col :span="item.type === 'switch' ? 12 : 24">
                  <h4 v-if="item.type === 'title'">{{ item.label }}</h4>
                  <template v-else-if="item.type === 'edit'">
                    <div>
                      <el-button
                        type="text"
                        @click="addChildren(activeComponents[item.editFields[0]])"
                      >{{ item.label }}</el-button>
                    </div>
                    <el-row :gutter="10">
                      <template
                        v-for="(child, index) in activeComponents[item.editFields[0]]"
                        :key="index"
                      >
                        <div class="property-children">
                          <el-icon
                            class="delete-child"
                            @click="deleteComponent(activeComponents[item.editFields[0]], index)"
                          >
                            <delete />
                          </el-icon>
                          <el-col
                            :span="24"
                            class="custom-add"
                          >
                            <span>{{ item.editFields[1] }}:</span>
                            <template v-if="item.editFields[0] === 'sortables'">
                              <el-select
                                v-model="child.label"
                                clearable
                                size="small"
                              >
                                <el-option
                                  v-for="opt in tableProps"
                                  :key="opt.value"
                                  :label="opt.label"
                                  :value="opt.value"
                                ></el-option>
                              </el-select>
                            </template>
                            <template v-else>
                              <el-input
                                v-model="child.label"
                                size="small"
                                clearable
                              ></el-input>
                            </template>
                          </el-col>
                          <el-col
                            :span="24"
                            class="custom-add"
                          >
                            <span>多语言属性:</span>
                            <el-input
                              v-model="child.i18n"
                              clearable
                            ></el-input>
                          </el-col>
                          <el-col
                            :span="24"
                            class="custom-add"
                          >
                            <span>{{ item.editFields[2] }}:</span>
                            <template v-if="item.valueChildren">
                              <el-select
                                v-model="child.value"
                                size="small"
                                clearable
                              >
                                <el-option
                                  v-for="chd in item.valueChildren"
                                  :key="chd.value"
                                  :label="chd.label"
                                  :value="chd.value"
                                ></el-option>
                              </el-select>
                            </template>
                            <template v-else>
                              <el-input
                                v-model="child.value"
                                size="small"
                                clearable
                              ></el-input>
                            </template>
                          </el-col>
                        </div>
                      </template>
                    </el-row>
                  </template>
                  <el-form-item
                    v-else
                    :label="item.label"
                  >
                    <template v-if="item.type === 'input'">
                      <el-input
                        v-model="activeComponents.properties[item.value]"
                        size="small"
                        clearable
                        :placeholder="item.placeholder"
                      ></el-input>
                    </template>
                    <template v-else-if="item.type === 'select'">
                      <el-select
                        v-model="activeComponents.properties[item.value]"
                        :multiple="item.multiple"
                        clearable
                        size="small"
                        :placeholder="item.placeholder"
                      >
                        <template v-if="item.value === 'format'">
                          <el-option
                            v-for="opt in columnFormatList"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value"
                          ></el-option>
                        </template>
                        <template v-else-if="item.value === 'sumCols'">
                          <el-option
                            v-for="opt in tableProps"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value"
                          ></el-option>
                        </template>
                        <template v-else-if="['optionsId', 'parentData'].includes(item.value)">
                          <el-option
                            v-for="opt in optionIds"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value"
                          ></el-option>
                        </template>
                        <template v-else-if="item.value === 'readVariable'">
                          <el-option
                            v-for="opt in readVariables"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value"
                          ></el-option>
                        </template>
                        <template v-else-if="item.value === 'writeVariable'">
                          <el-option
                            v-for="opt in writeVariables"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value"
                          ></el-option>
                        </template>
                        <template v-else-if="item.value === 'dialogTemplateId'">
                          <el-option
                            v-for="opt in dp.dialogTemplate"
                            :key="opt.id"
                            :label="opt.properties.title"
                            :value="opt.id"
                          ></el-option>
                        </template>
                        <template v-else-if="item.value === 'searchAttrLogic'">
                          <el-option
                            v-for="opt in searchAttrLogics"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value"
                          ></el-option>
                        </template>
                        <template v-else>
                          <el-option
                            v-for="opt in item.children"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value"
                          ></el-option>
                        </template>
                      </el-select>
                    </template>
                    <template v-else-if="item.type === 'switch'">
                      <el-switch v-model="activeComponents.properties[item.value]"></el-switch>
                    </template>
                    <template v-else-if="item.type === 'textarea'">
                      <el-input
                        v-model="activeComponents.properties[item.value]"
                        size="small"
                        type="textarea"
                        clearable
                        :rows="item.rows || 4"
                        :placeholder="item.placeholder"
                      ></el-input>
                    </template>
                    <template v-else-if="item.type === 'monaco'">
                      <div
                        class="code-editor"
                        @click="showCodeEditor(item.value)"
                      >{{ activeComponents.properties[item.value] }}</div>
                    </template>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="codeEditorVisible"
    title="自定义函数编辑"
    width="50%"
    draggable
    destroy-on-close
    append-to-body
  >
    <div data-qiankun="scc">
      <ep-monaco
        v-model="activeComponents.properties[activePorp]"
        language="javascript"
        style="height: 400px;"
      ></ep-monaco>
    </div>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: 'DynamicConfig'
}
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

import ComponentList from './components/ComponentList.vue'
import DynamicBody from './components/DynamicBody.vue'
import EpMonaco from '@/components/ep-monaco'

import * as components from './type'
import propertyTemplate from './type/config'

import { columnFormatList, initI18nConfig, downloadJson } from './utils'

import { apiSave, apiGetDetail, apiAddInit } from './api'

import { useRoute, useRouter } from 'vue-router'
import globalMap from '@/utils/global-properties'

const route = useRoute()
const router = useRouter()

// 大 JSON
const dp = ref<Record<string, any>>(new components.Common)
// 当前页面所有的options
const optionIds = ref<Record<'label' | 'value', string>[]>([])
// 当前页面的所有可读变量
const readVariables = ref<Record<'label' | 'value', string>[]>([])
// 当前页面的所有可写变量
const writeVariables = ref<Record<'label' | 'value', string>[]>([])
// 搜索栏内字段的搜索规则
const searchAttrLogics = ref<Record<'label' | 'value', string>[]>([])
// 当前table内的prop
const tableProps = computed(() => {
  if (activeComponents.value.type === 'table') {
    const props: Record<'label' | 'value', string>[] = []
    activeComponents.value.children?.forEach((col: Record<string, any>) => {
      if (col.properties.type !== 'selection' && col.properties.prop) {
        props.push({
          label: col.properties.label,
          value: col.properties.prop
        })
      }
    })
    return props
  }
  return []
})

let pageId: any = route.query.id
const init = () => {
  if (pageId) {
    // 编辑
    apiGetDetail(pageId).then((response: any) => {
      Object.assign(dp.value, response.result.dynamicPageConfig)
      optionIds.value = response.result.optionIds
      readVariables.value = response.result.readVariables
      writeVariables.value = response.result.writeVariables
      searchAttrLogics.value = response.result.searchAttrLogic
      componentListRef.value?.updateComponentList()
    })
  } else {
    // 新增
    apiAddInit().then((response: any) => {
      optionIds.value = response.result.optionIds
      readVariables.value = response.result.readVariables
      writeVariables.value = response.result.writeVariables
      searchAttrLogics.value = response.result.searchAttrLogic
    })
  }
}

// 预览
const prevView = () => {
  globalMap.set('prevView', dp.value)
  router.push('/render?pageId=' + pageId)
}

// 保存
const save = () => {
  const params = {
    id: pageId,
    dynamicPageConfig: dp.value,
    dynamicPageCode: dp.value.properties.code,
    dynamicPageName: dp.value.properties.title
  }
  apiSave(params).then(() => {
    ElMessage.success({
      message: '保存成功',
      showClose: true
    })
  })
}

// 初始化左侧组件列表
const component: Record<string, any> = {}
const initLeftComponentList = () => {
  for (let c in components) {
    if (Object.prototype.hasOwnProperty.call(components, c)) {
      component[c] = new (components as any)[c]
    }
  }
}

const componentListRef = ref<InstanceType<typeof ComponentList>>()
const dynamicBodyRef = ref<InstanceType<typeof DynamicBody>>()

// 复制已有组件
let copyComp = ref<Record<string, any> | undefined>()
const getCopyComp = (comp: Record<string, any>) => {
  copyComp.value = comp
}
const updateComponent = (parent: Record<string, any> | Record<string, any>[], val: any, key?: string) => {
  if (Array.isArray(parent)) {
    parent.push(val)
  } else if (key) {
    parent[key] = val
  }
  // 更新左侧组件列表
  componentListRef.value?.updateComponentList()
}

// 定位已有组件
const fixedPositionComponent = (componentInfo: Record<string, any>, parent: string, parentComponent: Record<string, any>) => {
  dynamicBodyRef.value?.fixedPositionComponent(componentInfo, parentComponent)
  setTimeout(() => {
    activeComponents.value = componentInfo
    activeParent.value = parent
  })
}

// 当前操作的组件
const activeComponents = ref<Record<string, any>>({})
// 当前操作组件的父级容器
const activeParent = ref<string | undefined>('')

// 具体组件
const setProperty = (componentInfo: Record<string, any>, parent?: string) => {
  activeComponents.value = componentInfo
  activeParent.value = parent
}
// 处理右侧属性
const getShowProperties = computed(() => {
  const properties = propertyTemplate[activeComponents.value.type]
  if (!properties) {
    return []
  }
  let props: Record<string, any> = []
  properties.forEach((item: Record<string, any>) => {
    if ((!item.use || item.use.includes(activeParent.value)) && getConditionResult(item.rules)) {
      props.push(item)
    }
  })
  return props
})
// 计算是否可操作属性
const getConditionResult = (rules: { originValue: string, destValue: string[] }[]) => {
  if (!rules) {
    return true
  }
  for (let i = 0; i < rules.length; i++) {
    const item = rules[i]
    if (
      item.destValue &&
      item.originValue &&
      !item.destValue.includes(activeComponents.value.properties[item.originValue])
    ) {
      return false
    }
  }
  return true
}

// 弹窗列表点击
const showTemplate = (temp: Record<string, any>) => {
  dynamicBodyRef.value?.showTemplate(temp)
  activeComponents.value = temp
}
// 删除组件
const deleteComponent = (list: Record<string, any>[] | Record<string, any>, key: number | string) => {
  ElMessageBox.confirm('是否确认删除该组件?', '提示', {
    type: 'warning',
    draggable: true
  }).then(() => {
    if (Array.isArray(list)) {
      list.splice(key as number, 1)
    } else {
      delete list[key]
    }
    // 更新左侧组件列表
    componentListRef.value?.updateComponentList()
  })
}

// download / checkbox / radio... 在属性区域添加子项
const addChildren = (parent: { label: string, value: string }[]) => {
  parent.push({
    label: '',
    value: ''
  })
}

const activePorp = ref('')
const codeEditorVisible = ref(false)
const showCodeEditor = (prop: string) => {
  activePorp.value = prop
  codeEditorVisible.value = true
}

const initFunction = () => {
  initLeftComponentList()
  init()
}
initFunction()
</script>

<style lang="scss">
@import "./index.scss";
</style>
