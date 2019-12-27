/**
 * Copyright (c) 2019-present, Sony Interactive Entertainment Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const keypress = require('keypress')
// const { NearestScanner } = require('@toio/scanner')
const { NearScanner } = require('@toio/scanner')

const DURATION = 200 // ms
const SPEED = {
  forward: [70, 70],
  backward: [-70, -70],
  left: [30, 70],
  right: [70, 30],
}

async function main() {
  // start a scanner to find nearest cube
  // const cube = await new NearestScanner().start()
  const cubes = await new NearScanner(2).start()

  // connect to the cube
  // await cube.connect()
  const cube1 = await cubes[0].connect()
  const cube2 = await cubes[1].connect()

  keypress(process.stdin)
  process.stdin.on('keypress', (ch, key) => {
    // ctrl+c or q -> exit process
    if ((key && key.ctrl && key.name === 'c') || (key && key.name === 'q')) {
      process.exit()
    }

    switch (key.name) {
      case 'up':
        // cube.move(...SPEED.forward, DURATION)
        cube1.move(...SPEED.forward, DURATION)
        cube2.move(...SPEED.forward, DURATION)
        break
      case 'down':
        // cube.move(...SPEED.backward, DURATION)
        cube1.move(...SPEED.backward, DURATION)
        cube2.move(...SPEED.backward, DURATION)
        break
      case 'left':
        // cube.move(...SPEED.left, DURATION)
        cube1.move(...SPEED.left, DURATION)
        cube2.move(...SPEED.left, DURATION)
        break
      case 'right':
        // cube.move(...SPEED.right, DURATION)
        cube1.move(...SPEED.right, DURATION)
        cube2.move(...SPEED.right, DURATION)
        break
    }
  })

  process.stdin.setRawMode(true)
  process.stdin.resume()
}

main()
