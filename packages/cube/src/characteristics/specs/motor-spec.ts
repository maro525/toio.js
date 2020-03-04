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

  public moveTo(x: number, y: number, duration: number = 5000): MoveToType {
    const label = 0
    const timeout = duration
    const movetype = 0
    const maxspeed = 0x50
    const speedtype = 0
    const r = 0x05

    return {
      buffer: Buffer.from([3, label, timeout, movetype, maxspeed, speedtype, 0, x, 0, y, 0, r]),
      data: {
        posX: x,
        posY: y,
        duration: timeout,
      },
    }
  }
}
