<template>
  <div class="gobang">
    <div class="header">
      <span>当前：{{ current ? '白子' : '黑子' }}</span>
      <div class="btns">
        <button @click="restart">重新开始</button>
        <button
          :disabled="!cacheIndex || gameOver"
          @click="popStack"
        >悔棋</button>
      </div>
    </div>
    <canvas
      id="my-canvas"
      ref="canvasRef"
      width="640"
      height="640"
      @click="canvasClick"
    ></canvas>
  </div>
</template>

<script lang="ts" setup>

/**
 * 规则：
 * 大小为 20 * 20
 * 棋盘数据采用稀疏数组
 * 棋子：1 为白色， 0 为黑色
 * 可以悔棋
 * 结束规则，棋盘填满或者有同色棋子连续占领 5 个位置
 */

import { onMounted, ref } from 'vue'
import {
  GobangData,
  drawChessboard,
  drawPieces,
  getPostions,
  isOver,
  cloneDeep
} from './utils'

const canvasRef = ref<InstanceType<typeof HTMLCanvasElement>>()
const rcs = 20
const gap = 30
const radius = 12
const padding = 20
const gameOver = ref(false)
let current = ref<0 | 1>(1)
let ctx: CanvasRenderingContext2D

let data: GobangData = new Array(rcs + 1).fill(0).map(() => new Array(rcs + 1))

// 缓存
const cacheData: GobangData[] = [cloneDeep<GobangData>(data)]
const cacheIndex = ref(0)

const pushStack = (data: GobangData) => {
  cacheData.push(cloneDeep<GobangData>(data))
  cacheIndex.value++
}
const popStack = () => {
  if (cacheIndex.value && !gameOver.value) {
    data = cloneDeep(cacheData[--cacheIndex.value])
    cacheData.length = cacheIndex.value + 1
    init()
  }
}

const restart = () => {
  data = new Array(rcs + 1).fill(0).map(() => new Array(rcs + 1))
  cacheIndex.value = 0
  cacheData.length = 1
  current.value = 1
  gameOver.value = false
  init()
}

const canvasClick = (e: MouseEvent) => {
  if (gameOver.value) {
    return
  }
  const { offsetX, offsetY } = e
  const posi = getPostions(
    offsetX, offsetY, gap, padding, radius
  )
  // 当前位置在放置棋子范围内且没有放置棋子
  if (posi && !data[posi[0]][posi[1]]) {
    data[posi[0]][posi[1]] = current.value
    init()
    pushStack(data)
    const res = isOver(data, posi)
    if (res) {
      gameOver.value = true
      setTimeout(() => {
        const msg = (Array.isArray(res) ? `${data[res[0]][res[1]] ? '白' : '黑'}方获胜！` : '平局！')
        alert('游戏结束，' + msg)
      }, 50)
    }
  }
}

function init() {
  canvasRef.value!.width = 640
  drawChessboard(
    ctx, rcs, gap, padding
  )
  drawPieces(
    ctx, data, gap, padding, radius
  )
  // 换手
  current.value ^= 1
}
onMounted(() => {
  ctx = canvasRef.value!.getContext('2d')!
  init()
})

</script>

<style lang="scss" scope>
.gobang {
  width: 640px;
  margin: 0 auto;
}

.header {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;

  .btns button {
    margin-left: 10px;
    padding: 0 5px;
  }
}

#my-canvas {
  background-color: #e6a23c;
  border-radius: 4px;
}
</style>
