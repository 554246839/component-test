/**
 * Description: 五子棋脚本
 * Created Date: 2022-07-02 23:17:51
 * Author: Kang Dong
 */

export type GobangData = (0 | 1 | undefined)[][]

//           右上      左下       右      左          右下    左上        下      上
const ds = [[[-1, 1], [1, -1]], [[0, 1], [0, -1]], [[1, 1], [-1, -1]], [[1, 0], [-1, 0]]]

/**
 * 判读当前坐标是否满足结束要求
 * @param {GobangData} data 棋盘数据
 * @param {number} x x 轴
 * @param {number} y y 轴
 * @param {number} m 最大行数
 * @param {number} n 最大列数
 * @returns {boolean}
 */
function getPostionResult(
  data: GobangData, x: number, y: number, m: number, n: number
) {
  const val = data[x][y]

  for (let i = 0; i < ds.length; i++) {
    const [[lx, ly], [rx, ry]] = ds[i]
    let nx = x, ny = y, cnt = 1
    for (let j = 0; j < 4; j++) {
      nx += lx
      ny += ly
      if (!(nx >= 0 && nx < m && ny >= 0 && ny < n) || data[nx][ny] !== val) {
        break
      }
      cnt++
    }

    nx = x
    ny = y
    for (let j = 0; j < 4; j++) {
      nx += rx
      ny += ry
      if (!(nx >= 0 && nx < m && ny >= 0 && ny < n) || data[nx][ny] !== val) {
        break
      }
      cnt++
    }
    if (cnt >= 5) {
      return true
    }
  }
  return false
}

/**
 * 判断是否结束
 * 从当前点查询八个方向的连续5个位置是否能连城线
 * 所有格子是否全部填满
 * 最后下棋的坐标是否连城线
 * @param {GobangData} data 棋盘数据
 * @param {[number, number]} posi 最后一个是否满足结束的坐标点
 */
export const isOver = (data: GobangData, posi: [number, number]) => {
  const m = data.length, n = data[0].length
  let nullCnt = m * n

  // 先判断最后一个点是否满足结束
  if (getPostionResult(
    data, posi[0], posi[1], m, n
  )) {
    return posi
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (data[i][j] !== undefined) {
        nullCnt--
      }
    }
  }

  return !nullCnt
}

/**
 * 绘制棋盘
 * @param ctx canvas的2d实例
 * @param number 行列数
 * @param gap 行列间隔距离
 * @param padding 棋盘边距
 */
export const drawChessboard = (
  ctx: CanvasRenderingContext2D, rcs: number, gap: number, padding: number
) => {
  ctx.beginPath()
  ctx.lineWidth = 1

  // 行
  for (let i = 0; i <= rcs; i++) {
    ctx.moveTo(padding + gap * i, padding)
    ctx.lineTo(padding + gap * i, padding + gap * rcs)
  }
  // 列
  for (let i = 0; i <= rcs; i++) {
    ctx.moveTo(padding, padding + gap * i)
    ctx.lineTo(padding + gap * rcs, padding + gap * i)
  }
  ctx.strokeStyle = '#000'
  ctx.stroke()
  ctx.closePath()

  // 绘制中心圆点  
  ctx.beginPath()
  ctx.arc(
    padding + gap * rcs / 2, padding + gap * rcs / 2, 5, 0, 2 * Math.PI
  )
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.closePath()
}

// 绘制白子
function drawWhitePieces(
  ctx: CanvasRenderingContext2D, ci: number, cj: number, si: number, sj: number, radius = 12
) {
  ctx.beginPath()
  const lg2 = ctx.createRadialGradient(
    ci, cj, 5, ci, cj, 20
  )
  // 向圆形渐变上添加颜色 
  lg2.addColorStop(0.1, '#fff')
  lg2.addColorStop(0.9, '#ddd')
  ctx.fillStyle = lg2
  ctx.arc(
    si, sj, radius, 0, 2 * Math.PI
  )
  ctx.fill()
  ctx.closePath()
}

// 绘制黑子
function drawBlackPieces(
  ctx: CanvasRenderingContext2D, ci: number, cj: number, si: number, sj: number, radius = 12
) {
  ctx.beginPath()
  const lg2 = ctx.createRadialGradient(
    ci, cj, 5, ci, cj, 20
  )
  // 向圆形渐变上添加颜色 
  lg2.addColorStop(0.1, '#666')
  lg2.addColorStop(0.9, '#000')
  ctx.fillStyle = lg2
  ctx.arc(
    si, sj, radius, 0, 2 * Math.PI
  )
  ctx.fill()
  ctx.closePath()
}

/**
 * 绘制棋子，先循环列，再循环行
 * @param ctx canvas的2d实例
 * @param data 棋盘数据
 * @param number 行列数
 * @param gap 行列间隔距离
 * @param padding 棋盘边距
 * @param radius 棋子的半径
 */
export const drawPieces = (
  ctx: CanvasRenderingContext2D,
  data: GobangData,
  gap: number,
  padding: number,
  radius = 12
) => {
  const m = data.length, n = data[0].length
  for (let i = 0; i < m; i++) {
    // 列坐标
    const cj = i * gap + padding + 6 - padding
    const sj = padding + i * gap
    for (let j = 0; j < n; j++) {
      if (data[i][j] === undefined) {
        continue
      }
      // 行坐标
      const ci = j * gap + padding + 6 - padding
      const si = padding + j * gap
      if (!data[i][j]) {
        drawBlackPieces(
          ctx, ci, cj, si, sj, radius
        )
      } else {
        drawWhitePieces(
          ctx, ci, cj, si, sj, radius
        )
      }
    }
  }
}

/**
 * 根据点击的坐标来获取棋盘数据的坐标
 * @param offsetX 相对于父级元素的 x => 列位置
 * @param offsetY 相对于父级元素的 Y => 行位置
 * @param gap 行列间隔距离
 */
export const getPostions = (
  offsetX: number, offsetY: number, gap: number, padding: number, r = 12
): [number, number] | false => {
  const x = Math.round((offsetY - padding) / gap)
  const y = Math.round((offsetX - padding) / gap)
  // x1, y1 为圆心坐标
  const x1 = x * gap + padding, y1 = y * gap + padding
  const nr = Math.pow(Math.pow(x1 - offsetY, 2) + Math.pow(y1 - offsetX, 2), 0.5)
  if (nr <= r) {
    return [x, y]
  }
  return false
}

// 深拷贝稀疏数组
export const cloneDeep = <T extends GobangData>(data: T): T => {
  const m = data.length, n = data[0].length
  const res = new Array(m).fill(0).map(() => new Array(n)) as T

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (data[i][j] !== undefined) {
        res[i][j] = data[i][j]
      }
    }
  }

  return res
}
