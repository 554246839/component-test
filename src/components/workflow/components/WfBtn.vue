<template>
  <el-button
    size="small"
    :disabled="currentComponentIndex <= 0"
    @click="undo"
  >撤销</el-button>
  <el-button
    size="small"
    :disabled="currentComponentIndex >= cachelength - 1"
    @click="redo"
  >恢复
  </el-button>
  <el-button
    :type="lineType === 'straight' ? 'primary' : 'default'"
    size="small"
    @click="changelineType('straight')"
  >
    直线</el-button>
  <el-button
    :type="lineType === 'broken' ? 'primary' : 'default'"
    size="small"
    @click="changelineType('broken')"
  >折线
  </el-button>
  <el-button
    :type="lineType === 'bezier' ? 'primary' : 'default'"
    size="small"
    @click="changelineType('bezier')"
  >曲线
  </el-button>
  <el-button
    size="small"
    @click="clearCanvas"
  >清空画布</el-button>
</template>

<script lang="ts" setup>
import WF from '../type'

defineProps({
  currentComponentIndex: {
    type: Number,
    required: true
  },
  cachelength: {
    type: Number,
    required: true
  },
  lineType: {
    type: String,
    required: true
  }
})

const emits = defineEmits(['changelineType', 'clearCanvas', 'undo', 'redo'])
// 撤销
const undo = () => {
  emits('undo')
}
// 恢复
const redo = () => {
  emits('redo')
}

const changelineType = (type: WF.LineType) => {
  emits('changelineType', type)
}
const clearCanvas = () => {
  emits('clearCanvas')
}
</script>
