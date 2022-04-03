<template>
  <div class="workflow-top">
    <el-button size="small">锁定</el-button>
  </div>
  <div class="workflow-main">
    <div class="workflow-left">
      <div
        v-for="(component, index) in componentList"
        :key="component.id"
        class="component-item"
        draggable="true"
        @dragstart="dragstart($event, index)"
      >{{ component.label }}</div>
    </div>
    <div
      ref="middleRef"
      class="workflow-middle"
    >
      <div
        ref="maskRef"
        class="mask"
        :style="{
          transform: `translate(${left}px, ${top}px)`
        }"
        @dragover="dragover"
        @drop="drop($event, componentRenderList)"
      >
        <canvas
          id="mask-canvas"
          ref="maskCanvas"
        ></canvas>
        <div
          class="workflow-container"
          data-type="container"
          :style="{ width, height }"
          @mousedown="containerDown"
          @contextmenu="customMenu"
          @click.self="maskClick"
        >
          <div
            v-for="(component, index) in componentRenderList"
            :key="component.id"
            :class="['render-component', activeComponet?.id === component.id && 'active']"
            :style="{
              left: component.attr.x + 'px',
              top: component.attr.y + 'px',
              width: component.attr.w + 'px',
              height: component.attr.h + 'px',
              zIndex: index
            }"
          >
            <div
              class="component-container"
              @click.stop="componentClick(component)"
              @mousedown.stop="componentMouseDown($event, component)"
            >{{ component.label }}</div>
            <div
              class="shape-point up"
              :style="{
                left: component.attr.w * 0.5 + 'px',
                top: 0
              }"
              @mousedown.stop="drawLineStart($event, 'up', component)"
              @mouseup.stop="drawLineEnd('up', component)"
            ></div>
            <div
              class="shape-point right"
              :style="{
                left: component.attr.w + 'px',
                top: component.attr.h * 0.5 + 'px'
              }"
              @mousedown.stop="drawLineStart($event, 'right', component)"
              @mouseup.stop="drawLineEnd('right', component)"
            ></div>
            <div
              class="shape-point down"
              :style="{
                left: component.attr.w * 0.5 + 'px',
                top: component.attr.h + 'px'
              }"
              @mousedown.stop="drawLineStart($event, 'down', component)"
              @mouseup.stop="drawLineEnd('down', component)"
            ></div>
            <div
              class="shape-point left"
              :style="{
                left: 0,
                top: component.attr.h * 0.5 + 'px'
              }"
              @mousedown.stop="drawLineStart($event, 'left', component)"
              @mouseup.stop="drawLineEnd('left', component)"
            ></div>
          </div>
          <!-- 连接线绘制 -->
          <div
            v-for="(cans, index) in canvasList"
            :id="cans.id"
            :key="cans.id"
            class="shape_box"
            :style="{
              left: cans.left + 'px',
              top: cans.top + 'px',
              width: cans.w + 'px',
              height: cans.h + 'px',
              zIndex: index + 1
            }"
          >
            <canvas
              v-show="updateLine"
              class="shape_canvas"
              :width="cans.w"
              :height="cans.h"
            ></canvas>
          </div>
          <!-- 组件拉伸点 -->
          <div
            v-if="activeComponet"
            class="shape-control"
            :style="{
              left: activeComponet.attr.x + 'px',
              top: activeComponet.attr.y + 'px',
              width: activeComponet.attr.w + 'px',
              height: activeComponet.attr.h + 'px',
            }"
            @mousedown.stop="componentMouseDown($event, activeComponet!)"
          >
            <div
              class="shape-point left-up"
              @mousedown.stop="changeSizeStart($event, 'lu', activeComponet!)"
            ></div>
            <div
              class="shape-point right-up"
              @mousedown.stop="changeSizeStart($event, 'ru', activeComponet!)"
            ></div>
            <div
              class="shape-point right-down"
              @mousedown.stop="changeSizeStart($event, 'rd', activeComponet!)"
            ></div>
            <div
              class="shape-point left-down"
              @mousedown.stop="changeSizeStart($event, 'ld', activeComponet!)"
            ></div>
          </div>
          <!-- 范围选择 -->
          <div
            v-show="areaSelect"
            class="area-contaier"
            :style="{
              left: areaPosi?.x + 'px',
              top: areaPosi?.y + 'px',
              width: areaPosi?.w + 'px',
              height: areaPosi?.h + 'px',
            }"
          ></div>
        </div>
      </div>
    </div>
    <div class="workflow-right"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import componentList, { ComponentType, Attr, Direction, CanvasLineType } from './component-list'
import { dragover, drop, dragstart } from './drag-event'
import changeComponentSize, { changeAreaSize } from './change-size'
import { drawGridLine, checkHasLine, calcXY, removeCanvasLine } from './draw-line'
import { getUUID } from './utils'

export default {
  name: 'WorkflowComponent'
}
</script>

<script lang="ts" setup>
const componentRenderList = ref<ComponentType[]>([])
const activeComponet = ref<ComponentType>()
const maskCanvas = ref<HTMLCanvasElement>()
const maskRef = ref<HTMLDivElement>()
const middleRef = ref<HTMLDivElement>()
const canvasList = ref<CanvasLineType[]>([])
const updateLine = ref(true)

let disx = 0
let disy = 0
const left = ref(disx)
const top = ref(disy)
const width = ref('0')
const height = ref('0')
const areaPosi = ref<Attr>()

onMounted(() => {
  const maskWidth = maskRef.value!.offsetWidth
  const maskHeight = maskRef.value!.offsetHeight
  const middleWidth = middleRef.value!.offsetWidth
  const middleHeight = middleRef.value!.offsetHeight

  width.value = `${maskWidth - 80}px`
  height.value = `${maskHeight - 80}px`

  disx = (middleWidth - maskWidth) / 2 - 10
  disy = (middleHeight - maskHeight) / 2 - 10
  left.value = disx
  top.value = disy

  maskCanvas.value!.width = maskWidth - 80
  maskCanvas.value!.height = maskHeight - 80
  drawGridLine(
    maskCanvas.value!.getContext('2d')!, maskWidth - 80, maskHeight - 80, 20
  )

  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('mouseup', mouseUp)
})
onUnmounted(() => {
  document.removeEventListener('mousemove', mouseMove)
  document.removeEventListener('mouseup', mouseUp)
})

let isMoveComponent = false, pagex = 0, pagey = 0, cacheAttr: Attr
// 组件拖动
const componentMouseDown = (e: MouseEvent, component: ComponentType) => {
  isMoveComponent = true
  pagex = e.pageX
  pagey = e.pageY
  cacheAttr = { ...component.attr }
  activeComponet.value = component
}

// 组件点击
const componentClick = (component: ComponentType) => {
  activeComponet.value = component
}

let isPress = false, areaSelect = ref(false)
// 容器鼠标按压
const containerDown = (e: MouseEvent) => {
  e.stopPropagation()
  // 右键拖动容器
  if (e.buttons === 2) {
    isPress = true
    pagex = e.pageX
    pagey = e.pageY
  } else if (e.buttons === 1) {
    areaSelect.value = true
    pagex = e.pageX
    pagey = e.pageY
    areaPosi.value = {
      x: e.offsetX,
      y: e.offsetY,
      w: 0,
      h: 0
    }

    cacheAttr = { ...areaPosi.value }
  }
}
// 容器右键菜单
const customMenu = (e: MouseEvent) => {
  e.preventDefault()
}
// 鼠标移动事件
const mouseMove = (e: MouseEvent) => {
  if (areaSelect.value) {
    changeAreaSize(
      e, pagex, pagey, areaPosi.value!, cacheAttr
    )
  } else if (isPress) {
    // 拖动画布
    left.value = disx + e.pageX - pagex
    top.value = disy + e.pageY - pagey
  } else if (isMoveComponent) {
    // 拖动组件
    activeComponet.value!.attr.x = cacheAttr.x + e.pageX - pagex
    activeComponet.value!.attr.y = cacheAttr.y + e.pageY - pagey
  } else if (drawLineStatus) {
    // 连线
    updateLine.value = false
    const x = e.pageX - pagex
    const y = e.pageY - pagey

    canvasLine.w = cacheLine.w + Math.abs(x)
    canvasLine.h = cacheLine.h + Math.abs(y)
    canvasLine.left = cacheLine.left + Math.min(x, 0)
    canvasLine.top = cacheLine.top + Math.min(y, 0)
    nextTick(() => {
      updateLine.value = true
    })
  } else if (changeSizeStatus) {
    // 调整组件大小
    changeComponentSize(
      e, activeComponet.value!, direction, pagex, pagey, cacheAttr
    )
  }
}
const mouseUp = () => {
  if (isPress) {
    isPress = false
    disx = left.value
    disy = top.value
  } else if (isMoveComponent) {
    setTimeout(() => {
      isMoveComponent = false
    })
  } else if (drawLineStatus) {
    drawLineStatus = false
    // 没有连接到组件，删除当前连接线
    removeCanvasLine(canvasList.value, canvasLine)
  } else if (changeSizeStatus) {
    changeSizeStatus = false
  } else if (areaSelect.value) {
    areaSelect.value = false
  }
}

const maskClick = (e: MouseEvent) => {
  if (!drawLineStatus && !isMoveComponent) {
    activeComponet.value = undefined
  }
}

let drawLineStatus = false
let directionStart: Direction
let directionEnd: Direction
let canvasLine: CanvasLineType
let cacheLine: CanvasLineType
const drawLineStart = (e: MouseEvent, type: Direction, component: ComponentType) => {
  drawLineStatus = true
  activeComponet.value = component
  directionStart = type
  pagex = e.pageX
  pagey = e.pageY

  const { x, y } = calcXY(type, component)

  // 创建canvas，绘制连接线
  canvasLine = {
    id: getUUID(),
    startx: x,
    starty: y,
    endx: x,
    endy: y,
    w: 0,
    h: 0,
    left: x,
    top: y,
  }
  cacheLine = { ...canvasLine }
  canvasList.value.push(canvasLine)
}
const drawLineEnd = (type: Direction, component: ComponentType) => {
  directionEnd = type
  if (activeComponet.value !== component || directionStart !== type || !checkHasLine(type, activeComponet.value.props.next, component)) {
    activeComponet.value?.props.next.push({
      id: component.id,
      directionStart,
      directionEnd
    })
  }
  drawLineStatus = false
}

let changeSizeStatus = false
let direction: 'lu' | 'ru' | 'rd' | 'ld'
const changeSizeStart = (e: MouseEvent, type: 'lu' | 'ru' | 'rd' | 'ld', component: ComponentType) => {
  changeSizeStatus = true
  direction = type
  pagex = e.pageX
  pagey = e.pageY
  cacheAttr = { ...component.attr }
}

</script>

<style lang="scss">
@import "./index.scss";
</style>
