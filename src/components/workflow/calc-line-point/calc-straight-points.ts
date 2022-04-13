/**
 * Description: 折线的各点的计算
 * Created Date: 2022-04-07 22:32:40
 * Author: Kang Dong
 */
import WF from '../type'

const firstDistance = 30

// 折线坐标计算，总共 4 * 4 * 4 = 64 种连接方式
export default function calcStraightPoints({ startDire, startx, starty, destDire, destx, desty, w, h, dw, dh }: WF.CalcType,
  points: [number, number][],
  quadrant: WF.Quadrant) {
  switch (startDire) {
    case 'down':
      switch (quadrant) {
        case 'ru': // 第一象限
          switch (destDire) {
            case 'down':
              {
                const threedx = Math.max(startx + w / 2 + firstDistance, destx)
                let fourdy = desty + (starty - h - desty) / 2
                if (startx + w / 2 < destx - firstDistance) {
                  fourdy = Math.max(desty, starty) + firstDistance
                }
                points.push([startx, starty + firstDistance]) // 2
                points.push([threedx, starty + firstDistance]) // 3
                points.push([threedx, fourdy]) // 4
                points.push([destx, fourdy]) // 5
              }
              break
            case 'up':
              {
                let threeux = startx + w / 2 + (destx - dw / 2 - startx - w / 2) / 2
                if (destx - dw / 2 - startx - w / 2 < 10) { // 从左边连线
                  threeux = Math.min(startx - w / 2 - firstDistance, destx - dw / 2 - firstDistance)
                }
                points.push([startx, starty + firstDistance])
                points.push([threeux, starty + firstDistance])
                points.push([threeux, desty - firstDistance])
                points.push([destx, desty - firstDistance])
              }
              break
            case 'left':
              {
                let threelx = Math.max(destx - firstDistance, startx + w / 2 + (destx - w / 2 - startx) / 2)
                if (destx - w / 2 - startx < 10) { // 从左边连线
                  threelx = Math.min(startx - w / 2 - firstDistance, destx - firstDistance)
                }
                points.push([startx, starty + firstDistance])
                points.push([threelx, starty + firstDistance])
                points.push([threelx, desty])
              }
              break
            case 'right':
              {
                points.push([startx, Math.max(starty + firstDistance, desty + dh / 2 + firstDistance)])
                points.push([destx + firstDistance, Math.max(starty + firstDistance, desty + dh / 2 + firstDistance)])
                points.push([destx + firstDistance, desty])
              }
              break
            // no default
          }
          break
        case 'lu': // 第二象限
          switch (destDire) {
            case 'down':
              {
                const threedx = Math.min(startx - w / 2 - firstDistance, destx)
                let fourdy = desty + (starty - h - desty) / 2
                if (startx - w / 2 > destx + firstDistance) {
                  fourdy = Math.max(desty, starty) + firstDistance
                }
                points.push([startx, starty + firstDistance]) // 2
                points.push([threedx, starty + firstDistance]) // 3
                points.push([threedx, fourdy]) // 4
                points.push([destx, fourdy]) // 5
              }
              break
            case 'up':
              {
                let threeux = destx + dw / 2 + (startx - w / 2 - destx - dw / 2) / 2
                if (startx - w / 2 - destx - dw / 2 < 10) { // 从右边连线
                  threeux = Math.max(startx + w / 2 + firstDistance, destx + dw / 2 + firstDistance)
                }
                points.push([startx, starty + firstDistance])
                points.push([threeux, starty + firstDistance])
                points.push([threeux, desty - firstDistance])
                points.push([destx, desty - firstDistance])
              }
              break
            case 'left':
              points.push([startx, Math.max(starty + firstDistance, desty + dh / 2 + firstDistance)])
              points.push([Math.min(destx - firstDistance, startx - w / 2 - firstDistance), Math.max(starty + firstDistance, desty + dh / 2 + firstDistance)])
              points.push([Math.min(destx - firstDistance, startx - w / 2 - firstDistance), desty])
              break
            case 'right':
              {
                let threerx = Math.min(destx + firstDistance, destx + (startx - w / 2 - destx) / 2)
                if (startx - w / 2 - destx < 10) { // 从右边连线
                  threerx = Math.max(startx + w / 2 + firstDistance, destx + firstDistance)
                }
                points.push([startx, starty + firstDistance])
                points.push([threerx, starty + firstDistance])
                points.push([threerx, desty])
              }
              break
            // no default
          }
          break
        case 'ld': // 第三象限
          switch (destDire) {
            case 'down':
              {
                const threedx = Math.max(startx, destx + dw / 2 + firstDistance)
                points.push([startx, Math.min(starty + firstDistance, starty + (desty - dh - starty) / 2)])
                points.push([threedx, Math.min(starty + firstDistance, starty + (desty - dh - starty) / 2)])
                points.push([threedx, desty + firstDistance])
                points.push([destx, desty + firstDistance])
              }
              break
            case 'up':
              points.push([startx, desty - (desty - starty) / 2])
              points.push([destx, desty - (desty - starty) / 2])
              break
            case 'left':
              {
                let twoly = Math.min(starty + firstDistance, desty - dh / 2 - (desty - dh / 2 - starty) / 2)
                if (desty - dh / 2 - starty < 10) { // 从组件下面连接
                  twoly = Math.max(desty + dh / 2 + firstDistance, starty + firstDistance)
                }
                points.push([startx, twoly])
                points.push([destx - firstDistance, twoly])
                points.push([destx - firstDistance, desty])
              }
              break
            case 'right':
              points.push([startx, desty])
              break
            // no default
          }
          break
        case 'rd': // 第四象限
          switch (destDire) {
            case 'down':
              {
                const threedx = Math.min(startx, destx - dw / 2 - firstDistance)
                points.push([startx, Math.min(starty + firstDistance, starty + (desty - dh - starty) / 2)])
                points.push([threedx, Math.min(starty + firstDistance, starty + (desty - dh - starty) / 2)])
                points.push([threedx, desty + firstDistance])
                points.push([destx, desty + firstDistance])
              }
              break
            case 'up':
              points.push([startx, desty - (desty - starty) / 2])
              points.push([destx, desty - (desty - starty) / 2])
              break
            case 'left':
              points.push([startx, desty])
              break
            case 'right':
              {
                let twoly = Math.min(starty + firstDistance, desty - dh / 2 - (desty - dh / 2 - starty) / 2)
                if (desty - dh / 2 - starty < 10) { // 从组件下面连接
                  twoly = Math.max(desty + dh / 2 + firstDistance, starty + firstDistance)
                }
                points.push([startx, twoly])
                points.push([destx + firstDistance, twoly])
                points.push([destx + firstDistance, desty])
              }
              break
            // no default
          }
          break
        // no default
      }
      break
    case 'left':
      switch (quadrant) {
        case 'ru': // 第一象限
          switch (destDire) {
            case 'down':
              {
                let towdy = Math.min(desty + firstDistance, desty + (starty - h / 2 - desty) / 2)
                if (starty - h / 2 - desty < 10) { // 从组件下面连线
                  towdy = starty + h / 2 + firstDistance
                }
                points.push([startx - firstDistance, starty])
                points.push([startx - firstDistance, towdy])
                points.push([destx, towdy])
              }
              break
            case 'up':
              points.push([Math.min(startx - firstDistance, destx - dw / 2 - firstDistance), starty])
              points.push([Math.min(startx - firstDistance, destx - dw / 2 - firstDistance), Math.min(starty - h / 2 - firstDistance, desty - firstDistance)])
              points.push([destx, Math.min(starty - h / 2 - firstDistance, desty - firstDistance)])
              break
            case 'left':
              {
                let threely = Math.min(desty, starty - h / 2 - firstDistance)
                let fourlx = Math.max(destx - firstDistance, destx - (destx - startx - w) / 2)
                if (destx - firstDistance < startx + w) {
                  fourlx = Math.min(startx, destx) - firstDistance
                }
                if (starty - h / 2 - desty - dh / 2 < 10) {
                  threely = starty - h / 2 - firstDistance
                  fourlx = Math.max(startx, destx) - firstDistance
                }
                points.push([startx - firstDistance, starty])
                points.push([startx - firstDistance, threely])
                points.push([fourlx, threely])
                points.push([fourlx, desty])
              }
              break
            case 'right':
              {
                let threery = starty - h / 2 - (starty - h / 2 - desty - dh / 2) / 2
                if (starty - h / 2 - desty - dh / 2 < 10) { // 从组件下面连线
                  threery = Math.max(starty + h / 2 + firstDistance, desty + dh / 2 + firstDistance)
                }
                points.push([startx - firstDistance, starty])
                points.push([startx - firstDistance, threery])
                points.push([destx + firstDistance, threery])
                points.push([destx + firstDistance, desty])
              }
              break
            // no default
          }
          break
        case 'lu': // 第二象限
          switch (destDire) {
            case 'down':
              points.push([destx, starty])
              break
            case 'up':
              {
                let threeux = Math.max(startx - firstDistance, startx - (startx - destx - dw / 2) / 2)
                if (startx - destx - dw / 2 < 10) { // 从组件左边连线
                  threeux = Math.min(destx - dw / 2 - firstDistance, startx - firstDistance)
                }
                points.push([threeux, starty])
                points.push([threeux, desty - firstDistance])
                points.push([destx, desty - firstDistance])
              }
              break
            case 'left':
              {
                let threely = starty
                if (starty - desty - dh / 2 < 10) { // 从组件上方连线
                  threely = Math.max(starty, desty + dh / 2 + firstDistance)
                }
                points.push([Math.max(startx - firstDistance, startx - (startx - destx - dw) / 2), starty])
                points.push([Math.max(startx - firstDistance, startx - (startx - destx - dw) / 2), threely])
                points.push([destx - firstDistance, threely])
                points.push([destx - firstDistance, desty])
              }
              break
            case 'right':
              points.push([destx + (startx - destx) / 2, starty])
              points.push([destx + (startx - destx) / 2, desty])
              break
            // no default
          }
          break
        case 'ld': // 第三象限
          switch (destDire) {
            case 'down':
              {
                let threeux = Math.max(startx - firstDistance, startx - (startx - destx - dw / 2) / 2)
                if (startx - destx - dw / 2 < 10) { // 从组件左边连线
                  threeux = Math.min(destx - dw / 2 - firstDistance, startx - firstDistance)
                }
                points.push([threeux, starty])
                points.push([threeux, desty + firstDistance])
                points.push([destx, desty + firstDistance])
              }
              break
            case 'up':
              points.push([destx, starty])
              break
            case 'left':
              {
                let threely = starty
                if (desty - dh / 2 - starty < 10) { // 从组件上方连线
                  threely = Math.min(starty, desty - dh / 2 - firstDistance)
                }
                points.push([Math.max(startx - firstDistance, startx - (startx - destx - dw) / 2), starty])
                points.push([Math.max(startx - firstDistance, startx - (startx - destx - dw) / 2), threely])
                points.push([destx - firstDistance, threely])
                points.push([destx - firstDistance, desty])
              }
              break
            case 'right':
              points.push([destx + (startx - destx) / 2, starty])
              points.push([destx + (startx - destx) / 2, desty])
              break
            // no default
          }
          break
        case 'rd': // 第四象限
          switch (destDire) {
            case 'down':
              points.push([Math.min(startx - firstDistance, destx - dw / 2 - firstDistance), starty])
              points.push([Math.min(startx - firstDistance, destx - dw / 2 - firstDistance), Math.max(starty + h / 2 + firstDistance, desty + firstDistance)])
              points.push([destx, Math.max(starty + h / 2 + firstDistance, desty + firstDistance)])
              break
            case 'up':
              {
                let towdy = Math.min(desty - firstDistance, desty - (starty - h / 2 - desty) / 2)
                if (desty - h / 2 - starty < 10) { // 从组件上面连线
                  towdy = starty - h / 2 - firstDistance
                }
                points.push([startx - firstDistance, starty])
                points.push([startx - firstDistance, towdy])
                points.push([destx, towdy])
              }
              break
            case 'left':
              {
                let threely = Math.max(desty, starty + h / 2 + firstDistance)
                let fourlx = Math.max(destx - firstDistance, destx - (destx - startx - w) / 2)
                if (destx - firstDistance < startx + w) {
                  fourlx = Math.min(startx, destx) - firstDistance
                }
                if (desty - starty - h / 2 - dh / 2 < 10) {
                  threely = starty + h / 2 + firstDistance
                  fourlx = Math.max(startx, destx) - firstDistance
                }
                points.push([startx - firstDistance, starty])
                points.push([startx - firstDistance, threely])
                points.push([fourlx, threely])
                points.push([fourlx, desty])
              }
              break
            case 'right':
              {
                let threery = desty - dh / 2 - (desty - dh / 2 - starty - h / 2) / 2
                if (desty - dh / 2 - starty - h / 2 < 10) { // 从组件上面连线
                  threery = Math.min(starty - h / 2 - firstDistance, desty - dh / 2 - firstDistance)
                }
                points.push([startx - firstDistance, starty])
                points.push([startx - firstDistance, threery])
                points.push([destx + firstDistance, threery])
                points.push([destx + firstDistance, desty])
              }
              break
            // no default
          }
          break
        // no default
      }
      break
    case 'up':
      switch (quadrant) {
        case 'ru': // 第一象限
          switch (destDire) {
            case 'down':
              {
                const initDisRU = Math.min(firstDistance, (starty - desty) / 2)
                points.push([startx, starty - initDisRU])
                points.push([startx, starty - (starty - desty) / 2])
                points.push([destx, starty - (starty - desty) / 2])
                points.push([destx, desty + initDisRU])
              }
              break
            case 'up':
              {
                let oneupx = Math.max(startx, destx - dw / 2 - firstDistance)
                if (destx - dw / 2 - startx < 10 || destx - dw / 2 - startx >= firstDistance) {
                  oneupx = Math.min(startx, destx - dw / 2 - firstDistance)
                }
                points.push([startx, Math.max(starty - firstDistance, desty + dh + (starty - desty - dh) / 2)])
                points.push([oneupx, Math.max(starty - firstDistance, desty + dh + (starty - desty - dh) / 2)])
                points.push([oneupx, desty - firstDistance])
                points.push([destx, desty - firstDistance])
              }
              break
            case 'left':
              points.push([startx, desty])
              break
            case 'right':
              {
                let initDisRU = Math.min(firstDistance, (starty - desty - dh / 2) / 2)
                let foury = starty - initDisRU / 2 // 第一象限的第四点的y
                if (initDisRU < 10) { // 从目标组件上方方连线
                  initDisRU = firstDistance
                  foury = desty - dh / 2 - firstDistance
                }

                points.push([startx, starty - initDisRU])
                points.push([startx, Math.min(starty - initDisRU, foury)])
                points.push([destx + firstDistance, Math.min(starty - initDisRU, foury)])
                points.push([destx + firstDistance, desty])
              }
              break
            // no default
          }
          break
        case 'lu': // 第二象限
          switch (destDire) {
            case 'down':
              {
                const initDisLU = Math.min(firstDistance, (starty - desty) / 2)
                points.push([startx, starty - initDisLU])
                points.push([startx, starty - (starty - desty) / 2])
                points.push([destx, starty - (starty - desty) / 2])
                points.push([destx, desty + initDisLU])
              }
              break
            case 'up':
              {
                let twoupx = Math.min(startx, destx + dw / 2 + firstDistance)
                if (startx - destx - dw / 2 < 10 || startx - destx - dw / 2 >= firstDistance) {
                  twoupx = Math.max(startx, destx + dw / 2 + firstDistance)
                }
                points.push([startx, Math.max(starty - firstDistance, desty + dh + (starty - desty - dh) / 2)])
                points.push([twoupx, Math.max(starty - firstDistance, desty + dh + (starty - desty - dh) / 2)])
                points.push([twoupx, desty - firstDistance])
                points.push([destx, desty - firstDistance])
              }
              break
            case 'left':
              {
                let initDisLU = Math.min(firstDistance, (starty - desty - dh / 2) / 2)
                let foury = starty - initDisLU / 2 // 第二象限的第四点的y
                if (initDisLU < 10) {
                  initDisLU = firstDistance
                  foury = desty - dh / 2 - firstDistance
                }

                points.push([startx, starty - initDisLU])
                points.push([startx, Math.min(starty - initDisLU, foury)])
                points.push([destx - firstDistance, Math.min(starty - initDisLU, foury)])
                points.push([destx - firstDistance, desty])
              }
              break
            case 'right':
              points.push([startx, desty])
              break
            // no default
          }
          break
        case 'ld': // 第三象限
          const minx = w / 2 + firstDistance
          switch (destDire) {
            case 'down':
              {
                const initDisLD = startx - dw / 2 - w / 2 - destx
                let threedx = startx - w / 2 - initDisLD / 2 // 第四象限的第三点的x
                if (initDisLD < 10) { // 从组件左边连线
                  threedx = Math.min(startx - w / 2 - firstDistance, destx - dw / 2 - firstDistance)
                }
                points.push([startx, starty - firstDistance]) // 2
                points.push([threedx, starty - firstDistance]) // 3
                points.push([threedx, desty + firstDistance]) // 4
                points.push([destx, desty + firstDistance]) // 5
              }
              break
            case 'up':
              points.push([startx, starty - firstDistance]) // 2
              points.push([Math.min(startx - minx, destx), Math.min(starty - firstDistance, desty - firstDistance)]) // 3
              points.push([Math.min(startx - minx, destx), desty - firstDistance]) // 4
              points.push([destx, desty - firstDistance]) // 5
              break
            case 'left':
              points.push([startx, starty - firstDistance]) // 2
              points.push([Math.min(startx - minx, destx - firstDistance), starty - firstDistance]) // 3
              points.push([Math.min(startx - minx, destx - firstDistance), desty]) // 4
              points.push([destx - firstDistance, desty]) // 4, 5
              break
            case 'right':
              {
                const initDisLD = startx - w / 2 - destx
                let threex = Math.min(destx + firstDistance, startx - w / 2 - initDisLD / 2) // 第三象限的第三点的x
                if (initDisLD < 10) { // 从组件右边连线
                  threex = Math.max(destx + firstDistance, startx + w / 2 + firstDistance)
                }

                points.push([startx, starty - firstDistance]) // 2
                points.push([threex, starty - firstDistance]) // 3
                points.push([threex, desty]) // 4
                points.push([Math.min(destx + firstDistance, threex), desty]) // 5
              }
              break
            // no default
          }
          break
        case 'rd': // 第四象限
          const minfx = w / 2 + firstDistance
          switch (destDire) {
            case 'down':
              {
                const initDisRD = destx - dw / 2 - w / 2 - startx
                let threedx = startx + w / 2 + initDisRD / 2 // 第四象限的第三点的x
                if (initDisRD < 10) { // 从组件右边连线
                  threedx = Math.max(startx + w / 2 + firstDistance, destx + dw / 2 + firstDistance)
                }

                points.push([startx, starty - firstDistance]) // 2
                points.push([threedx, starty - firstDistance]) // 3
                points.push([threedx, desty + firstDistance]) // 4
                points.push([destx, desty + firstDistance]) // 5
              }
              break
            case 'up':
              points.push([startx, starty - firstDistance]) // 2
              points.push([Math.max(startx + minfx, destx), Math.min(starty - firstDistance, desty - firstDistance)]) // 3
              points.push([Math.max(startx + minfx, destx), desty - firstDistance]) // 4
              points.push([destx, desty - firstDistance]) // 5
              break
            case 'left':
              {
                const initDisRD = destx - w / 2 - startx
                let threex = Math.max(startx + w / 2 + initDisRD / 2, destx - firstDistance) // 第四象限的第三点的x
                if (initDisRD < 5) { // 从组件左边连线
                  threex = Math.min(startx - w / 2 - firstDistance, destx - firstDistance)
                }

                points.push([startx, starty - firstDistance]) // 2
                points.push([threex, starty - firstDistance]) // 3
                points.push([threex, desty]) // 4
                points.push([threex, desty]) // 5
              }
              break
            case 'right':
              points.push([startx, starty - firstDistance]) // 2
              points.push([Math.max(startx + minfx, destx + firstDistance), starty - firstDistance]) // 3
              points.push([Math.max(startx + minfx, destx + firstDistance), desty]) // 4
              points.push([destx + firstDistance, desty]) // 5
              break
            // no default
          }
          break
        // no default
      }
      break
    case 'right':
      switch (quadrant) {
        case 'ru': // 第一象限
          switch (destDire) {
            case 'down':
              points.push([destx, starty])
              break
            case 'up':
              {
                let disupx = Math.min(startx + firstDistance, destx - dw / 2 - (destx - dw / 2 - startx) / 2)
                if (destx - dw / 2 - startx < 10) {
                  disupx = destx + dw / 2 + firstDistance
                }
                points.push([disupx, starty])
                points.push([disupx, desty - firstDistance])
                points.push([destx, desty - firstDistance])
              }
              break
            case 'left':
              points.push([startx + (destx - startx) / 2, starty]) // 2
              points.push([startx + (destx - startx) / 2, desty]) // 3
              break
            case 'right':
              {
                let towrighty = Math.min(starty, desty + dh / 2 + firstDistance)
                if (starty - desty - dh / 2 >= firstDistance || starty - desty - dh / 2 < 10) {
                  towrighty = Math.max(starty, desty + dh / 2 + firstDistance)
                }
                points.push([Math.min(startx + firstDistance, destx - dw - (destx - dw - startx) / 2), starty])
                points.push([Math.min(startx + firstDistance, destx - dw - (destx - dw - startx) / 2), towrighty])
                points.push([destx + firstDistance, towrighty])
                points.push([destx + firstDistance, desty])
              }
              break
            // no default
          }
          break
        case 'lu': // 第二象限
          switch (destDire) {
            case 'down':
              {
                let twody = Math.min(desty + firstDistance, starty - h / 2 - (starty - h / 2 - desty) / 2)
                if (starty - h / 2 - desty < 10) { // 从组件下方连接
                  twody = Math.max(starty + h / 2 + firstDistance, desty + firstDistance)
                }
                points.push([startx + firstDistance, starty])
                points.push([startx + firstDistance, twody])
                points.push([destx, twody])
              }
              break
            case 'up':
              points.push([Math.max(startx + firstDistance, destx + dw / 2 + firstDistance), starty])
              points.push([Math.max(startx + firstDistance, destx + dw / 2 + firstDistance), Math.min(starty - h / 2 - firstDistance, desty - firstDistance)])
              points.push([destx, Math.min(starty - h / 2 - firstDistance, desty - firstDistance)])
              break
            case 'left':
              {
                let threely = starty - h / 2 - (starty - h / 2 - desty - dh / 2) / 2
                if (starty - h / 2 - desty - dh / 2 < 10) { // 从组件上方连
                  threely = Math.min(desty - dh / 2 - firstDistance, starty - h / 2 - firstDistance)
                }
                points.push([startx + firstDistance, starty])
                points.push([startx + firstDistance, threely])
                points.push([destx - firstDistance, threely])
                points.push([destx - firstDistance, desty])
              }
              break
            case 'right':
              {
                let threery = Math.max(starty - h / 2 - firstDistance, desty)
                let threerx = Math.min(destx + firstDistance, startx - w - (startx - w - destx) / 2)
                if (starty - h / 2 - desty < 10 || starty - h / 2 - desty >= firstDistance) { // 折线
                  threery = Math.min(starty - h / 2 - firstDistance, desty)
                }
                if (destx + firstDistance > startx - w) {
                  threerx = destx + firstDistance
                }
                points.push([startx + firstDistance, starty])
                points.push([startx + firstDistance, threery])
                points.push([threerx, threery])
                points.push([threerx, desty])
              }
              break
            // no default
          }
          break
        case 'ld': // 第三象限
          switch (destDire) {
            case 'down':
              points.push([Math.max(startx + firstDistance, destx + dw / 2 + firstDistance), starty])
              points.push([Math.max(startx + firstDistance, destx + dw / 2 + firstDistance), Math.max(starty + h / 2 + firstDistance, desty + firstDistance)])
              points.push([destx, Math.max(starty + h / 2 + firstDistance, desty + firstDistance)])
              break
            case 'up':
              {
                let twody = Math.max(desty - firstDistance, desty - (desty - h / 2 - starty) / 2)
                if (desty - h / 2 - starty < 10) { // 从组件上方连接
                  twody = Math.min(starty - h / 2 - firstDistance, desty - firstDistance)
                }
                points.push([startx + firstDistance, starty])
                points.push([startx + firstDistance, twody])
                points.push([destx, twody])
              }
              break
            case 'left':
              {
                let threely = desty - (desty - starty) / 2
                if (desty - dh / 2 - starty - h / 2 < 10) { // 从组件下方连
                  threely = Math.max(desty + dh / 2 + firstDistance, starty + h / 2 + firstDistance)
                }
                points.push([startx + firstDistance, starty])
                points.push([startx + firstDistance, threely])
                points.push([destx - firstDistance, threely])
                points.push([destx - firstDistance, desty])
              }
              break
            case 'right':
              {
                let threerx = Math.min(destx + firstDistance, startx - w - (startx - w - destx) / 2)
                let threery = Math.min(starty + h / 2 + firstDistance, desty)
                if (desty - h / 2 - starty < 10 || desty - h / 2 - starty >= firstDistance) { // 折线
                  threery = Math.max(starty + h / 2 + firstDistance, desty)
                }
                if (destx + firstDistance > startx - w) {
                  threerx = destx + firstDistance
                }
                points.push([startx + firstDistance, starty])
                points.push([startx + firstDistance, threery])
                points.push([threerx, threery])
                points.push([threerx, desty])
              }
              break
            // no default
          }
          break
        case 'rd': // 第四象限
          switch (destDire) {
            case 'down':
              {
                let disupx = Math.min(startx + firstDistance, destx - dw / 2 - (destx - dw / 2 - startx) / 2)
                if (destx - dw / 2 - startx < 10) {
                  disupx = destx + dw / 2 + firstDistance
                }
                points.push([disupx, starty])
                points.push([disupx, desty + firstDistance])
                points.push([destx, desty + firstDistance])
              }
              break
            case 'up':
              points.push([destx, starty])
              break
            case 'left':
              points.push([startx + (destx - startx) / 2, starty]) // 2
              points.push([startx + (destx - startx) / 2, desty]) // 3
              break
            case 'right':
              {
                let fourrightx = Math.max(starty, desty - dh / 2 - firstDistance)
                if (desty - dh / 2 - starty >= firstDistance || desty - dh / 2 - starty < 10) {
                  fourrightx = Math.min(starty, desty - dh / 2 - firstDistance)
                }
                points.push([Math.min(startx + firstDistance, destx - dw - (destx - dw - startx) / 2), starty])
                points.push([Math.min(startx + firstDistance, destx - dw - (destx - dw - startx) / 2), fourrightx])
                points.push([destx + firstDistance, fourrightx])
                points.push([destx + firstDistance, desty])
              }
              break
            // no default
          }
          break
        // no default
      }
      break
    // no default
  }
}
