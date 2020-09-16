/**
 * Copyright (c) 2019-present, Sony Interactive Entertainment Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { NearScanner } = require('@toio/scanner')

let mode1 = 0
let mode2 = 1
let centerX = 250
let centerY = 224
let tX = 50
let tY = 50
let d = 0

// calculate chasing cube's motor speed
function chase(mode, randomness, speed, jerryX, jerryY, tomX, tomY, tomAngle) {
  let diffX = jerryX - tomX
  let diffY = jerryY - tomY
  if(mode==1){
    let targetX = centerX + diffX
    let targetY = centerY + diffY
    targetX = (targetX + tomX) * 5 / 6
    targetY = (targetY + tomY) * 5 / 6
    diffX = targetX - tomX
    diffY = targetY - tomY
  }

  const distance = Math.sqrt(diffX * diffX + diffY * diffY)
  if (distance < 50) {
    return [0, 0] // stop
  }

  let relAngle = (Math.atan2(diffY, diffX) * 180) / Math.PI - tomAngle
  relAngle = relAngle % 360
  if (relAngle < -180) {
    relAngle += 360
  } else if (relAngle > 180) {
    relAngle -= 360
  }

  const ratio = 1 - Math.abs(relAngle) / 90
  if (relAngle > 0) {
    return [speed, speed * ratio]
  } else {
    return [speed * ratio, speed]
  }
}

async function main() {
  // start a scanner to find nearest two cubes
  const cubes = await new NearScanner(1).start()
  // console.log("check")

  // connect two cubes (tom chases jerry)
  // const jerry = await cubes[0].connect()
  const tom = await cubes[0].connect()
  // const tom2 = await cubes[2].connect()
  // set light color and store position
  // let jerryX = 0
  // let jerryY = 0
  // jerry.turnOnLight({ durationMs: 0, red: 255, green: 0, blue: 255 })
  // jerry.on('id:position-id', data => {
  //   jerryX = data.x-58
  //   jerryY = data.y-58
  // })

  // set light color and store position
  let tomX = 0
  let tomY = 0
  let tomAngle = 0
  tom.turnOnLight({ durationMs: 0, red: 0, green: 255, blue: 0 })
  tom.on('id:position-id', data => {
    tomX = data.x-58
    tomY = data.y-58
    tomAngle = data.angle
  })

  // let tom2X = 0
  // let tom2Y = 0
  // let tom2Angle = 0
  // tom2.turnOnLight({ durationMs: 0, red: 0, green: 255, blue: 0})
  // tom2.on('id:position-id', data => {
  //   tom2X = data.x-58
  //   tom2Y = data.y-58
  //   tom2Angle = data.angle
  // })

  function resetMode() {
    if (mode1 == 0 && mode2 == 1) return

    mode1 = 0
    mode2 = 1

    console.log(`reset mode ${mode1} ${mode2}`)
  }

  function setMode(t) {
    if (mode1 == t && mode2 == t) return

    mode1 = t
    mode2 = t
    console.log(`set mode ${mode1} ${mode2}`)
  }


  // loop
  setInterval(() => {
    let moveparam = chase(mode1, 0, 60, tX, tY, tomX, tomY, tomAngle)
    // let moveparam2 = chase(mode2, 0, 60, jerryX, jerryY, tom2X, tom2Y, tom2Angle)
    // if(moveparam[0] == 0 && moveparam2[0] == 0)
      // resetMode()
    if(moveparam[0] < 1){
      if(d == 0) d = 1
      else if(d == 1) d = 0
      console.log(d)
    }
    tom.move(...moveparam, 80)
    // tom2.move(...moveparam2, 80)
     if(d == 0) {
      tY = 400
    } else {
      tY = 50
    }
    console.log(tY)
  }, 20)
}

main()
