<template>
  <div
    v-if="parent[keyField]"
    :class="['page-table', activeComponentId === parent[keyField].id && parentEle !== 'dialog' ? 'dp-active' : '']"
    data-type="table"
    :data-field-index="parentEle === 'dialog' ? keyField : ''"
    @click.stop="setProperty(parent[keyField])"
  >
    <el-icon
      v-if="parentEle !== 'dialog'"
      class="delete-component"
      @click="deleteComponent(parent, keyField)"
    >
      <component :is="Icons.Close" />
    </el-icon>
    <!-- table-buttons -->
    <div
      v-if="parent[keyField].buttons.length"
      class="table-buttons"
    >
      <transition-group
        tag="div"
        name="flip-list"
      >
        <template
          v-for="(button, index) in parent[keyField].buttons"
          :key="button.id"
        >
          <el-button
            :class="[activeComponentId === button.id ? 'dp-active' : '']"
            size="small"
            :icon="(Icons as any)[button.properties.icon]"
            :type="button.properties.styleType"
            :round="button.properties.round"
            :circle="button.properties.circle"
            :draggable="true"
            :data-sort-index="index"
            :data-sort-type="parentEle === 'dialog' ? 'dialogTableBtn' : 'tableBtn'"
            @click.stop="setProperty(button, 'table')"
            @mousedown.stop="mousedown(parent[keyField].buttons, index, parentEle === 'dialog' ? 'dialogTableBtn' : 'tableBtn')"
          >
            <el-icon
              class="delete-component"
              @click="deleteComponent(parent[keyField].buttons, index)"
            >
              <component :is="Icons.Close" />
            </el-icon>
            <span>{{ button.properties.label || '文本' }}</span>
          </el-button>
        </template>
      </transition-group>
    </div>
    <!-- table -->
    <div class="table-container">
      <transition-group
        tag="div"
        name="flip-list"
      >
        <div
          v-for="(column, index) in parent[keyField].children"
          :key="column.id"
          class="table-column"
          :class="['page-column', activeComponentId === column.id ? 'dp-active' : '']"
          :draggable="true"
          :data-col-index="index"
          :data-sort-index="index"
          :data-sort-type="parentEle === 'dialog' ? 'dialogColumn' : 'column'"
          :style="{ width: (column.properties.width || 100) + 'px', textAlign: column.properties.align }"
          @mousedown.stop="mousedown(parent[keyField].children, index, parentEle === 'dialog' ? 'dialogColumn' : 'column')"
          @click.stop="setProperty(column, 'table')"
        >
          <el-icon
            class="delete-component"
            @click="deleteComponent(parent[keyField].children, index)"
          >
            <component :is="Icons.Close" />
          </el-icon>
          <!-- table-header -->
          <div class="column-header">
            <template v-if="column.properties.type === 'selection'">
              <el-checkbox
                disabled
                style="height: 30px;"
              ></el-checkbox>
            </template>
            <template v-else>
              <span>{{ column.properties.label }}</span>
            </template>
          </div>
          <!-- column-prop -->
          <div
            class="column-prop"
            :title="column.properties.prop || 'prop'"
          >{{ column.properties.prop || 'prop' }}</div>
          <!-- table-cell -->
          <!-- :data-column-index="index" -->
          <div
            class="column-cell"
            :data-type="column.properties.type === 'operate' ? 'column' : ''"
          >
            <template v-if="column.properties.type === 'operate'">
              <transition-group
                tag="div"
                name="flip-list"
              >
                <template
                  v-for="(child, idx) in column.children"
                  :key="child.id"
                >
                  <template v-if="child.type === 'button'">
                    <el-button
                      :class="[activeComponentId === child.id ? 'dp-active' : '']"
                      :type="child.properties.styleType"
                      size="small"
                      :icon="(Icons as any)[child.properties.icon]"
                      :round="child.properties.round"
                      :circle="child.properties.circle"
                      :draggable="true"
                      :data-sort-index="idx"
                      :data-sort-type="parentEle === 'dialog' ? 'dialogColumnBtn' : 'columnBtn'"
                      @click.stop="setProperty(child, 'column')"
                      @mousedown.stop="mousedown(column.children, idx, parentEle === 'dialog' ? 'dialogColumnBtn' : 'columnBtn')"
                    >
                      <el-icon
                        class="delete-component"
                        @click="deleteComponent(column.children, idx)"
                      >
                        <component :is="Icons.Close" />
                      </el-icon>
                      <span>{{ column.properties.isCustomText ? 'custom' : child.properties.label }}</span>
                    </el-button>
                  </template>
                  <template v-else-if="child.type === 'switch'">
                    <div
                      style="display: inline-block;"
                      :class="[activeComponentId === child.id ? 'dp-active' : '']"
                    >
                      <el-icon
                        class="delete-component"
                        @click="deleteComponent(column.children, idx)"
                      >
                        <component :is="Icons.Close" />
                      </el-icon>
                      <el-switch
                        v-model="noop"
                        disabled
                        :active-value="child.properties.activeValue"
                        :inactive-value="child.properties.inactiveValue"
                        :active-color="child.properties.activeColor"
                        :inactive-color="child.properties.inactiveColor"
                        :draggable="true"
                        :data-sort-index="idx"
                        :data-sort-type="parentEle === 'dialog' ? 'dialogColumnBtn' : 'columnBtn'"
                        @click.stop="setProperty(child, 'column')"
                        @mousedown.stop="mousedown(column.children, idx, parentEle === 'dialog' ? 'dialogColumnBtn' : 'columnBtn')"
                      />
                    </div>
                  </template>
                </template>
              </transition-group>
            </template>
            <template v-else-if="column.properties.type === 'selection'">
              <el-checkbox
                disabled
                style="height: 30px;"
              ></el-checkbox>
            </template>
            <template
              v-else
            >{{ column.properties.isCustomText ? 'custom' : column.properties.type }}</template>
          </div>
        </div>
      </transition-group>
    </div>
    <!-- 分页 -->
    <el-pagination
      v-if="parent[keyField].properties.pagination"
      class="table-pagination"
      :small="true"
      :style="{ justifyContent: paginationAlign[parent[keyField].properties.pAlign] }"
      :current-page="1"
      :page-sizes="parent[keyField].properties.pSizes.split(',')"
      :page-size="+parent[keyField].properties.pSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="40"
      @size-change="handleChange"
      @current-change="handleChange"
    ></el-pagination>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue'
import * as Icons from '@element-plus/icons-vue'

defineProps({
  parent: {
    type: [Object, Array] as PropType<any>,
    required: true
  },
  keyField: {
    type: [String, Number],
    required: true
  },
  activeComponentId: {
    type: String
  },
  parentEle: {
    type: String
  }
})
const emits = defineEmits(['setProperty', 'deleteComponent', 'mousedown'])

const noop = ref<any>('')

const paginationAlign: Record<string, string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
}

const handleChange = () => { }
const setProperty = (componentInfo: Record<string, any>, parent?: string) => {
  emits('setProperty', componentInfo, parent)
}
const mousedown = (list: Record<string, any>[], index: number, type: string) => {
  emits(
    'mousedown', list, index, type
  )
}
const deleteComponent = (list: Record<string, any>[] | Record<string, any>, key: number | string) => {
  emits('deleteComponent', list, key)
}
</script>
