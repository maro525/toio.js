/**
 * Copyright (c) 2019-present, Sony Interactive Entertainment Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// const { NearestScanner } = require('@toio/scanner')
const { NearScanner } = require('@toio/scanner')
const io = require('socket.io-client')
const osc = require('node-osc')

async function main() {
  // start a scanner to find the nearest cube
  // const cube = await new NearestScanner().start()
  const cubes = await new NearScanner(2).start()
  const cube1 = await cubes[0].connect()
  const cube2 = await cubes[1].connect()

  
  // start websocket 
  // const socket = io('http://localhost:3000')
  // socket.on('connect', () => console.log('connect'))

  // osc
  const client = new osc.Client('127.0.0.1', 5000)

  let toio1x, toio1y, toio2x, toio2y = 0

  setInterval(() => {
    let data = [toio1x, toio1y, toio2x, toio2y]
    client.send('/toio', data.toString());
    console.log('osc sent')
  }, 300);

  // connect to the cube
  // cube.connect()

  // set listeners to show toio ID information
  cube1.on('id:position-id', data => {
    console.log('[POS ID0]', data)
    // socket.emit('message1', data)
    toio1x = data.x
    toio1y = data.y
  })
  cube2.on('id:position-id', data => {
    console.log('[POS ID1]', data)
    // socket.emit('message2', data)
    toio2x = data.x
    toio2y = data.y
  })
}

main()
