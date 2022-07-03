/**
 * Description: 五子棋脚本
 * Created Date: 2022-07-02 23:17:51
 * Author: Kang Dong
 */

export type GobangData = (0 | 1 | undefined)[][]

/**
 * 判读当前坐标是否满足结束要求
 * @param {number[][]} data 棋盘数据
 * @param {number} x x 轴
 * @param {number} y y 轴
 * @param {number} m 最大行数
 * @param {number} n 最大列数
 * @returns {boolean}
 */
function getPostionResult(
  data: GobangData, x: number, y: number, m: number, n: number
) {
  //          右上      右      右下    下
  const ds = [[-1, 1], [0, 1], [1, 1], [1, 0]]
  const val = data[x][y]

  for (let i = 0; i < ds.length; i++) {
    const [dx, dy] = ds[i]
    let nx = x, ny = y, flag = true
    for (let i = 0; i < 4; i++) {
      nx += dx
      ny += dy
      if (!(nx >= 0 && nx < m && ny >= 0 && ny < n) || data[nx][ny] !== val) {
        flag = false
        break
      }
    }

    if (flag) {
      return true
    }
  }
  return false
}

/**
 * 判断是否结束
 * 从当前点查询八个方向的连续5个位置是否能连城线
 * 但是在具体的逻辑判断中，是从左往右，从上往下一次判断的，
 * 所以在真正的执行过程中，只需要判断4个方向即可
 * 这里选择的四个方向是：右上、右、右下、下
 * @param {number[][]} data 棋盘数据
 */
export const isOver = (data: GobangData) => {
  const m = data.length, n = data[0].length
  let nullCnt = m * n

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (data[i][j] !== undefined) {
        nullCnt--
        if (getPostionResult(
          data, i, j, m, n
        )) {
          return [i, j]
        }
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
 * 绘制棋子
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
    const ci = i * gap + padding + 6 - padding
    const si = padding + i * gap
    for (let j = 0; j < n; j++) {
      if (data[i][j] === undefined) {
        continue
      }
      const cj = j * gap + padding + 6 - padding
      const sj = padding + j * gap
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
 * @param offsetX 相对于父级元素的 x
 * @param offsetY 相对于父级元素的 Y
 * @param gap 行列间隔距离
 */
export const getPostions = (
  offsetX: number, offsetY: number, gap: number, padding: number, r = 12
) => {
  const x = Math.round((offsetX - padding) / gap)
  const y = Math.round((offsetY - padding) / gap)
  // x1, y1 为圆心坐标
  const x1 = x * gap + padding, y1 = y * gap + padding
  const nr = Math.pow(Math.pow(x1 - offsetX, 2) + Math.pow(y1 - offsetY, 2), 0.5)
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
