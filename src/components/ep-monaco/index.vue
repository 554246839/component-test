<template>
  <div ref="monacoRef"></div>
</template>

<script lang="ts">
export default {
  name: 'Monaco'
}
</script>

<script lang="ts" setup>
import { nextTick, onMounted, shallowRef } from 'vue'
import * as monaco from 'monaco-editor'

const props = withDefaults(defineProps<{
  modelValue?: string
  language?: string
  isDiff?: boolean
  original?: string
  readonly?: boolean
  modified?: string
  options?: Record<string, unknown>
  override?: Record<string, unknown>
  diffOptions?: Record<string, unknown>
  'onUpdate:modelValue'?: () => void
}>(), {
  modelValue: '',
  language: 'json',
  isDiff: false,
  original: '',
  modified: '',
  readonly: false,
  options: () => ({}),
  override: () => ({}),
  diffOptions: () => ({}),
  'onUpdate:modelValue': () => { }
})
const emits = defineEmits(['update:modelValue'])

const monacoRef = shallowRef<HTMLDivElement>()
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor | monaco.editor.IStandaloneDiffEditor>()

onMounted(() => {
  nextTick(() => {
    if (!props.isDiff) {
      editor.value = monaco.editor.create(monacoRef.value!, {
        theme: 'vs-dark',
        value: props.modelValue,
        language: props.language,
        overviewRulerBorder: false,
        automaticLayout: true,
        mouseWheelZoom: true,
        readOnly: props.readonly,
        foldingStrategy: 'indentation',
        tabSize: 2,
        minimap: {
          enabled: false
        },
        ...props.options
      }, {
        ...props.override,
        verticalHasArrows: false
      })

      editor.value.onDidChangeModelContent(() => {
        emits('update:modelValue', (editor.value as monaco.editor.IStandaloneCodeEditor).getValue())
      })
    } else {
      editor.value = monaco.editor.createDiffEditor(monacoRef.value!, {
        theme: 'vs-dark',
        readOnly: true,
        ...props.diffOptions
      }, props.override)

      if (props.original || props.modified) {
        editor.value.setModel({
          original: monaco.editor.createModel(props.original, props.language),
          modified: monaco.editor.createModel(props.modified, props.language)
        })
      }
    }
  })
})

const updateValue = (val?: string) => {
  if (val) {
    (editor.value as monaco.editor.IStandaloneCodeEditor).setValue(val)
  }
}

defineExpose({
  monacoRef,
  editor,
  updateValue
})
</script>
