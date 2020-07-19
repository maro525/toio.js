/**
 * Copyright (c) 2019-present, Sony Interactive Entertainment Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { clamp } from '../../util'

/**
 * @hidden
 */
export interface MoveType {
  buffer: Uint8Array
  data: { left: number; right: number; durationMs: number }
}
export interface MoveToType {
  buffer: Uint8Array
  data: { posX: number; posY: number; duration: number }
}

/**
 * @hidden
 */
export class MotorSpec {
  public move(left: number, right: number, durationMs: number = 0): MoveType {
    const lSign = left > 0 ? 1 : -1
    const rSign = right > 0 ? 1 : -1
    const lDirection = left > 0 ? 1 : 2
    const rDirection = right > 0 ? 1 : 2
    const lPower = Math.min(Math.abs(left), 100)
    const rPower = Math.min(Math.abs(right), 100)
    const duration = clamp(durationMs / 10, 0, 255)

    return {
      buffer: Buffer.from([2, 1, lDirection, lPower, 2, rDirection, rPower, duration]),
      data: {
        left: lSign * lPower,
        right: rSign * rPower,
        durationMs: duration * 10,
      },
    }
  }

  public moveTo(x: number, y: number, r: number, speed: number=0x10): MoveToType {
    const timeout = 0x05 
    const movetype = 2
    const maxspeed = speed
    const speedtype = 0
    const rr = r.toString(16).replace(/(^[0-9a-f]{1}$)/, '00$1')
    const angle = parseInt(rr, 16)
    if(angle == 0){
      console.log("yes")
    }

    const buf = Buffer.alloc(13)
    buf.writeUInt8(3, 0)
    buf.writeUInt8(0, 1)
    buf.writeUInt8(timeout, 2)
    buf.writeUInt8(movetype, 3)
    buf.writeUInt8(maxspeed, 4)
    buf.writeUInt8(speedtype, 5)
    buf.writeUInt8(0, 6)
    buf.writeUInt16LE(x, 7)
    buf.writeUInt16LE(y, 9)
    // buf.writeUInt16LE(angle, 11)
    buf.writeUInt16LE(0x0500, 11)

    return {
      buffer: buf,
      data: {
        posX: x,
        posY: y,
        duration: timeout,
      },
    }
  }
}
