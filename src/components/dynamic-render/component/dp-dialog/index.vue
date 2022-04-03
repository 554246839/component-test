<template>
  <div :data-qiankun="baseRoute">
    <el-dialog
      v-model="dialogVisible"
      :title="$tr(properties, pageId, 'title')"
      :width="properties.width"
      :before-close="closeDialog"
      :destroy-on-close="true"
      custom-class="custom-dialog"
      draggable
    >
      <el-form
        ref="formRef"
        :model="formModel"
        :rules="rules"
        :label-position="properties.labelPosition"
        :label-width="properties.labelWidth + 'px'"
        :size="properties.size"
        :disabled="properties.readonly"
      >
        <el-row :gutter="20">
          <el-col
            v-for="item in formItems"
            :key="item.id"
            :span="isNaN(+item.properties.span) ? 24 : +item.properties.span"
          >
            <el-form-item
              :label="item.type === 'button' ? '' : $tr(item.properties, pageId)"
              :prop="item.properties.prop"
              :label-width="item.properties.labelWidth && item.properties.labelWidth + 'px'"
            >
              <div
                v-if="item.type === 'text' && item.properties.isCustom"
                :style="parseStyle(item.properties.style)"
              >{{ parseCustomText(item.properties) ?? item.properties.defaultValue }}</div>
              <div
                v-else-if="item.type === 'text' && item.properties.prop"
                :style="parseStyle(item.properties.style)"
              >{{ getPropText(item.properties) ?? item.properties.defaultValue }}</div>
              <div
                v-else-if="item.type === 'text'"
                :style="parseStyle(item.properties.style)"
              >{{ item.properties.text }}</div>
              <el-input
                v-else-if="item.type === 'input'"
                v-model="formModel[item.properties.prop]"
                :size="properties.size"
                :placeholder="item.properties.placeholder || 'Please input'"
                :type="item.properties.type"
                :clearable="item.properties.clearable"
                :disabled="item.properties.disabled"
              />
              <el-input
                v-else-if="item.type === 'textarea'"
                v-model="formModel[item.properties.prop]"
                :size="properties.size"
                :rows="item.rows || 4"
                type="textarea"
                :placeholder="item.properties.placeholder || 'Please input'"
                :clearable="item.properties.clearable"
                :disabled="item.properties.disabled"
              />
              <el-select
                v-else-if="item.type === 'select'"
                v-model="formModel[item.properties.prop]"
                :size="properties.size"
                :placeholder="item.properties.placeholder || 'Select'"
                :clearable="item.properties.clearable"
                :disabled="item.properties.disabled"
                :multiple="item.properties.multiple"
                :filterable="item.properties.filterable"
                :on-change="componentChange.bind(null, item)"
              >
                <el-option
                  v-for="opt in options[item.properties.optionsId]"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
              <el-date-picker
                v-else-if="item.type === 'date'"
                v-model="formModel[item.properties.prop]"
                :size="properties.size"
                :type="item.properties.type"
                :placeholder="item.properties.placeholder || 'Pick a Date'"
                :range-separator="item.properties.rangeSeparator"
                :start-placeholder="item.properties.startPlaceholder || 'start'"
                :end-placeholder="item.properties.endPlaceholder || 'end'"
                :format="item.properties.format || 'YYYY-MM-DD'"
                :value-format="item.properties.valueFormat || 'YYYY-MM-DD'"
                :disabled-date="setDisabledDate.bind(null, item.properties, formModel)"
              ></el-date-picker>
              <el-checkbox-group
                v-else-if="item.type === 'checkbox'"
                v-model="formModel[item.properties.prop]"
                :size="properties.size"
                :disabled="item.properties.disabled"
              >
                <template v-for="checkbox in item.children" :key="checkbox.value">
                  <el-checkbox :label="checkbox.value">{{ $tr(checkbox, pageId) }}</el-checkbox>
                </template>
              </el-checkbox-group>
              <el-radio-group
                v-else-if="item.type === 'radio'"
                v-model="formModel[item.properties.prop]"
                :size="properties.size"
                :disabled="item.properties.disabled"
                :on-change="componentChange.bind(null, item)"
              >
                <el-radio
                  v-for="child in item.children"
                  :key="child.value"
                  :label="child.value"
                >{{ $tr(child, pageId) }}</el-radio>
              </el-radio-group>
              <el-button
                v-else-if="item.type === 'button'"
                :size="item.properties.btnSize || properties.size"
                :type="item.properties.styleType"
                :icon="(Icons as any)[item.properties.icon]"
                @click="dialogBtnClick(item.properties, item.id, 'dialogBody')"
              >{{ $tr(item.properties, pageId) }}</el-button>
              <div v-else-if="item.type === 'download'">
                <ul v-if="item.properties.prop">
                  <li
                    v-for="(info, index) in formModel[item.properties.prop] as { name: string, url: string }[]"
                    :key="info.url"
                    style="width: 100%;"
                  >
                    <el-button
                      type="text"
                      class="download-item"
                      @click="download(info.url)"
                    >{{ info.name }}</el-button>
                    <el-icon
                      v-if="item.properties.allowDelete && !properties.readonly"
                      class="download-delete-icon"
                      @click="removeDownloadItem(item.properties.prop, index)"
                    >
                      <component :is="Icons.Delete" />
                    </el-icon>
                  </li>
                  <span v-if="formModel[item.properties.prop].length === 0">{{ $tr('dp.nodata') }}</span>
                </ul>
                <ul v-else-if="item.children.length">
                  <li v-for="info in item.children" :key="info.value" style="width: 100%;">
                    <el-button
                      type="text"
                      class="download-item"
                      @click="download(info.value)"
                    >{{ $tr(info, pageId) }}</el-button>
                  </li>
                  <span v-if="item.children.length === 0">{{ $tr('dp.nodata') }}</span>
                </ul>
              </div>
              <el-upload
                v-else-if="item.type === 'upload'"
                class="upload-demo"
                drag
                :action="parseUrl(item.properties.api, 1) as string"
                :data="parseUrl(item.properties.requestParams, 2) as Record<string, any>"
                :multiple="item.properties.multiple"
                :on-success="onSuccess.bind(null, item.properties.prop)"
                :on-remove="onRemove.bind(null, item.properties.prop)"
              >
                <el-icon class="el-icon--upload">
                  <component :is="Icons.UploadFilled" />
                </el-icon>
                <div class="el-upload__text">
                  Drop file here or
                  <em>click to upload</em>
                </div>
                <template #tip>
                  <div
                    class="el-upload__tip"
                  >{{ item.properties.uploadTip || 'jpg/png files with a size less than 500kb' }}</div>
                </template>
              </el-upload>
              <el-switch
                v-else-if="item.type === 'switch'"
                v-model="formModel[item.properties.prop]"
                :size="properties.size"
                :disabled="item.properties.disabled"
                :active-value="item.properties.activeValue"
                :inactive-value="item.properties.inactiveValue"
                :active-color="item.properties.activeColor || '#13ce66'"
                :inactive-color="item.properties.inactiveColor || '#ff4949'"
                :on-change="componentChange.bind(null, item)"
              />
              <el-time-picker
                v-else-if="item.type === 'time'"
                v-model="formModel[item.properties.prop]"
                :size="properties.size"
                :placeholder="item.properties.placeholder"
              ></el-time-picker>
              <Monaco
                v-else-if="item.type === 'monaco'"
                :ref="setMonacoRef.bind(null, item.properties.prop) as any"
                v-model="formModel[item.properties.prop]"
                :readonly="properties.readonly"
                :language="item.properties.language"
                :style="{ width: item.properties.width, height: item.properties.height }"
              />
              <dp-table
                v-else-if="item.type === 'table'"
                :data="item"
                :page-id="pageId"
                :search-status="true"
                :search-data="params?._row"
                :hide-column-operate="true"
              ></dp-table>
              <div
                v-if="item.properties.tip"
                class="form-item__tips"
              >Tips: {{ item.properties.tip }}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div
          v-if="properties.showFooter"
          :style="{ textAlign: properties.footerAlign || 'center' }"
        >
          <el-button
            v-for="btn in buttons"
            :key="btn.id"
            :size="btn.properties.btnSize"
            :type="btn.properties.styleType"
            :icon="(Icons as any)[btn.properties.icon]"
            @click="dialogBtnClick(btn.properties, btn.id)"
          >{{ $tr(btn.properties, pageId) }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DpDialogService',
  inheritAttrs: false
}
</script>

<script lang="ts" setup>
import { computed, PropType, reactive, ref } from 'vue'
import * as Icons from '@element-plus/icons-vue'
import {
  ElDialog,
  ElForm, ElFormItem,
  ElButton,
  ElInput,
  ElIcon,
  ElSwitch,
  ElUpload,
  ElRadioGroup, ElRadio,
  ElCheckboxGroup, ElCheckbox,
  ElDatePicker, ElTimePicker,
  ElSelect, ElOption,
  ElRow, ElCol, ElMessage, ElMessageBox
} from 'element-plus'
import Monaco from '../../../ep-monaco/index.vue'
import DpTable from '../DpTable.vue'

import {
  btnClick,
  getApiInfo,
  getFunctionBody,
  parseStyle,
  setDisabledDate,
  array2Obj,
  columnFormat,
  $tr
} from '../../use-utils'
import globalMap from '../../global-map'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  properties: {
    type: Object,
    required: true
  },
  children: {
    type: Array as PropType<Record<string, any>[]>,
    required: true
  },
  buttons: {
    type: Array as PropType<Record<string, any>[]>
  },
  params: {
    type: Object
  },
  pageId: {
    type: String,
    required: true
  },
  // 刷新table方法
  callback: {
    type: Function as PropType<() => void>
  },
  onClose: {
    type: Function as PropType<() => void>,
    required: true
  }
})
console.log(props, '====================')

const commonRequest = globalMap.get('request')
const options = globalMap.get(props.pageId).options
const formRef = ref<InstanceType<typeof ElForm>>()
const formModel = ref<Record<string, any>>({})
const baseRoute = globalMap.get(props.pageId).global.baseRoute
const monacoRefs = reactive<Record<string, InstanceType<typeof Monaco>>>({})

// 动态处理 monaco 组件的ref
const setMonacoRef = (prop: string, el: InstanceType<typeof Monaco>) => {
  monacoRefs[prop] = el
}

const formItems = computed(() => {
  let children: Record<string, any>[] = []
  props.children?.forEach((v: Record<string, any>) => {
    const copy = JSON.parse(JSON.stringify(v))
    if (['display', 'disabled'].includes(v.properties.status) || Object.prototype.hasOwnProperty.call(v.properties, 'isShow')) {
      try {
        const body = getFunctionBody(v.properties.condition)
        if (body) {
          const newFn = new Function('formData', body)
          const res = newFn(formModel.value)

          // display: true 显示 | false 隐藏
          // disabled: true 不可编辑 | false 可编辑
          if (v.properties.status === 'disabled') {
            copy.properties.disabled = res
          }
          if ((v.properties.status === 'display' || v.properties.isShow) && !res) {
            return
          }
        }
      } catch (e) {
        ElMessage({
          showClose: true,
          message: '自定义函数内容错误！',
          type: 'error'
        })
      }
    }
    children.push(copy)
  })

  return children
})

const rules = ref<Record<string, Record<string, any>[]>>({})
props.children?.forEach((v: Record<string, any>) => {
  if (!v.properties.prop) {
    return
  }
  if (
    v.type === 'select' && v.properties.multiple ||
    ['checkbox', 'upload', 'download', 'checkbox'].includes(v.type)
  ) {
    formModel.value[v.properties.prop] = v.properties.defaultValue || []
  } else {
    formModel.value[v.properties.prop] = v.properties.defaultValue || ''
  }

  const rule = []
  if (v.properties.required) {
    rule.push({
      required: true,
      message: 'Please input...',
      trigger: 'blur'
    })
  }
  if (v.properties.rule) {
    rule.push({
      validator: (rule: any, value: any, callback: any) => {
        if (!new RegExp(v.properties.rule, 'g').test(value)) {
          callback(new Error(v.properties.errMsg))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    })
  }

  if (rule.length) {
    rules.value[v.properties.prop] = rule
  }
})

// 单选select / switch / radio 
const componentChange = (componentInfo: Record<string, any>) => {
  if (componentInfo.type === 'select' && componentInfo.properties.multiple || !componentInfo.properties.api) {
    return
  }
  const { api, requestType, requestParams } = componentInfo.properties
  const { url, params } = getApiInfo(
    api, requestParams, props.params?._row, props.pageId
  )

  if (url) {
    commonRequest(url, params, requestType).then((res: any) => {
      syncData(res.result, true)
    })
  }
}

const optionsObj: Record<string, string> = {}
const parse = (vals: string | string[]) => {
  if (typeof vals === 'string') {
    return optionsObj[vals]
  }
  if (Array.isArray(vals)) {
    return vals.map((v: string) => optionsObj[v]).join(',')
  }
  return vals
}
// 文本组件自定义函数
const parseCustomText = (properties: Record<string, any>) => {
  for (let optionId of properties.parentData) {
    Object.assign(optionsObj, array2Obj(options[optionId]))
  }
  const body = getFunctionBody(properties.customText)
  if (!body) {
    return true
  }
  try {
    const newFn = new Function('formData, parse', body)
    const value = newFn(formModel.value, parse)
    if (properties.format) {
      return (columnFormat as any)[properties.format](value, properties.format === 'date' ? properties.dateFormat : undefined)
    }
    return value
  } catch (e) {
    console.error('文本组件自定义函数内容错误：', e)
  }
}
const getPropText = (properties: Record<string, any>) => {
  if (
    formModel.value[properties.prop] === undefined ||
    formModel.value[properties.prop] === null ||
    !properties.format
  ) {
    return formModel.value[properties.prop]
  }
  return (columnFormat as any)[properties.format](formModel.value[properties.prop], properties.format === 'date' ? properties.dateFormat : undefined)
}

// 同步 formModel 数据
const syncData = (data: Record<string, any>, hasMonaco?: boolean) => {
  for (let key in formModel.value) {
    if (Object.prototype.hasOwnProperty.call(formModel.value, key)) {
      if (data[key] !== undefined && data[key] !== null) {
        formModel.value[key] = data[key]
        // 是否需要更新 monaco
        if (hasMonaco && monacoRefs[key]) {
          monacoRefs[key].updateValue(data[key])
        }
      }
    }
  }
}
// 如果有getData，则表示该弹窗的初始数据是由接口获取
if (props.properties.getDataApi) {
  console.log('执行请求获取初始数据')

  const { url, params } = getApiInfo(
    props.properties.getDataApi,
    props.properties.requestParams,
    props.params?._row,
    props.pageId
  )
  console.log(url, params)

  if (url) {
    // 执行请求获取初始数据
    commonRequest(url, { ...params, componentId: props.id }, props.properties.requestType).then((res: any) => {
      console.log(res, 'getDataApi')
      // 更新 from-model 的初始数据
      syncData(res.result, true)
    })
  }
} else if (props.params?._row) {
  syncData(props.params._row)
}

const dialogVisible = ref(true)
const download = (path: string) => {
  window.open(path)
}
const removeDownloadItem = (prop: string, index: number) => {
  if (Array.isArray(formModel.value[prop])) {
    ElMessageBox.confirm(`是否删除 <strong><em>${formModel.value[prop][index].name}</em></strong> 上传记录?`, '提示', {
      dangerouslyUseHTMLString: true,
      type: 'warning',
      draggable: true
    }).then(() => {
      formModel.value[prop].splice(index, 1)
    })
  }
}
const dialogBtnClick = (btn: Record<string, any>, componentId: string, pos?: string) => {
  console.log(btn, formModel.value)
  // 弹窗主体内的按钮
  if (pos) {
    btnClick(btn, {
      params: { ...props.params, ...formModel.value, componentId }
    }, props.pageId).then((obj: any) => {
      console.log(obj, '=====')
      syncData(obj, true)
    })
    return
  }
  // 弹窗底部按钮
  if (btn.functionType === 'close') {
    closeDialog()
    return
  }
  if (btn.functionType === 'reset') {
    formRef.value?.resetFields()
    return
  }
  formRef.value?.validate((isValid?: boolean) => {
    if (isValid) {
      let callback = undefined
      if (btn.refreshTable || btn.closeDialog) {
        callback = () => {
          // 关闭弹窗
          if (btn.closeDialog) {
            dialogVisible.value = false
          }
          // 刷新table
          if (btn.refreshTable) {
            props.callback?.()
          }
        }
      }
      btnClick(btn, {
        params: { ...props.params, ...formModel.value, componentId },
        callback
      }, props.pageId)
    } else {
      console.warn('表单校验错误！')
      return false
    }
  })
}

// 上传功能
const parseUrl = (url: string, type: 1 | 2) => {
  if (type === 1) {
    if (!url) {
      return ''
    }
    return getApiInfo(
      url, undefined, props.params?._row, props.pageId
    ).url
  } else {
    if (!url) {
      return {}
    }
    return getApiInfo(
      '', url, props.params?._row, props.pageId
    ).params
  }
}
const onSuccess = (prop: string, response: any) => {
  formModel.value[prop].push(...response.result)
}
const onRemove = (prop: string, file: any) => {
  const uploadFiles = formModel.value[prop]
  // 删除file
  for (let i = 0; i < uploadFiles.length; i++) {
    if (uploadFiles[i].fileName === file.name) {
      uploadFiles.splice(i, 1)
      break
    }
  }
}
const closeDialog = () => {
  dialogVisible.value = false
  props.onClose()
}
</script>
