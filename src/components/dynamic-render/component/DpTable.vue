<template>
  <div class="dynamic-table">
    <div class="table-button">
      <template
        v-for="btn in data.buttons"
        :key="btn.id"
      >
        <el-button
          :size="btn.properties.btnSize"
          :round="btn.properties.round"
          :type="btn.properties.styleType"
          :icon="(Icons as any)[btn.properties.icon]"
          @click="tableBtnClick(btn.properties, btn.id)"
        >{{ $tr(btn.properties, pageId) }}</el-button>
      </template>
      <slot name="table-up-btns" />
      <div class="operate-btn">
        <el-button
          v-if="!hideColumnOperate"
          :icon="Icons.Setting"
          type="text"
          @click="colOperateVisible = true"
        >{{ $tr('dp.columnOperate') }}</el-button>
        <el-button
          v-show="!searchStatus"
          :icon="Icons.FullScreen"
          type="text"
          @click="spreadSearch"
        >{{ $tr('dp.unfold') }}</el-button>
      </div>
    </div>
    <div
      v-if="rerenderTable"
      class="table-main"
    >
      <el-table
        ref="elTableRef"
        :data="tableData"
        style="width: 100%"
        :show-summary="data.properties.showSum"
        :sum-text="data.properties.sumText"
        :summary-method="getSummaries"
        @selection-change="selectionChange"
      >
        <template
          v-for="col in columnRenderData"
          :key="col.id"
        >
          <el-table-column
            v-if="col.properties.type === 'selection'"
            :type="col.properties.type"
            :align="col.properties.align"
            :fixed="col.properties.fixed !== 'none' && col.properties.fixed"
            :width="col.properties.width"
          />
          <el-table-column
            v-else-if="col.properties.visible || col.properties.visible === undefined"
            :prop="col.properties.prop"
            :label="$tr(col.properties, pageId)"
            :show-overflow-tooltip="col.properties.showOverflowTooltip"
            :align="col.properties.align"
            :type="col.properties.type"
            :fixed="col.properties.fixed !== 'none' && col.properties.fixed"
            :width="col.properties.width"
            :sortable="col.properties.sortable"
          >
            <template #default="scope">
              <div v-if="col.properties.isCustomText">
                <!-- 如果操作列的按钮大于1个，则不做自定义函数文本替换 -->
                <div v-if="col.children?.length">
                  <template
                    v-for="colBtn in col.children"
                    :key="colBtn.id"
                  >
                    <el-button
                      v-if="colBtn.type === 'button'"
                      :size="colBtn.properties.btnSize"
                      :type="colBtn.properties.styleType"
                      :icon="(Icons as any)[colBtn.properties.icon]"
                      :style="getCustomLabel(col.properties, scope.row, 'style')"
                      :class="{ 'custom-text-btn': col.children.length === 1 }"
                      @click="tableBtnClick(colBtn.properties, colBtn.id, scope.row)"
                    >{{ col.children.length > 1 ? colBtn.properties.label : getCustomLabel(col.properties, scope.row, 'text') }}</el-button>
                    <el-switch
                      v-else-if="colBtn.type === 'switch'"
                      v-model="scope.row[col.properties.prop]"
                      :disabled="colBtn.properties.disabled"
                      :active-value="colBtn.properties.activeValue"
                      :inactive-value="colBtn.properties.inactiveValue"
                      :active-color="colBtn.properties.activeColor"
                      :inactive-color="colBtn.properties.inactiveColor"
                      :on-change="switchChange.bind(null, colBtn, scope.row)"
                    />
                  </template>
                </div>
                <!-- 默认文本 -->
                <span
                  v-else
                  :style="getCustomLabel(col.properties, scope.row, 'style')"
                >{{ getCustomLabel(col.properties, scope.row, 'text') }}</span>
              </div>
              <div
                v-else-if="col.properties.type === 'operate'"
                :class="{ 'operate-col-btn': col.properties.allowCustomBtn }"
              >
                <template
                  v-for="(colBtn, idx) in col.children"
                  :key="colBtn.id"
                >
                  <el-button
                    v-if="colBtn.type === 'button' && showCondition(colBtn.properties, scope.row) && showSlot(col, idx, 'front')"
                    :size="colBtn.properties.btnSize"
                    :type="colBtn.properties.styleType"
                    :icon="(Icons as any)[colBtn.properties.icon]"
                    @click="tableBtnClick(colBtn.properties, colBtn.id, scope.row)"
                  >{{ colBtn.properties.label }}</el-button>
                  <el-switch
                    v-else-if="colBtn.type === 'switch' && showCondition(colBtn.properties, scope.row) && showSlot(col, idx, 'front')"
                    v-model="scope.row[col.properties.prop]"
                    :disabled="colBtn.properties.disabled"
                    :active-value="colBtn.properties.activeValue"
                    :inactive-value="colBtn.properties.inactiveValue"
                    :active-color="colBtn.properties.activeColor"
                    :inactive-color="colBtn.properties.inactiveColor"
                    :on-change="switchChange.bind(null, colBtn, scope.row)"
                  />
                </template>
                <slot
                  v-if="col.properties.allowCustomBtn"
                  name="column-opreate-btns"
                  :row="scope.row"
                  :index="scope.$index"
                />
                <template
                  v-for="(colBtn, idx) in col.children"
                  :key="colBtn.id"
                >
                  <el-button
                    v-if="colBtn.type === 'button' && showCondition(colBtn.properties, scope.row) && showSlot(col, idx, 'back')"
                    :size="colBtn.properties.btnSize"
                    :type="colBtn.properties.styleType"
                    :icon="(Icons as any)[colBtn.properties.icon]"
                    @click="tableBtnClick(colBtn.properties, colBtn.id, scope.row)"
                  >{{ colBtn.properties.label }}</el-button>
                  <el-switch
                    v-else-if="colBtn.type === 'switch' && showCondition(colBtn.properties, scope.row) && showSlot(col, idx, 'back')"
                    v-model="scope.row[col.properties.prop]"
                    :disabled="colBtn.properties.disabled"
                    :active-value="colBtn.properties.activeValue"
                    :inactive-value="colBtn.properties.inactiveValue"
                    :active-color="colBtn.properties.activeColor"
                    :inactive-color="colBtn.properties.inactiveColor"
                    :on-change="switchChange.bind(null, colBtn, scope.row)"
                  />
                </template>
              </div>
              <span
                v-else-if="col.properties.type === 'default'"
              >{{ scope.row[col.properties.prop] }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        v-if="data.properties.pagination"
        class="table-pagination"
        :small="true"
        :style="{ justifyContent: paginationAlign[data.properties.pAlign] }"
        :current-page="pagination.cursor"
        :page-sizes="data.properties.pSizes.split(',')"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
  <el-dialog
    v-model="colOperateVisible"
    :title="$tr('dp.columnOperate')"
    custom-class="custom-dialog"
    width="800px"
    draggable
  >
    <div class="custom-table custom-header">
      <div class="custom-column">{{ $tr('dp.column') }}</div>
      <div class="custom-column">{{ $tr('dp.freeze') }}</div>
      <div class="custom-column">{{ $tr('dp.width') }}</div>
      <div class="custom-column cell-center">{{ $tr('dp.show') }}</div>
    </div>
    <transition-group
      tag="div"
      name="flip-list"
      @drop="drop"
      @dragover="dragover"
    >
      <template
        v-for="(col, index) in columnData"
        :key="col.name"
      >
        <div
          :class="['custom-table', !col.visible ? 'disabled' : '']"
          :draggable="couldDrag"
          :data-index="index"
          @dragstart="dragstart($event, index)"
        >
          <div
            class="custom-column move"
            @mousedown="sortMousedown"
            @mouseleave="sortMouseup"
          >{{ col.name }}</div>
          <div class="custom-column">
            <el-select
              v-model="col.fixed"
              size="small"
              :disabled="!col.visible"
            >
              <el-option
                label="none"
                value="none"
              ></el-option>
              <el-option
                label="left"
                value="left"
              ></el-option>
              <el-option
                label="right"
                value="right"
              ></el-option>
            </el-select>
          </div>
          <div class="custom-column">
            <el-input
              v-model="col.width"
              size="small"
              :disabled="!col.visible"
            ></el-input>
          </div>
          <div class="custom-column cell-center">
            <el-switch
              v-model="col.visible"
              size="small"
            ></el-switch>
          </div>
        </div>
      </template>
    </transition-group>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          round
          @click="initSetting"
        >{{ $tr('dp.reset') }}</el-button>
        <el-button
          type="primary"
          round
          @click="sureSetting"
        >{{ $tr('dp.confirm') }}</el-button>
        <el-button
          round
          @click="colOperateVisible = false"
        >{{ $tr('dp.close') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: 'DpTable'
}
</script>

<script lang="ts" setup>
import { nextTick, ref, toRaw } from 'vue'
import {
  btnClick,
  getApiInfo,
  getFunctionBody,
  columnFormat,
  array2Obj,
  $tr
} from '../use-utils'

import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElButton,
  ElMessage,
  ElSwitch,
  ElDialog,
  ElSelect, ElOption,
  ElInput
} from 'element-plus'
import * as Icons from '@element-plus/icons-vue'
import globalMap from '../global-map'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  searchData: {
    type: Object
  },
  pageId: {
    type: String,
    required: true
  },
  searchStatus: {
    type: Boolean
  },
  hideColumnOperate: {
    type: Boolean
  }
})
const emits = defineEmits(['spreadSearch'])

// 列操作数据
type ColumnDataType = {
  id: string
  name: string
  fixed: string
  width: string
  visible: boolean
}

const commonRequest = globalMap.get('request')

const columnData = ref<ColumnDataType[]>(JSON.parse(localStorage.getItem(props.pageId) || '[]'))
const initHasData = !!columnData.value.length // 有没有之前的缓存设置
const rerenderTable = ref(true)
const colFormats: Record<string, any> = {}
props.data.children?.forEach((col: Record<string, any>) => {
  const properties = col.properties
  // 提取所有列的格式化方法
  if (properties?.format && properties?.prop) {
    colFormats[properties.prop] = {
      format: properties.format,
      extra: properties.extra
    }
  }
  // 提取列操作数据
  if (!initHasData && properties.type !== 'selection') {
    columnData.value.push({
      id: col.id,
      name: properties.label,
      fixed: properties.fixed,
      width: properties.width,
      visible: true
    })
  }
})
const formatValue = (key: string, value: string | number) => {
  const obj: Record<string, string> = colFormats[key]
  return (columnFormat as any)[obj.format](value, obj.extra)
}
const columnRenderData = ref(JSON.parse(JSON.stringify(props.data.children)))
const recalcData = () => {
  rerenderTable.value = false
  let m = columnData.value.length
  let n = columnRenderData.value.length
  let selectionCnt = 0

  for (let i = 0; i < m; i++) {
    for (let j = i + selectionCnt; j < n; j++) {
      if (columnRenderData.value[j].id === columnData.value[i].id) {
        columnRenderData.value[j].properties.fixed = columnData.value[i].fixed
        columnRenderData.value[j].properties.width = columnData.value[i].width
        columnRenderData.value[j].properties.visible = columnData.value[i].visible
        while (columnRenderData.value[i + selectionCnt].properties.type === 'selection') {
          selectionCnt++
        }
        [columnRenderData.value[i + selectionCnt], columnRenderData.value[j]] = [columnRenderData.value[j], columnRenderData.value[i + selectionCnt]]
        break
      }
    }
  }
  nextTick(() => {
    rerenderTable.value = true
  })
}
if (initHasData) {
  recalcData()
}

const {
  // api,
  sumText,
  sumCols,
  pSize
} = toRaw(props.data.properties)
const tableData = ref<Record<string, any>[]>([])
const elTableRef = ref<InstanceType<typeof ElTable>>()
const selectionValue = ref<Record<string, any>[]>([])
let cacheData: Record<string, any>[] = []
let searchData: Record<string, any> = {}

// 展开搜索栏
const spreadSearch = () => {
  emits('spreadSearch', true)
}
// 列操作
const colOperateVisible = ref(false)
const couldDrag = ref(false)
const sortMousedown = () => {
  couldDrag.value = true
}
const sortMouseup = () => {
  couldDrag.value = false
}
const sureSetting = () => {
  colOperateVisible.value = false
  localStorage.setItem(props.pageId, JSON.stringify(columnData.value))
  recalcData()
}
const initSetting = () => {
  localStorage.removeItem(props.pageId)
  colOperateVisible.value = false
  columnData.value = []
  props.data.children?.forEach((col: Record<string, any>) => {
    const properties = col.properties
    // 提取列操作数据
    if (properties.type !== 'selection') {
      columnData.value.push({
        id: col.id,
        name: properties.label,
        fixed: properties.fixed,
        width: properties.width,
        visible: true
      })
    }
  })
  recalcData()
}
const dragstart = (e: DragEvent, index: number) => {
  e.dataTransfer?.setData('index', index + '')
}
const dragover = (e: DragEvent) => {
  e.preventDefault()
}
const drop = (e: DragEvent) => {
  const startIndex = +e.dataTransfer!.getData('index')
  const path = (e as any).path
  let destIndex = null, index = 0
  while (destIndex === null && index < path.length) {
    if (!path[index].dataset?.index) {
      index++
      continue
    }
    destIndex = +path[index].dataset?.index
  }

  if (startIndex === destIndex) {
    return
  }
  // 重排
  columnData.value.splice(destIndex!, 0, columnData.value.splice(startIndex, 1)[0])
}

const paginationAlign: Record<string, string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
}

// 获取table数据请求方法
const getData = (extraParams: Record<string, any> = {}, pageNo?: number) => {
  searchData = { ...extraParams }
  // 添加 table 数据的排序规则
  extraParams.sortRule = props.data.sortables
  const { url, params } = getApiInfo(
    props.data.properties.api,
    props.data.properties.requestParams,
    extraParams,
    props.pageId
  )
  console.log(url, params, 'getData')
  if (url) {
    commonRequest(url, {
      ...extraParams,
      ...params,
      cursor: pageNo || pagination.value.cursor,
      limit: pagination.value.size,
      componentId: props.data.id
    }, props.data.properties.requestType).then((res: Record<string, any>) => {
      console.log(res, 'getTable')
      cacheData = JSON.parse(JSON.stringify(res.result.records))
      tableData.value = res.result.records
      pagination.value.cursor = res.result.current
      pagination.value.total = res.result.total

      // 格式化每一列的值
      tableData.value.forEach((val: Record<string, any>) => {
        for (let key in val) {
          if (Object.prototype.hasOwnProperty.call(val, key)) {
            if (colFormats[key]) {
              val[key] = formatValue(key, val[key])
            }
          }
        }
      })
    })
  }
}
// 获取合并行数据
let sumRow: Record<string, any> | null = null
const getSumRow = (extraParams: Record<string, any> = {}) => {
  const { url, params } = getApiInfo(
    props.data.properties.sumApi,
    props.data.properties.sumRequestParams,
    extraParams,
    props.pageId
  )
  if (url) {
    commonRequest(url, {
      ...extraParams,
      ...params,
      props: props.data.properties.sumCols,
      componentId: props.data.id
    }, props.data.properties.sumRequestType).then((res: Record<string, any>) => {
      sumRow = res.result?.records[0]
      getData(extraParams, 1)
    })
  }

}
const selectionChange = (val: Record<string, any>[]) => {
  selectionValue.value = val
  console.log(val)
}
// 自定义合计函数
const getSummaries = (param: any) => {
  const { columns } = param
  const sums: string[] = new Array(columns.length).fill('')
  // 有值代表后端合并
  if (sumRow) {
    props.data.children?.forEach((col: Record<string, any>, index: number) => {
      const prop = col.properties?.prop
      if (index === 0) {
        sums[index] = sumText
      } else if (colFormats[prop] && sumRow![prop]) {
        sums[index] = formatValue(prop, sumRow![prop])
      }
    })
    return sums
  }
  // 前端合并
  columns.forEach((column: any, index: number) => {
    const prop = column.property
    if (index === 0) {
      sums[index] = sumText
      return
    }
    if (!sumCols.includes(prop)) {
      return
    }

    const values = cacheData.map((item: any) => Number(item[prop]))
    let val = ''
    if (!values.every((value: any) => isNaN(value))) {
      val = values.reduce((prev: any, curr: any) => {
        const value = Number(curr)
        if (!isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)
    }
    if (val && colFormats[prop]) {
      val = formatValue(prop, val)
    }
    sums[index] = val
  })
  return sums
}

const switchChange = (component: Record<string, any>, row: Record<string, any>, val: string | number | boolean) => {
  console.log(
    component, row, 'switch change', val
  )
  const { api, requestType, requestParams, refreshTable } = component.properties
  const { url, params } = getApiInfo(
    api, requestParams, row, props.pageId
  )

  if (url) {
    commonRequest(url, params, requestType).then(() => {
      if (refreshTable) {
        getData(searchData)
      }
    })
  } else if (refreshTable) {
    getData(searchData)
  }
}

// 列插槽条件判断
const showSlot = (col: Record<string, any>, index: any, type: 'front' | 'back') => {
  const childrenNum = col.children?.length || 0
  const pos = col.properties.customBtnPos

  if (type === 'front') {
    if (!col.properties.allowCustomBtn) {
      return true
    }
    if (!pos || isNaN(pos) || pos < 1 || pos > childrenNum) {
      return true
    }
    return pos - 1 > index
  } else {
    if (!col.properties.allowCustomBtn) {
      return false
    }
    if (!pos || isNaN(pos) || pos < 1 || pos > childrenNum) {
      return false
    }
    return pos - 1 <= index
  }
}

// 分页
const pagination = ref<Record<string, any>>({
  cursor: 1,
  size: +pSize,
  total: 400
})
console.log(pagination.value.size, '====')
const handleSizeChange = (val: number) => {
  pagination.value.size = val
  pagination.value.cursor = 1
  getData(searchData)
}
const handleCurrentChange = (val: number) => {
  pagination.value.cursor = val
  getData(searchData)
}

const init = (extraParams: Record<string, any> = {}) => {
  if (props.data.properties.showSum && props.data.properties.sumApi) {
    getSumRow(extraParams)
  } else {
    getData(extraParams, 1)
  }
}
init(props.searchData)

// table 按钮
const tableBtnClick = (btn: Record<string, any>, componentId: string, data?: Record<string, any>) => {
  let params: Record<string, any> = {
    componentId
  }
  // 依赖 table 内部选中数据
  if (btn.depData === 'table') { // table上方按钮
    if (!selectionValue.value?.length) {
      ElMessage({
        showClose: true,
        message: '请先选择table行数据！',
        type: 'warning'
      })
      return
    }
    params = {
      ...params,
      ids: selectionValue.value.map((v: Record<string, any>) => {
        return v.id
      })
    }
  } else if (btn.depData === 'search') { // 需要加入 search 的参数
    params = {
      ...params,
      ...searchData
    }
  } else if (data) { // 行内按钮
    params = {
      ...params,
      ids: [data.id],
      _row: data
    }
  }

  btnClick(btn, {
    params,
    callback: btn.refreshTable || btn.type === 'dialog' ? getData.bind(null, searchData) : undefined
  }, props.pageId)
}

/**
 * 自定义cell文本
 * 
 * demo1
 *  return row.type === '1' ? '完成' : '未完成'
 * 
 * demo2
 *  return row.type === '1' ? {
 *    text: '完成',
 *    style: {
 *      color: 'red'
 *    }
 *  } : '未完成'
 * 
 * demo3
 *  return {
 *    text: parse(row.type, 'prop'),
 *    style: {
 *      color: 'red'
 *    }
 *  }
 */
const cacheFunctionBody = new Map
const cacheParentData = new Map

/**
 * {
 *  label1: 'value1',
 *  label2: 'value2',
 *  label3: 'value3'
 * }
 * 
 * demo:
 * 'label1' => 'value1'
 * ['label1', 'label2'] => 'value1,value2'
 */
const parse = (vals: string[] | string, prop: string) => {
  if (prop === undefined) {
    return vals
  }
  let parent = cacheParentData.get(prop)
  if (typeof vals === 'string') {
    return parent[vals] || vals
  }
  if (Array.isArray(vals)) {
    return vals.map((v: string) => parent[v] || v).join(',')
  }
  return vals
}

const options = globalMap.get(props.pageId).options
const getCustomLabel = (prop: Record<string, any>, row: Record<string, any>, type: 'style' | 'text') => {
  let body: string | undefined = cacheFunctionBody.get(prop.prop)
  // 有父级下拉框数据
  if (prop.parentData && !cacheParentData.has(prop.prop)) {
    cacheParentData.set(prop.prop, array2Obj(options[prop.parentData]))
  }
  if (!body) {
    body = getFunctionBody(prop.customText)
    body && cacheFunctionBody.set(prop.prop, body)
  }
  if (!body) {
    if (type === 'text') {
      return row[prop.prop]
    }
    return {}
  }
  try {
    const newFn = new Function('row, parse', body)
    const res: string | {
      text: string
      style: CSSStyleDeclaration
    } = newFn(row, parse)

    if (typeof res === 'string') {
      if (type === 'style') {
        return {}
      }
      return res
    }
    if (type === 'style') {
      return res?.style || {}
    }
    return res?.text
  } catch (e) {
    console.error(prop.label + '列文本函数内容错误：', e)
  }
}

// 操作栏按钮是否显示
const showCondition = (prop: Record<string, any>, row: Record<string, any>) => {
  let body: string | undefined = cacheFunctionBody.get(prop.prop || 'operate')
  if (!body) {
    body = getFunctionBody(prop.showCondition)
    body && cacheFunctionBody.set(prop.prop, body)
  }
  if (!body) {
    return true
  }
  try {
    const newFn = new Function('row', body)
    return newFn(row)
  } catch (e) {
    console.error(prop.label + '按钮显隐函数内容错误：', e)
  }
}

defineExpose({
  init,
  getData,
  selectionValue,
  elTableRef
})

</script>
