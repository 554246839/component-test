/**
 * Description: 连线的箭头绘制
 * Created Date: 2022-04-05 16:23:39
 * Author: Kang Dong
 */

/**
 * 绘制箭头
 * @param ctx canvas 2d 实例
 * @param type 箭头的口对着方向
 * @param x 终点 x
 * @param y 终点 y
 */

export const drawArrow = (ctx: CanvasRenderingContext2D, sp: number[], ep: number[]) => {
  const { x1, y1, x2, y2 } = getArrowPoints(sp, ep)
  ctx.beginPath()
  //画箭头头部
  ctx.moveTo(ep[0], ep[1])
  ctx.lineTo(x1, y1)
  ctx.moveTo(ep[0], ep[1])
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.closePath()
}

// 获取箭头两侧的两点坐标
const getArrowPoints = (sp: number[], ep: number[]) => {
  const hd = Math.atan2(sp[1] - ep[1], sp[0] - ep[0]) // 获取角度
  const angle = (360 + (180 / Math.PI * hd | 0)) % 360 // 获取起点到终点的角度
  const leftAngle = (angle + 30 + 360) % 360 // 箭头分侧的角度
  const rightAngle = (angle - 30 + 360) % 360
  const r = 10 // 半径
  const x1 = ep[0] + Math.cos(leftAngle * Math.PI / 180) * r | 0
  const y1 = ep[1] + Math.sin(leftAngle * Math.PI / 180) * r | 0
  const x2 = ep[0] + Math.cos(rightAngle * Math.PI / 180) * r | 0
  const y2 = ep[1] + Math.sin(rightAngle * Math.PI / 180) * r | 0

  return { x1, y1, x2, y2 }
}

export default drawArrow
