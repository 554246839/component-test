<template>
  <!-- 组件列表 -->
  <div class="dynamic-components">
    <div class="left-tab">
      <h3
        :class="{ active: toggleType === 'property' }"
        @click="toggleType = 'property'"
      >组件列表</h3>
      <h3
        :class="{ active: toggleType === 'list' }"
        @click="toggleType = 'list'"
      >页面组件</h3>
    </div>

    <template v-if="toggleType === 'property'">
      <h4>业务组件</h4>
      <div class="component-list">
        <template
          v-for="item in component"
          :key="item.type"
        >
          <div
            v-if="item.bui && !item.hide"
            class="component"
            :draggable="true"
            @dragstart="dragstart($event, item.type)"
          >{{ item.type }}</div>
        </template>
      </div>
      <h4>ui组件</h4>
      <div class="component-list">
        <template
          v-for="item in component"
          :key="item.type"
        >
          <div
            v-if="!item.bui && !item.hide"
            class="component"
            :draggable="true"
            @dragstart="dragstart($event, item.type)"
          >{{ item.type }}</div>
        </template>
      </div>
      <h4>
        <span>弹窗模板</span>
        <el-icon
          class="createTemplate"
          title="新建模板"
          @click="addDialogTemplate"
        >
          <plus />
        </el-icon>
      </h4>
      <div class="dialog-template-list">
        <template
          v-for="(item, index) in dp.dialogTemplate"
          :key="item.id"
        >
          <div class="dialog-template-item">
            <span
              :class="['dialog-template', item.id === activeDialogId ? 'active-dialog' : '']"
              @click="showTemplate(item)"
            >{{ item.properties.title }}</span>
            <el-icon
              class="handle-dialog"
              title="删除"
              @click="deleteComponent(dp.dialogTemplate, index)"
            >
              <delete />
            </el-icon>
            <el-icon
              class="handle-dialog"
              title="复制"
              @click="copyComponent(dp.dialogTemplate, index)"
            >
              <document-copy />
            </el-icon>
          </div>
        </template>
      </div>
    </template>
    <template v-else-if="toggleType === 'list'">
      <template
        v-for="compt in showComponentList"
        :key="compt.title"
      >
        <template v-if="compt.components.length">
          <div
            class="component-title"
            @click="compt.spread = !compt.spread"
          >
            <h4 :title="compt.title">{{ compt.title }}</h4>
            <el-icon class="spread-icon">
              <arrow-right v-if="!compt.spread" />
              <arrow-down v-else />
            </el-icon>
          </div>
          <div
            v-for="comp in compt.components"
            v-show="compt.spread"
            :key="comp.infos.id"
          >
            <div
              class="left-component-item"
              title="拖动复制"
              :draggable="true"
              @dragstart="dragstart($event, comp.infos.type, comp.infos)"
            >
              <div>
                <span>{{ comp.infos.type }}</span>
                <el-icon
                  class="position"
                  title="定位"
                  @click.stop="fixedPositionComponent(comp.infos, comp.parent, compt.parentComponent)"
                >
                  <position />
                </el-icon>
              </div>
              <div
                class="component-tips"
              >{{ [comp.infos.properties?.label, comp.infos.properties?.prop].join(', ') }}</div>
            </div>
          </div>
        </template>
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { DocumentCopy, Delete, Position, ArrowRight, ArrowDown, Plus } from '@element-plus/icons-vue'
import { getUUID, changeTempId } from '../utils'

const props = defineProps({
  dp: {
    type: Object,
    required: true
  },
  component: {
    type: Object,
    required: true
  }
})
const emits = defineEmits([
  'fixedPositionComponent',
  'updateComponent',
  'showTemplate',
  'getCopyComp',
  'deleteComponent'
])

// 切换属性和组件列表
const toggleType = ref<'property' | 'list'>('property')

// 复制已有组件
const dragstart = (e: DragEvent, type: string, component?: Record<string, any>) => {
  if (component) {
    emits('getCopyComp', component)
  }
  e.dataTransfer?.setData('type', type)
}

// 更新左侧组件列表
type Components = { parent: string, infos: Record<string, any> }[]
const showComponentList = ref<{
  title: string,
  parentComponent: Record<string, any>,
  spread: boolean,
  components: Components
}[]>([])
const updateComponentList = () => {
  showComponentList.value = []
  console.log('更新左侧组件列表')
  let index = 0
  // search
  showComponentList.value[index] = {
    title: 'Search Components',
    parentComponent: props.dp.search,
    spread: true,
    components: props.dp.search?.children.map((comp: Record<string, any>) => {
      return {
        parent: 'search',
        infos: comp
      }
    }) || []
  }
  // aside
  showComponentList.value[++index] = {
    title: 'Aside Components',
    parentComponent: props.dp.aside,
    spread: true,
    components: props.dp.aside?.children.map((comp: Record<string, any>) => {
      return {
        parent: 'aside',
        infos: comp
      }
    }) || []
  }
  // table和dialog递归提取
  // table
  showComponentList.value[++index] = {
    title: 'Table Components',
    parentComponent: props.dp.table,
    spread: true,
    components: []
  }
  drawComponent(props.dp.table, showComponentList.value[index].components, 'table')
  // dialog
  props.dp.dialogTemplate?.forEach((dialog: Record<string, any>) => {
    const container = {
      title: 'Dialog - ' + dialog.properties.title,
      parentComponent: dialog,
      spread: true,
      components: []
    }
    showComponentList.value[++index] = container
    drawComponent(dialog, container.components, 'dialog')
  })
}
// 递归提取所有组件
const drawComponent = (component: Record<string, any>, parent: Components, type: string) => {
  if (!component) {
    return
  }
  component.children?.forEach((child: Record<string, any>) => {
    if (child.type) {
      parent.push({
        parent: type,
        infos: child
      })
      drawComponent(child, parent, child.type)
    }
  })
  component.buttons?.forEach((btn: Record<string, any>) => {
    parent.push({
      parent: type === 'dialog' ? 'dialogFooter' : type,
      infos: btn
    })
  })
}
const fixedPositionComponent = (componentInfo: Record<string, any>, parent: string, parentComponent: Record<string, any>) => {
  emits(
    'fixedPositionComponent',
    componentInfo,
    parent,
    parentComponent
  )
}

// 新增弹窗模板
const addDialogTemplate = () => {
  const temp = JSON.parse(JSON.stringify(props.component.Dialog))
  temp.id = getUUID()
  emits('updateComponent', props.dp.dialogTemplate, temp)
}

// 当前操作的dialog
const activeDialogId = ref('')
const showTemplate = (temp: Record<string, any>) => {
  activeDialogId.value = temp.id
  emits('showTemplate', temp)
}
const deleteComponent = (list: Record<string, any>[] | Record<string, any>, key: number | string) => {
  emits('deleteComponent', list, key)
}
// 复制弹窗组件
const copyComponent = (list: Record<string, any>[], index: number) => {
  const temp: Record<string, any> = JSON.parse(JSON.stringify(list[index]))
  temp.properties.title += ' copy'
  list.splice(index + 1, 0, temp)

  // 替换里面所有组件的id
  changeTempId(temp)
  // 更新左侧组件列表
  updateComponentList()
}

defineExpose({
  updateComponentList
})
</script>
