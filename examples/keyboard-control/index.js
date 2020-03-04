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
  const cubes = await new NearScanner(10).start()

  // connect to the cube
  // await cube.connect()
  const cube0 = await cubes[0].connect()
  console.log("cube1");
  const cube1 = await cubes[1].connect()
  console.log("cube2");
  const cube2 = await cubes[2].connect()
  console.log("cube3");
  const cube3 = await cubes[3].connect()
  console.log("cube4");
  const cube4 = await cubes[4].connect()
  console.log("cube5");
  const cube5 = await cubes[5].connect()
  console.log("cube6");
  // const cube6 = await cubes[6].connect()
  console.log("cube7");
  // const cube7 = await cubes[7].connect()
  console.log("cube8");
  // const cube8 = await cubes[8].connect()
  console.log("cube9");
  // const cube9 = await cubes[9].connect()
  console.log("cube10");

  keypress(process.stdin)
  process.stdin.on('keypress', (ch, key) => {
    // ctrl+c or q -> exit process
    if ((key && key.ctrl && key.name === 'c') || (key && key.name === 'q')) {
      process.exit()
    }

    switch (key.name) {
      case 'up':
        // cube.move(...SPEED.forward, DURATION)
        cube0.move(...SPEED.forward, DURATION)
        cube1.move(...SPEED.forward, DURATION)
        cube2.move(...SPEED.forward, DURATION)
        cube3.move(...SPEED.forward, DURATION)
        cube4.move(...SPEED.forward, DURATION)
        cube5.move(...SPEED.forward, DURATION)
        cube6.move(...SPEED.forward, DURATION)
        cube7.move(...SPEED.forward, DURATION)
        cube8.move(...SPEED.forward, DURATION)
        cube9.move(...SPEED.forward, DURATION)
        break
      case 'down':
        // cube.move(...SPEED.backward, DURATION)
        cube0.move(...SPEED.backward, DURATION)
        cube1.move(...SPEED.backward, DURATION)
        cube2.move(...SPEED.backward, DURATION)
        cube3.move(...SPEED.backward, DURATION)
        cube4.move(...SPEED.backward, DURATION)
        cube5.move(...SPEED.backward, DURATION)
        cube6.move(...SPEED.backward, DURATION)
        cube7.move(...SPEED.backward, DURATION)
        cube8.move(...SPEED.backward, DURATION)
        cube9.move(...SPEED.backward, DURATION)
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
