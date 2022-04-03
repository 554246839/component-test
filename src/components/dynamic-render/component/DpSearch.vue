<template>
  <el-form
    v-show="searchStatus"
    ref="searchFormRef"
    class="dynamic-search"
    :label-width="data.properties.labelWidth && (data.properties.labelWidth + 'px')"
    :label-position="data.properties.labelPosition"
    :size="data.properties.size"
    :model="model"
  >
    <el-row :gutter="data.properties.gutter">
      <template
        v-for="field in data.children"
        :key="field.id"
      >
        <el-col :span="+field.properties.span">
          <el-form-item
            :label="$tr(field.properties, pageId)"
            :prop="field.properties.prop"
            :required="field.properties.required"
            :label-width="field.properties.labelWidth && (field.properties.labelWidth + 'px')"
          >
            <template v-if="field.type === 'input'">
              <el-input
                v-model="model[field.properties.prop]"
                :type="field.properties.type"
                :placeholder="field.properties.placeholder"
                :clearable="field.properties.clearable"
                :disabled="field.properties.disabled"
              />
            </template>
            <template v-else-if="field.type === 'select'">
              <el-select
                v-model="model[field.properties.prop]"
                :placeholder="field.properties.placeholder"
                :clearable="field.properties.clearable"
                :disabled="field.properties.disabled"
                :multiple="field.properties.multiple"
                :filterable="field.properties.filterable"
              >
                <template
                  v-for="opt in options[field.properties.optionsId]"
                  :key="opt.value"
                >
                  <el-option
                    :label="opt.label"
                    :value="opt.value"
                  ></el-option>
                </template>
              </el-select>
            </template>
            <template v-else-if="field.type === 'date'">
              <el-date-picker
                v-model="model[field.properties.prop]"
                :placeholder="field.properties.placeholder"
                :disabled-date="setDisabledDate.bind(null, field.properties, model)"
                :clearable="field.properties.clearable"
                :format="field.properties.format || 'YYYY-MM-DD'"
                :value-format="field.properties.valueFormat || 'YYYY-MM-DD'"
                :disabled="field.properties.disabled"
                :type="field.properties.type"
                :range-separator="field.properties.rangeSeparator"
                :start-placeholder="field.properties.startPlaceholder || 'start'"
                :end-placeholder="field.properties.endPlaceholder || 'end'"
              />
            </template>
          </el-form-item>
        </el-col>
      </template>
      <el-col :span="blankSpan"></el-col>
      <el-col
        :span="6"
        class="search-btn"
      >
        <el-button
          type="primary"
          :size="data.properties.size"
          :round="data.properties.round"
          :icon="(Icons as any)[data.properties.searchIcon || 'Search']"
          @click="confirmSearch"
        >{{ $tr('dp.search') }}</el-button>
        <el-button
          :size="data.properties.size"
          :round="data.properties.round"
          :icon="(Icons as any)[data.properties.resetIcon || 'Refresh']"
          @click="resetSearch"
        >{{ $tr('dp.reset') }}</el-button>
        <el-button
          :size="data.properties.size"
          :round="data.properties.round"
          :icon="Icons.Close"
          @click="closeSearchbar"
        >{{ $tr('dp.fold') }}</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts">
export default {
  name: 'DpSearch'
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElForm } from 'element-plus'
import * as Icons from '@element-plus/icons-vue'
import { setDisabledDate, $tr } from '../use-utils'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  pageId: {
    type: String,
    required: true
  },
  blankSpan: {
    type: Number,
    required: true
  },
  defaultValue: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    required: true
  },
  searchStatus: {
    type: Boolean
  }
})
const emits = defineEmits(['confirmSearch', 'resetSearch', 'spreadSearch'])

const model = ref<Record<string, any>>({ ...props.defaultValue })

const searchFormRef = ref<InstanceType<typeof ElForm>>()

const resetSearch = () => {
  searchFormRef.value?.resetFields()
  emits('resetSearch')
}
const confirmSearch = () => {
  emits('confirmSearch', { ...model.value })
}
const closeSearchbar = () => {
  emits('spreadSearch', false)
}
</script>
