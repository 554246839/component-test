<template>
  <div class="workflow-top">
    <el-button
      size="small"
      :disabled="currentComponentIndex <= 0"
      @click="undo"
    >撤销</el-button>
    <el-button
      size="small"
      :disabled="currentComponentIndex >= cacheComponentList.length - 1"
      @click="redo"
    >恢复</el-button>
    <el-button
      size="small"
      disabled
    >锁定</el-button>
    <el-button
      :type="lineType === 'straight' ? 'primary' : 'default'"
      size="small"
      @click="changelineType('straight')"
    >直线</el-button>
    <el-button
      :type="lineType === 'broken' ? 'primary' : 'default'"
      size="small"
      @click="changelineType('broken')"
    >折线</el-button>
    <!-- <el-button
      :type="lineType === 'bezier' ? 'primary' : 'default'"
      size="small"
      @click="changelineType('bezier')"
    >曲线</el-button>-->
    <el-button
      size="small"
      @click="clearCanvas"
    >清空画布</el-button>
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
        @drop="ondrop($event, componentRenderList)"
      >
        <canvas
          id="mask-canvas"
          ref="maskCanvas"
        ></canvas>
        <div
          class="workflow-container"
          data-type="container"
          :style="{ width, height, cursor: canvasCursor }"
          @mousedown="containerDown"
          @contextmenu="customMenu"
          @mousemove.self="canvasMove"
          @click.self="maskClick"
          @dblclick.self="maskDbClick"
        >
          <div
            v-for="(component, index) in componentRenderList"
            :key="component.id"
            :class="['render-component', isSelectedComponent(component.id) && 'active']"
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
              @mousedown.stop="componentMouseDown($event, component)"
              @mouseup.stop="drawLineEnd($event, 'parent', component)"
              @mousemove.self="componentMouseMove($event, component)"
              @mouseleave="drawLineLeave"
            >{{ editStatus && activeComponet === component ? '' : component.label }}</div>
            <div
              class="shape-point up"
              :style="{
                left: component.attr.w * 0.5 + 'px',
                top: 0
              }"
              @mousedown.stop="drawLineStart($event, 'up', component)"
              @mouseup.stop="drawLineEnd($event, 'up', component)"
              @mouseover.self="drawLineOver('up', component)"
              @mouseleave.self="drawLineLeave"
            ></div>
            <div
              class="shape-point right"
              :style="{
                left: component.attr.w + 'px',
                top: component.attr.h * 0.5 + 'px'
              }"
              @mousedown.stop="drawLineStart($event, 'right', component)"
              @mouseup.stop="drawLineEnd($event, 'right', component)"
              @mouseover.self="drawLineOver('right', component)"
              @mouseleave.self="drawLineLeave"
            ></div>
            <div
              class="shape-point down"
              :style="{
                left: component.attr.w * 0.5 + 'px',
                top: component.attr.h + 'px'
              }"
              @mousedown.stop="drawLineStart($event, 'down', component)"
              @mouseup.stop="drawLineEnd($event, 'down', component)"
              @mouseover.self="drawLineOver('down', component)"
              @mouseleave.self="drawLineLeave"
            ></div>
            <div
              class="shape-point left"
              :style="{
                left: 0,
                top: component.attr.h * 0.5 + 'px'
              }"
              @mousedown.stop="drawLineStart($event, 'left', component)"
              @mouseup.stop="drawLineEnd($event, 'left', component)"
              @mouseover.self="drawLineOver('left', component)"
              @mouseleave.self="drawLineLeave"
            ></div>
          </div>
          <!-- 组件拉伸点 -->
          <div
            v-if="activeComponet && areaPoint"
            class="shape-control"
            :style="{
              left: areaPoint.x + 'px',
              top: areaPoint.y + 'px',
              width: areaPoint.w + 'px',
              height: areaPoint.h + 'px',
            }"
            @dblclick="changeWriteStatus"
            @mousedown.stop="componentMouseDown($event, activeComponet!, true)"
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
            <div
              v-show="editStatus && selectedComponents.length < 2"
              ref="editorContainerRef"
              class="text-content"
              contenteditable
              @blur="writeContainerBlur"
              @keydown.enter="writeContainerBlur"
              v-text="activeComponet.label"
            ></div>
          </div>
          <!-- 所有的线文本展示 -->
          <div
            v-for="extra in lineExtraInfos"
            :key="extra.id"
            class="line-extrainfo"
            :style="{
              left: extra.point[0] + 'px',
              top: extra.point[1] + 'px'
            }"
            @dblclick.stop="editExtraInfo(extra)"
          >{{ extra.text }}</div>
          <!-- 线文本信息编辑 -->
          <div
            v-if="editExtraInfoStatus"
            ref="editExtraInfoRef"
            class="line-extrainfo editing"
            contenteditable
            :style="{
              left: activeExtraInfo?.point[0] + 'px',
              top: activeExtraInfo?.point[1] + 'px'
            }"
            @blur="editExtraInfoBlur"
            @keydown.enter="editExtraInfoBlur"
            v-text="activeExtraInfo?.text"
          ></div>
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
          <!-- 吸附线 -->
          <div
            v-show="adsordPoint[1] !== null"
            class="adsorb-line coord-x"
            :style="{
              top: adsordPoint[1] + 'px'
            }"
          ></div>
          <div
            v-show="adsordPoint[0] !== null"
            class="adsorb-line coord-y"
            :style="{
              left: adsordPoint[0] + 'px'
            }"
          ></div>
        </div>
      </div>
    </div>
    <div class="workflow-right"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref, nextTick, computed } from 'vue'
import { ComponentType, Attr, Direction, Quadrant, LineType, LineInfo, EditingLineInfo } from './type'
import componentList from './component-list'
import { dragover, drop, dragstart } from './drag-event'
import changeComponentSize, { changeAreaSize } from './change-size'
import drawLine, { drawCacheLine, drawGridLine, checkHasLine, calcXY } from './calc-line-point/draw-line'
import {
  getPosition, getUUID, isAboveLine, removeLine, removeComponent,
  selectAllContent, updateComponentLineText, getSelectedComponent
} from './utils'
import { calcLineData, getComponentPosition } from './calc-line-data'
import { clearupPostions, getAdsordXY } from './adsorb'

export default {
  name: 'WorkflowComponent'
}
</script>

<script lang="ts" setup>
const componentRenderList = ref<ComponentType[]>([]) // 已渲染的组件列表
const selectedComponents = ref<ComponentType[]>([])
const activeComponet = ref<ComponentType>() // 当前选中的组件
const maskCanvas = ref<HTMLCanvasElement>() // canvas dom 实例
const editorContainerRef = ref<HTMLDivElement>()  // 组件的可编辑容器
const maskRef = ref<HTMLDivElement>() // 背景 dom 实例
const middleRef = ref<HTMLDivElement>() // 中间渲染实例
const editStatus = ref(false) // 组件信息编辑状态
const lineType = ref<LineType>('broken')  // 当前线类型
const allLinePoints = ref<LineInfo[]>([]) // 所有连线的坐标点
const areaPoint = ref<Attr>() // 组件拉伸点的坐标
let cacheLineType: LineType = 'broken'  // 缓存线类型
let ctx: CanvasRenderingContext2D // canvas 2d 实例
let canvasWidth: number
let canvasHeight: number
let activeLinePoints: LineInfo  // 正在拖拽绘制的连线

// 撤销和恢复操作
const cacheComponentList = ref<ComponentType[][]>([[]])
const currentComponentIndex = ref(0)
// 撤销
const undo = () => {
  componentRenderList.value = JSON.parse(JSON.stringify(cacheComponentList.value[--currentComponentIndex.value]))
  updateCanvas(true)
  cancelSelected()
  activeComponet.value = undefined
}
// 恢复
const redo = () => {
  componentRenderList.value = JSON.parse(JSON.stringify(cacheComponentList.value[++currentComponentIndex.value]))
  updateCanvas(true)
  cancelSelected()
  activeComponet.value = undefined
}
// 缓存入栈
const chacheStack = () => {
  if (cacheComponentList.value.length - 1 > currentComponentIndex.value) {
    cacheComponentList.value.length = currentComponentIndex.value + 1
  }
  cacheComponentList.value.push(JSON.parse(JSON.stringify(componentRenderList.value)))
  currentComponentIndex.value++
}


let disx = 0
let disy = 0
const left = ref(disx)
const top = ref(disy)
const width = ref('0')
const height = ref('0')
const areaPosi = ref<Attr>()
const adsordPoint = ref<(number | null)[]>([null, null])

const lineExtraInfos = computed(() => {
  const infos: EditingLineInfo[] = []
  for (const val of allLinePoints.value) {
    if (val.extra) {
      infos.push({
        point: val.centerPoint,
        text: val.extra,
        id: val.id!
      })
    }
  }
  return infos
})

onMounted(() => {
  const maskWidth = maskRef.value!.offsetWidth
  const maskHeight = maskRef.value!.offsetHeight
  const middleWidth = middleRef.value!.offsetWidth
  const middleHeight = middleRef.value!.offsetHeight

  ctx = maskCanvas.value!.getContext('2d')!

  width.value = `${maskWidth - 80}px`
  height.value = `${maskHeight - 80}px`

  disx = (middleWidth - maskWidth) / 2 - 10
  disy = (middleHeight - maskHeight) / 2 - 10
  left.value = disx
  top.value = disy

  canvasWidth = maskWidth - 80
  canvasHeight = maskHeight - 80
  maskCanvas.value!.width = canvasWidth
  maskCanvas.value!.height = canvasHeight
  drawGridLine(
    ctx, canvasWidth, canvasHeight, 20
  )

  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('mouseup', mouseUp)
  document.addEventListener('keydown', keydown)
})
onUnmounted(() => {
  document.removeEventListener('mousemove', mouseMove)
  document.removeEventListener('mouseup', mouseUp)
  document.removeEventListener('keydown', keydown)
})

const ondrop = (e: DragEvent, componentRenderList: ComponentType[]) => {
  cancelSelected()
  drop(e, componentRenderList)
  chacheStack()
}

let isMoveComponent = false, pagex = 0, pagey = 0, cacheAttr: Attr
let otherCoords: Set<number>[] = [], allSelectdAttr: Attr[] = []
// 组件拖动
const componentMouseDown = (e: MouseEvent, component: ComponentType, isMask?: boolean) => {
  if (editStatus.value) {
    return
  }
  if (!isMask) {
    cancelSelected()
  }
  // 解决一个组件在编辑的状态，直接点击另一个组件，导致之前的编辑内容保存失败
  setTimeout(() => {
    if (hasSelectComponent) {
      isMoveComponent = true
      pagex = e.pageX
      pagey = e.pageY
      cacheAttr = { ...areaPoint.value as Attr }
      allSelectdAttr = selectedComponents.value.map((component: ComponentType) => {
        return { ...component.attr }
      })
      return
    }
    isMoveComponent = true
    pagex = e.pageX
    pagey = e.pageY
    cacheAttr = { ...component.attr }
    activeComponet.value = component
    areaPoint.value = component.attr
    otherCoords = clearupPostions(componentRenderList.value, component.id)
  })
}
// 获取连线状态下，组件悬浮下的就近连接点
const componentMouseMove = (e: MouseEvent, component: ComponentType) => {
  if (!drawLineStatus) { return }
  directionEnd = getPosition(component, e.offsetX, e.offsetY)
  targetComponent = component
}

let isPress = false, areaSelect = ref(false), hasSelectComponent = false
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
    otherCoords = []
    cancelSelected()
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
const canvasCursor = ref('default')
let lastAboveLine: LineInfo | null // 最后一根鼠标接触过的线
let highlightLine: LineInfo | null // 当前高亮的线
let isAbove = false // 是否在线上
// 无状态下鼠标下是否有线
const canvasMove = (e: MouseEvent) => {
  if (
    !areaSelect.value &&
    !isPress &&
    !isMoveComponent &&
    !drawLineStatus &&
    !changeSizeStatus
  ) {
    // 计算当前移动的点是否有在线上
    const { offsetX, offsetY } = e
    const result = isAboveLine(offsetX, offsetY, allLinePoints.value)

    canvasCursor.value = 'default'
    isAbove = false
    // 返回当前的线
    if (result) {
      canvasCursor.value = 'pointer'
      lastAboveLine = result
      isAbove = true
    }
  }
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
    if (otherCoords.length) {
      // 检查是否有吸附坐标
      const x = cacheAttr.x + e.pageX - pagex
      const y = cacheAttr.y + e.pageY - pagey
      let adsordInfo = getAdsordXY(
        otherCoords, x, y, activeComponet.value!.attr.w, activeComponet.value!.attr.h
      )
      activeComponet.value!.attr.x = adsordInfo.x
      activeComponet.value!.attr.y = adsordInfo.y
      updateCanvas(true)
      adsordPoint.value = [adsordInfo.linex, adsordInfo.liney]
    } else {
      const x = e.pageX - pagex
      const y = e.pageY - pagey
      selectedComponents.value.forEach((component: ComponentType, index: number) => {
        component!.attr.x = allSelectdAttr[index].x + x
        component!.attr.y = allSelectdAttr[index].y + y
        areaPoint.value!.x = cacheAttr.x + x
        areaPoint.value!.y = cacheAttr.y + y
      })
      updateCanvas(true)
    }
  } else if (drawLineStatus) {
    updateCanvas()

    // 连线
    const x = e.pageX - pagex
    const y = e.pageY - pagey

    let destx = startx + x
    let desty = starty + y

    if (directionEnd) {
      ([destx, desty] = getComponentPosition(targetComponent, directionEnd))
    }

    activeLinePoints = drawLine({
      ctx,
      startx,
      starty,
      startDire: directionStart,
      destx,
      desty,
      destDire: directionEnd,
      w: activeComponet.value!.attr.w,
      h: activeComponet.value!.attr.h,
      dw: targetComponent?.attr.w,
      dh: targetComponent?.attr.h,
      type: lineType.value
    })
  } else if (changeSizeStatus) {
    // 调整组件大小
    if (hasSelectComponent) {
      selectedComponents.value.forEach((component: ComponentType, index: number) => {
        changeComponentSize(
          e, component, quadrant, pagex, pagey, allSelectdAttr[index], areaPoint.value, cacheAttr
        )
      })
    } else {
      changeComponentSize(
        e, activeComponet.value!, quadrant, pagex, pagey, cacheAttr
      )
    }

    updateCanvas(true)
  }
}
// 全局 up 事件
const mouseUp = () => {
  if (isPress) {
    isPress = false
    disx = left.value
    disy = top.value
  } else if (isMoveComponent) {
    setTimeout(() => {
      isMoveComponent = false
      // 判断是否有移动
      if (cacheAttr.x !== activeComponet.value?.attr.x || cacheAttr.y !== activeComponet.value.attr.y) {
        chacheStack()
      }
      adsordPoint.value = [null, null]
    })
  } else if (drawLineStatus) {
    drawLineStatus = false
    directionEnd = undefined
    updateCanvas()
  } else if (changeSizeStatus) {
    changeSizeStatus = false
    chacheStack()
  } else if (areaSelect.value) {
    areaSelect.value = false
    const areaInfo = getSelectedComponent(componentRenderList.value, areaPosi.value!)
    if (areaInfo) {
      areaPoint.value = areaInfo.selectedArea
      activeComponet.value = areaInfo.selectedComponents[0]
      hasSelectComponent = true
      selectedComponents.value = areaInfo.selectedComponents
    }
  }
}

// 判断该组件是否被选中
const isSelectedComponent = (componentId: string) => {
  return activeComponet.value?.id === componentId ||
    selectedComponents.value.find((component: ComponentType) => component.id === componentId)
}

// 删除组件和线
const keydown = (e: KeyboardEvent) => {
  if (e.key === 'Delete') {
    // 删除选中组件
    if (hasSelectComponent) {
      selectedComponents.value.forEach((component: ComponentType) => {
        removeComponent(componentRenderList.value, allLinePoints.value, component.id)
      })
      cancelSelected()
      updateCanvas()
      chacheStack()
    } else if (activeComponet.value) { // 删除组件
      removeComponent(componentRenderList.value, allLinePoints.value, activeComponet.value.id)
      activeComponet.value = undefined
      updateCanvas()
      chacheStack()
    } else if (highlightLine) { // 删除线
      removeLine(
        componentRenderList.value, allLinePoints.value, highlightLine.id!, true
      )
      updateCanvas()
      chacheStack()
    }
  }
}

// 画布点击
let clickNum = 0
const maskClick = () => {
  // 这里需要判断之前动作是否是范围选择, 是否有选中组件
  if (!drawLineStatus && !isMoveComponent && !hasSelectComponent) {
    cancelSelected()
  }
  setTimeout(() => {
    // 防止单击和双击同时执行
    if (isDbClick) {
      if (++clickNum === 2) {
        isDbClick = false
        clickNum = 0
      }
      return
    }

    if (isAbove) {
      updateCanvas(false, lastAboveLine!)
    } else if (highlightLine) {
      updateCanvas()
      highlightLine = null
    }
  }, 200)
}

let isDbClick = false
const maskDbClick = () => {
  isDbClick = true

  // 计算当前高亮线条的中间坐标点
  if (isAbove) {
    const targetExtra = lineExtraInfos.value.find((extra: EditingLineInfo) => {
      return extra.id === lastAboveLine?.id
    })
    editExtraInfo(targetExtra || {
      id: lastAboveLine!.id!,
      text: '',
      point: lastAboveLine!.centerPoint
    })
  }
}

let drawLineStatus = false
let directionStart: Direction
let directionEnd: Direction | undefined
let targetComponent: ComponentType
let startx: number
let starty: number
// 连线起点
const drawLineStart = (e: MouseEvent, type: Direction, component: ComponentType) => {
  drawLineStatus = true
  activeComponet.value = component
  areaPoint.value = component.attr
  directionStart = type
  directionEnd = undefined
  pagex = e.pageX
  pagey = e.pageY

  const { x, y } = calcXY(type, component)
  startx = x
  starty = y
}
// 连线状态进入组件
const drawLineOver = (type: Direction, component: ComponentType) => {
  if (drawLineStatus && (activeComponet.value !== component || type !== directionStart)) {
    directionEnd = type
    targetComponent = component
  }
}
// 离开组件
const drawLineLeave = () => {
  if (drawLineStatus) {
    directionEnd = undefined
  }
}
// 连线结束
const drawLineEnd = (e: MouseEvent, type: Direction | 'parent', component: ComponentType) => {
  if (isMoveComponent) {
    isMoveComponent = false
  }
  if (!drawLineStatus) {
    return
  }
  let direction
  if (type === 'parent') {
    direction = getPosition(component, e.offsetX, e.offsetY)
  }
  directionEnd = direction || type as Direction
  const id = getUUID()
  if (activeComponet.value !== component || directionStart !== type || !checkHasLine(type, activeComponet.value.props.next, component)) {
    activeComponet.value?.props.next.push({
      id,
      targetComponentId: component.id,
      directionStart,
      directionEnd,
      lineType: lineType.value,
      extra: ''
    })
    allLinePoints.value.push({ ...activeLinePoints, id })
    chacheStack()
  }
  drawLineStatus = false
}

let changeSizeStatus = false
let quadrant: Quadrant // 四象限
// 四个角拖拽改变组件大小
const changeSizeStart = (e: MouseEvent, type: Quadrant, component: ComponentType) => {
  changeSizeStatus = true
  quadrant = type
  pagex = e.pageX
  pagey = e.pageY
  if (hasSelectComponent) {
    cacheAttr = { ...areaPoint.value as Attr }
    allSelectdAttr = selectedComponents.value.map((component: ComponentType) => {
      return { ...component.attr }
    })
  } else {
    cacheAttr = { ...component.attr }
  }
}

/**
 * 更新canvas
 * @param update 是否更新全部line
 */
const updateCanvas = (update = false, al?: LineInfo) => {
  maskCanvas.value!.width = canvasWidth
  maskCanvas.value!.height = canvasHeight

  // 绘制网格线
  drawGridLine(
    ctx, canvasWidth, canvasHeight, 20
  )

  // 改变tab上线的类型状态
  if (al) {
    highlightLine = al
    lineType.value = al.type
  } else {
    lineType.value = cacheLineType
  }

  // 不更新
  if (!update) {
    if (allLinePoints.value.length) {
      allLinePoints.value.forEach((lineInfo: LineInfo) => {
        const highlight = !!al && lineInfo.id === al.id
        drawCacheLine(
          ctx, lineInfo.type, lineInfo.points, highlight
        )
      })
    }
    return
  }

  const lines = calcLineData(componentRenderList.value)
  allLinePoints.value.length = 0
  if (lines.length) {
    lines.forEach((v: any) => {
      allLinePoints.value.push(drawLine({ ctx, ...v }))
    })
  }
}

// 改变类型
const changelineType = (type: LineType) => {
  lineType.value = type
  // 更改高亮线的类型
  if (highlightLine && highlightLine.type !== type) {
    for (let c = 0; c < componentRenderList.value.length; c++) {
      const next = componentRenderList.value[c].props.next
      for (let i = 0; i < next.length; i++) {
        if (next[i].id === highlightLine.id) {
          next[i].lineType = type
          updateCanvas(true)
          chacheStack()
          return
        }
      }
    }
  }
  // 缓存线类型
  cacheLineType = type
}

// 清空画布
const clearCanvas = () => {
  activeComponet.value = undefined
  componentRenderList.value = []
  allLinePoints.value.length = 0
  updateCanvas()
  chacheStack()
}

// 双击编辑组件label
const changeWriteStatus = () => {
  if (hasSelectComponent && selectedComponents.value.length > 1) {
    return
  }
  editStatus.value = true
  nextTick(() => {
    selectAllContent(editorContainerRef.value!)
  })
}

// 组件编辑失焦
const writeContainerBlur = (e: FocusEvent | KeyboardEvent) => {
  editStatus.value = false
  if (activeComponet.value) {
    const val = (e.target as HTMLDivElement).innerText.trim()
    if (activeComponet.value.label !== val) {
      activeComponet.value.label = val
      chacheStack()
    }
  }
}

// 编辑线的信息
const editExtraInfoRef = ref<HTMLDivElement>()
const editExtraInfoStatus = ref(false)
const activeExtraInfo = ref<EditingLineInfo>()
const editExtraInfo = (extra: EditingLineInfo) => {
  editExtraInfoStatus.value = true
  activeExtraInfo.value = extra
  nextTick(() => {
    selectAllContent(editExtraInfoRef.value!)
  })
}
// 保存编辑的信息
const editExtraInfoBlur = () => {
  editExtraInfoStatus.value = false
  const val = editExtraInfoRef.value?.innerText
  if (val) {
    if (updateComponentLineText(
      componentRenderList.value, allLinePoints.value, activeExtraInfo.value!.id, val.trim()
    )) {
      chacheStack()
    }
  }
}

// 选中组件列表状态取消
const cancelSelected = () => {
  hasSelectComponent = false
  selectedComponents.value = []
  activeComponet.value = undefined
  areaPoint.value = undefined
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
