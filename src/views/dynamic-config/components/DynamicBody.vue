<template>
  <div
    class="dynamic-mian"
    :style="{ overflow: dialogVisible ? 'hidden' : '' }"
    @dragover="dragover"
    @drop="drop"
    @click="setProperty(dp)"
  >
    <!-- header -->
    <div
      v-if="dp.properties?.title"
      class="page-title"
      @click.stop="setProperty(dp)"
    >
      <h2>{{ dp.properties.title }}</h2>
    </div>
    <!-- search -->
    <div
      v-if="dp.search"
      :class="['page-search', activeComponentId === dp.search.id ? 'dp-active' : '']"
      data-type="search"
      @click.stop="setProperty(dp.search)"
    >
      <el-icon
        class="delete-component"
        @click="deleteComponent(dp, 'search')"
      >
        <component :is="Icons.Close" />
      </el-icon>
      <el-form
        v-if="dp.search.children.length"
        :size="dp.search.properties.size"
        :label-width="dp.search.properties.labelWidth && (dp.search.properties.labelWidth + 'px')"
      >
        <el-row :gutter="20">
          <transition-group
            tag="div"
            name="flip-list"
            class="el-row el-col el-col-24"
          >
            <el-col
              v-for="(cop, index) in dp.search.children"
              :key="cop.id"
              :span="+cop.properties.span || 6"
              :draggable="true"
              :data-sort-index="index"
              data-sort-type="search"
              @mousedown.stop="mousedown(dp.search.children, index, 'search')"
            >
              <el-form-item
                :class="[activeComponentId === cop.id ? 'dp-active' : '']"
                :label="cop.properties.label"
                :label-width="cop.properties.labelWidth && (cop.properties.labelWidth + 'px')"
                @click.stop="setProperty(cop, 'search')"
              >
                <el-icon
                  class="delete-component"
                  @click="deleteComponent(dp.search.children, index)"
                >
                  <component :is="Icons.Close" />
                </el-icon>
                <div style="width: 100%;">
                  <template v-if="cop.type === 'input'">
                    <el-input
                      :size="dp.search.properties.size"
                      disabled
                      :placeholder="cop.properties.placeholder"
                    />
                  </template>
                  <template v-else-if="cop.type === 'select'">
                    <el-input
                      :size="dp.search.properties.size"
                      disabled
                      :placeholder="cop.properties.placeholder"
                    >
                      <template #suffix>
                        <el-icon class="el-input__icon">
                          <component :is="Icons.ArrowDown" />
                        </el-icon>
                      </template>
                    </el-input>
                  </template>
                  <template v-else-if="cop.type === 'date'">
                    <el-date-picker
                      v-model="noop"
                      disabled
                      :size="dp.search.properties.size"
                      :type="cop.properties.type"
                      :range-separator="cop.properties.rangeSeparator"
                      :placeholder="cop.properties.placeholder"
                      :start-placeholder="cop.properties.startPlaceholder || 'start'"
                      :end-placeholder="cop.properties.endPlaceholder || 'end'"
                    ></el-date-picker>
                  </template>
                </div>
              </el-form-item>
            </el-col>
          </transition-group>
        </el-row>
      </el-form>
      <div style="text-align: right;">
        <el-button
          :size="dp.search.properties.size"
          type="primary"
          :round="dp.search.properties.round"
          :icon="(Icons as any)[dp.search.properties.searchIcon]"
        >{{ dp.search.properties.searchBtnText || '搜 索' }}</el-button>
        <el-button
          :size="dp.search.properties.size"
          type="default"
          :round="dp.search.properties.round"
          :icon="(Icons as any)[dp.search.properties.resetIcon]"
        >{{ dp.search.properties.resetBtnText || '重 置' }}</el-button>
      </div>
    </div>
    <!-- main -->
    <div
      v-if="dp.aside || dp.table"
      class="page-main"
      :style="{ paddingLeft: (dp.aside ? dp.aside.properties.width : 0) + 'px' }"
    >
      <!-- aside -->
      <div
        v-if="dp.aside"
        :class="['page-aside', activeComponentId === dp.aside.id ? 'dp-active' : '']"
        data-type="aside"
        :style="{ width: (dp.aside.properties.width || 0) + 'px' }"
        @click.stop="setProperty(dp.aside)"
      >
        <el-icon
          class="delete-component"
          @click="deleteComponent(dp, 'aside')"
        >
          <component :is="Icons.Close" />
        </el-icon>
        <transition-group
          tag="div"
          name="flip-list"
        >
          <span
            key="zheshiyigesuijidekey"
            class="aside-text"
          >叶子节点文本</span>
          <template
            v-for="(btn, index) in dp.aside.children"
            :key="btn.id"
          >
            <el-button
              :class="[activeComponentId === btn.id ? 'dp-active' : '']"
              :type="btn.properties.styleType"
              size="small"
              :icon="(Icons as any)[btn.properties.icon]"
              :round="btn.properties.round"
              :circle="btn.properties.circle"
              :draggable="true"
              :data-sort-index="index"
              data-sort-type="asideBtn"
              @click.stop="setProperty(btn, 'aside')"
              @mousedown.stop="mousedown(dp.aside.children, index, 'asideBtn')"
            >
              <el-icon
                class="delete-component"
                @click="deleteComponent(dp.aside.children, index)"
              >
                <component :is="Icons.Close" />
              </el-icon>
              <span v-if="btn.properties.label">{{ btn.properties.label }}</span>
            </el-button>
          </template>
        </transition-group>
      </div>
      <!-- table -->
      <dynamic-body-table
        :parent="dp"
        :key-field="'table'"
        :active-component-id="activeComponentId"
        @set-property="setProperty"
        @mousedown="mousedown"
        @delete-component="deleteComponent"
      />
    </div>
  </div>
  <!-- dialog -->
  <div
    v-if="dialogVisible"
    class="dynamic-dialog"
  >
    <div class="dialog-mask"></div>
    <div
      class="dialog-main"
      @click.stop="setProperty(activeDialog)"
      @dragover="dragover"
      @drop="drop"
    >
      <div
        :class="['dialog-container', activeComponentId === activeDialog.id ? 'dp-active' : '']"
        :style="{ width: activeDialog.properties?.width }"
        @click.stop="setProperty(activeDialog)"
      >
        <el-icon
          class="close-dialog"
          @click.stop="closeDialog"
        >
          <component :is="Icons.Close" />
        </el-icon>
        <!-- 弹窗头部 -->
        <div class="dialog-header">{{ activeDialog.properties?.title }}</div>
        <!-- 弹窗主体 -->
        <div
          class="dialog-body"
          data-type="dialogBody"
        >
          <el-form
            v-if="activeDialog.children?.length"
            :label-width="activeDialog.properties.labelWidth ? activeDialog.properties.labelWidth + 'px' : ''"
            :label-position="activeDialog.properties.labelPosition"
            :size="activeDialog.properties.size"
          >
            <el-row :gutter="20">
              <transition-group
                tag="div"
                name="flip-list"
                class="el-row el-col el-col-24"
              >
                <el-col
                  v-for="(cop, index) in activeDialog.children"
                  :key="cop.id"
                  :span="+cop.properties?.span || 24"
                  :draggable="true"
                  :data-sort-index="index"
                  data-sort-type="dialogField"
                  @mousedown.stop="mousedown(activeDialog.children, index, 'dialogField')"
                >
                  <el-form-item
                    :class="[activeComponentId === cop.id ? 'dp-active' : '']"
                    :label="cop.type === 'button' ? '' : cop.properties?.label"
                    :label-width="cop.properties.labelWidth ? cop.properties.labelWidth + 'px' : ''"
                    :required="cop.properties.required"
                    @click.stop="setProperty(cop, 'dialog')"
                  >
                    <el-icon
                      class="delete-component"
                      @click="deleteComponent(activeDialog.children, index)"
                    >
                      <component :is="Icons.Close" />
                    </el-icon>
                    <!-- table -->
                    <template v-if="cop.type === 'table'">
                      <dynamic-body-table
                        :parent="activeDialog.children"
                        :key-field="index"
                        :active-component-id="activeComponentId"
                        parent-ele="dialog"
                        @set-property="setProperty"
                        @mousedown="mousedown"
                        @delete-component="deleteComponent"
                      />
                    </template>
                    <!-- input -->
                    <template v-else-if="cop.type === 'input'">
                      <el-input
                        :size="activeDialog.properties.size"
                        disabled
                        :placeholder="cop.properties?.placeholder"
                      />
                    </template>
                    <!-- text -->
                    <template v-else-if="cop.type === 'text'">
                      <template v-if="cop.properties.isCustom">
                        <div :style="parseStyle(cop.properties.style)">自定义文本函数 (动态数据)</div>
                      </template>
                      <template v-else-if="cop.properties.prop">
                        <div
                          :style="parseStyle(cop.properties.style)"
                        >{{ cop.properties.prop }} (动态数据)</div>
                      </template>
                      <template v-else>
                        <div :style="parseStyle(cop.properties.style)">{{ cop.properties.text }}</div>
                      </template>
                    </template>
                    <!-- textarea -->
                    <template v-else-if="cop.type === 'textarea'">
                      <el-input
                        type="textarea"
                        :rows="cop.properties?.rows"
                        :size="activeDialog.properties.size"
                        disabled
                        :placeholder="cop.properties?.placeholder"
                      />
                    </template>
                    <!-- select -->
                    <template v-else-if="cop.type === 'select'">
                      <el-input
                        :size="activeDialog.properties.size"
                        disabled
                        :placeholder="cop.properties.placeholder"
                      >
                        <template #suffix>
                          <el-icon class="el-input__icon">
                            <component :is="Icons.ArrowDown" />
                          </el-icon>
                        </template>
                      </el-input>
                    </template>
                    <!-- download -->
                    <template v-else-if="cop.type === 'download'">
                      <template v-if="cop.properties.prop">
                        <div>{{ cop.properties.prop }} (动态数据)</div>
                      </template>
                      <template v-else>
                        <el-button
                          v-for="downloadItem in cop.children"
                          :key="downloadItem.value"
                          type="text"
                          size="small"
                        >{{ downloadItem.label }}</el-button>
                      </template>
                    </template>
                    <!-- upload -->
                    <template v-else-if="cop.type === 'upload'">
                      <el-upload
                        class="upload-demo"
                        drag
                        multiple
                        disabled
                        action
                      >
                        <el-icon class="el-icon--upload">
                          <component :is="Icons.UploadFilled" />
                        </el-icon>
                        <div class="el-upload__text">
                          Drop file here or
                          <em>click to upload</em>
                        </div>
                        <template #tip>
                          <div class="el-upload__tip">{{ cop.properties.uploadTip }}</div>
                        </template>
                      </el-upload>
                    </template>
                    <!-- checkbox -->
                    <template v-else-if="cop.type === 'checkbox'">
                      <template
                        v-for="checkbox in cop.children"
                        :key="checkbox.value"
                      >
                        <el-checkbox
                          :size="activeDialog.properties.size"
                          :label="checkbox.label"
                          disabled
                        ></el-checkbox>
                      </template>
                    </template>
                    <!-- radio -->
                    <template v-else-if="cop.type === 'radio'">
                      <template
                        v-for="radio in cop.children"
                        :key="radio.value"
                      >
                        <el-radio
                          :size="activeDialog.properties.size"
                          :label="radio.label"
                          disabled
                        ></el-radio>
                      </template>
                    </template>
                    <!-- date -->
                    <template v-else-if="cop.type === 'date'">
                      <el-date-picker
                        v-model="noop"
                        disabled
                        :size="activeDialog.properties.size"
                        :type="cop.properties.type"
                        :placeholder="cop.properties.placeholder"
                      ></el-date-picker>
                    </template>
                    <!-- button -->
                    <template v-else-if="cop.type === 'button'">
                      <el-button
                        :type="cop.properties.styleType"
                        :size="cop.properties.btnSize || activeDialog.properties.size"
                        disabled
                        :icon="(Icons as any)[cop.properties.icon]"
                        :round="cop.properties.round"
                        :circle="cop.properties.circle"
                      >{{ cop.properties.label }}</el-button>
                    </template>
                    <!-- switch -->
                    <template v-else-if="cop.type === 'switch'">
                      <el-switch
                        v-model="cop.properties.defaultValue"
                        disabled
                        :size="activeDialog.properties.size"
                        :active-value="cop.properties.activeValue"
                        :inactive-value="cop.properties.inactiveValue"
                        :active-color="cop.properties.activeColor"
                        :inactive-color="cop.properties.inactiveColor"
                      />
                    </template>
                    <!-- time picker -->
                    <template v-else-if="cop.type === 'time'">
                      <el-time-picker
                        :size="activeDialog.properties.size"
                        disabled
                        :placeholder="cop.properties.placeholder"
                      ></el-time-picker>
                    </template>
                    <template v-else-if="cop.type === 'monaco'">
                      <div
                        :style="{
                          width: cop.properties.width,
                          height: cop.properties.height,
                          backgroundColor: '#f5f7fa',
                          cursor: 'not-allowed',
                          border: '1px solid #dcdfe6'
                        }"
                      ></div>
                    </template>
                    <div
                      v-if="cop.properties?.tip"
                      class="form-item-tip"
                    >{{ cop.properties?.tip }}</div>
                  </el-form-item>
                </el-col>
              </transition-group>
            </el-row>
          </el-form>
        </div>
        <!-- 弹窗底部 -->
        <div
          v-if="activeDialog.properties.showFooter"
          class="dialog-footer"
          data-type="dialogFooter"
          :style="{ textAlign: activeDialog.properties.footerAlign }"
        >
          <transition-group
            tag="div"
            name="flip-list"
          >
            <template
              v-for="(btn, index) in activeDialog.buttons"
              :key="btn.id"
            >
              <el-button
                :class="[activeComponentId === btn.id ? 'dp-active' : '']"
                :type="btn.properties.styleType"
                size="small"
                :icon="(Icons as any)[btn.properties.icon]"
                :round="btn.properties.round"
                :circle="btn.properties.circle"
                :draggable="true"
                :data-sort-index="index"
                data-sort-type="dialogBtn"
                @click.stop="setProperty(btn, 'dialogFooter')"
                @mousedown.stop="mousedown(activeDialog.buttons, index, 'dialogBtn')"
              >
                <el-icon
                  class="delete-component"
                  @click="deleteComponent(activeDialog.buttons, index)"
                >
                  <component :is="Icons.Close" />
                </el-icon>
                <span>{{ btn.properties.label }}</span>
              </el-button>
            </template>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as Icons from '@element-plus/icons-vue'
import { changeTempId, parseStyle } from '../utils'

import DynamicBodyTable from './DynamicBodyTable.vue'

const props = defineProps({
  dp: {
    type: Object,
    required: true
  },
  component: {
    type: Object,
    required: true
  },
  copyComponent: {
    type: Object
  }
})
const emits = defineEmits([
  'setProperty',
  'updateComponent',
  'deleteComponent',
  'update:copyComponent'
])

const noop = ref()
// 控制弹窗设置
const dialogVisible = ref(false)

const dragover = (e: DragEvent) => {
  e.preventDefault()
}
const drop = (e: DragEvent) => {
  const type = e.dataTransfer!.getData('type')
  const path = (e as any).path
  if (!type) {
    // 排序目标位置确定
    let moveDestIndex = 0, i = 0, targetSortType = ''
    while (!moveDestIndex && i < path.length) {
      targetSortType = path[i].dataset?.sortType
      moveDestIndex = path[i++].dataset?.sortIndex
    }
    if (!moveDestIndex || sortType !== targetSortType) {
      ElMessage.warning('组件放置位置错误')
      return
    }
    sortComponent(moveStartIndex, moveDestIndex)
    return
  }
  const componentInfo = JSON.parse(JSON.stringify(props.copyComponent || props.component[type[0].toUpperCase() + type.slice(1)]))
  // 重置
  emits('update:copyComponent', undefined)
  // 更新内部组件id
  changeTempId(componentInfo)

  let key = (e.target as HTMLDivElement).dataset.type
  let index = 0, fieldIndex = 0
  while (!fieldIndex && index < path.length) {
    if (!key) {
      key = path[index].dataset?.type
    }
    fieldIndex = path[index++].dataset?.fieldIndex
  }

  if (!key) {
    if (!componentInfo.bui) {
      ElMessage.warning('ui组件放置在业务组件容器内!')
      return
    }
    if (props.dp[componentInfo.type]) {
      ElMessage.warning(`已存在 ${componentInfo.type} 业务组件!`)
      return
    }
    updateComponent(props.dp, componentInfo, componentInfo.type)
    return
  }

  if (key === 'table') {
    let parent = fieldIndex ? activeDialog.value.children[+fieldIndex] : props.dp.table
    if (type === 'button') {
      updateComponent(parent.buttons, componentInfo)
      return
    }
    if (type !== 'column') {
      ElMessage.warning(`${type} 组件不能放入 ${key} 组件内!`)
      return
    }
    updateComponent(parent.children, componentInfo)
    return
  }
  if (key === 'column') {
    let parent = fieldIndex ? activeDialog.value.children[+fieldIndex] : props.dp.table
    if (type !== 'button' && type !== 'switch') {
      ElMessage.warning(`${type} 组件不能放入 ${key} 组件内!`)
      return
    }
    let columnIndex = null, i = 0
    while (!columnIndex && i < path.length) {
      columnIndex = path[i++].dataset?.colIndex
    }
    columnIndex = +columnIndex
    if (!parent.children[columnIndex].children) {
      parent.children[columnIndex].children = []
    }
    updateComponent(parent.children[columnIndex].children, componentInfo)
    return
  }
  if (key === 'dialogBody') {
    if (!['text', 'button', 'monaco', 'input', 'textarea', 'select', 'download', 'upload', 'checkbox', 'radio', 'switch', 'date', 'table', 'time'].includes(type)) {
      ElMessage.warning(`${type} 组件不能放入 form 组件内!`)
      return
    }
    updateComponent(activeDialog.value.children, componentInfo)
    return
  }
  if (key === 'dialogFooter') {
    if (type !== 'button') {
      ElMessage.warning(`${type} 组件不能放入 dialog 底部!`)
      return
    }
    updateComponent(activeDialog.value.buttons, componentInfo)
    return
  }
  if (
    key === 'search' && !['input', 'select', 'date'].includes(type) ||
    key === 'aside' && type !== 'button') {
    ElMessage.warning(`${type} 组件不能放入 ${key} 组件内!`)
    return
  }
  if (key && props.dp[key]) {
    updateComponent(props.dp[key].children, componentInfo)
  }
}

// 当前操作的组件
const activeComponentId = ref<string>('')
// 当前操作的dialog
const activeDialog = ref<Record<string, any>>({})

// 更新配置
const updateComponent = (parent: Record<string, any> | Record<string, any>[], val: any, key?: string) => {
  emits(
    'updateComponent', parent, val, key
  )
}
// 具体组件
const setProperty = (componentInfo: Record<string, any>, parent?: string) => {
  activeComponentId.value = componentInfo.id
  emits('setProperty', componentInfo, parent)
}
// 删除组件
const deleteComponent = (list: Record<string, any>[] | Record<string, any>, key: number | string) => {
  emits('deleteComponent', list, key)
}
// 关闭弹窗设置
const closeDialog = () => {
  dialogVisible.value = false
  activeComponentId.value = props.dp.id
  activeDialog.value = {}
}
// 打开弹窗
const showTemplate = (temp: Record<string, any>) => {
  dialogVisible.value = false
  nextTick(() => {
    activeDialog.value = temp
    dialogVisible.value = true
    activeComponentId.value = temp.id
  })
}
// 定位已有组件
const fixedPositionComponent = (componentInfo: Record<string, any>, parentComponent: Record<string, any>) => {
  if (parentComponent?.type === 'dialog') {
    showTemplate(parentComponent)
  } else if (dialogVisible.value) {
    dialogVisible.value = false
  }
  setTimeout(() => {
    activeComponentId.value = componentInfo.id
  })
}

// 排序
let moveStartIndex = 0
let sortComponents: Record<string, any>[] = []
let sortType = ''
const mousedown = (list: Record<string, any>[], index: number, type: string) => {
  sortComponents = list
  moveStartIndex = index
  sortType = type
}
const sortComponent = (start: number, end: number) => {
  const val = sortComponents.splice(start, 1)[0]
  sortComponents.splice(end, 0, val)
}

defineExpose({
  showTemplate,
  fixedPositionComponent
})
</script>
