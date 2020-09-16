const { NearScanner } = require('@toio/scanner')

const TOIONUM = 1
const SPEED = 100
let toio = []
let toiopos = []

const getAngleFromAtan = (dx, dy) => {
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    return angle;
}

const arrangeAngle = (r) => {
    let rr = r % 360
    if(rr < -180)
        rr += 360
    else if(rr > 180)
        rr -= 360
    return rr
}

const getDist = (a, b) => {
    let dx = Math.abs(a[0] - b[0])
    let dy = Math.abs(a[1] - b[1])
    return Math.sqrt(dx*dx + dy*dy)
}

function getMoveParam(x, y, pos, speed, dir=1) {
    let dx = x - pos[0]
    let dy = y - pos[1]

    if(getDist([x,y], pos) < 50)
        return [0, 0]

    let relAngle = getAngleFromAtan(dx, dy)-pos[2]
    relAngle = arrangeAngle(relAngle)
    console.log(`relAngle ${relAngle}`)

    const absAngle = Math.abs(relAngle)
    const ratio = relAngle <= 90 ? 1 - Math.abs(relAngle) / 180 : 0

    if(Math.abs(relAngle) > 90)
    	speed = 50

    let left = relAngle >= 0 ? speed : speed*ratio
    let right = relAngle >= 0 ? speed*ratio : speed

    if(left > 255) left = 255
    if(right > 255) right = 255

    return [left, right]
}

function move(idx, x, y) {
    const currentpos = toiopos[idx] 
    if(currentpos.length != 3)
        return

    const moveparam = getMoveParam(x, y, currentpos, SPEED)
    console.log(`moveparam ${moveparam}`)
    _move(toio[idx], moveparam, 5)
}

function moveTo(idx, x, y, r) {
    console.log(`toio No.${idx} move to ${x} ${y}`)
    toio[idx].moveTo(x, y, r)
}

function _move(t, param, duration) {
	console.log("move")
	console.log(param)
	t.move(...param, duration)
}

function playSound(idx, noteName, duration) {
    toio[idx].playSound([{durationMs: duration, noteName:noteName}], 1)
}

function setuptoio() {
    for(let i=0; i<toio.length; i++){
        toio[i].on('id:position-id', data => {
            toiopos[i][0] = data.x
            toiopos[i][1] = data.y
            toiopos[i][2] = data.angle
            // console.log(`toiopos ${i} ${data.x} ${data.y} ${data.angle}`)
        })
        toio[i].on('sensor:collision', data=> {
            // if(data.isCollisionDetected)
            console.log(`No.${i} ${data.isCollisionDetected} Collision Detected!!`)
        })
        toio[i].on('sensor:slope', data=>{
            if(data.isSloped)
                console.log(`No.${i} ${data.isSloped} Sloped!`)
        })
        toio[i].on('sensor:doubletap', data => {
            if(data.isDoubleTapped)
                console.log(`No.${i} DoubleTap!!`)
        })
        console.log(`toio No.${i} setup`)
    }
}

function easeInOutQuart(x){
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

let moveX = 80
let moveY = 80
let moveR = 30
let a = 1;

async function main() {
    const cubes = await new NearScanner(TOIONUM).start()
    for(let i=0; i<TOIONUM; i++){
        const t = await cubes[i].connect()
        toio.push(t)
        toiopos.push([0, 0, 0])
    }
    setuptoio()
    // _move(toio[0], [100, 0], 1)
    // moveTo(0, 200, 200, 30)

    // loop
    // setInterval(() => {
        // moveTo(0, 300, 160)
        // _move(toio[0], [100, 0], 2)
        // const data = await toio[0].getCollisionStatus()
        // console.log(data)
        // moveTo(0, moveX, moveY, moveR)
        // moveX = 58 + Math.round(Math.random() * 380)
        // moveY = 58 + Math.round(Math.random() * 380)
        // moveR = Math.round(Math.random() * 360)
        // moveR = 270
    // }, 3000)

    let movecount = 0
    
    setInterval(() => {
        // let motor = 90
        // if(movecount >= 0 && movecount < 20){
            // let n =  easeInOutQuart(movecount/20)
            // motor = 255 * n 
            // console.log(motor)
        // }
        // else if(movecount >= 20 && movecount < 40) {
            // let n = 1-easeInOutQuart((movecount-20)/20)
            // motor = 255 * n
            // console.log(motor)
        // }
        // let motor = 155 
        // if(movecount < 25){
        //     let left = motor * 0.45
        //     _move(toio[0], [motor, left], 40)
        // }
        // movecount += 1
        _move(toio[0], [30*a, 30*a], 3000);
        if(a == 1) a=-1;
        else if(a == -1) a=1;
    }, 3000)

    // for(let i=0; i<20;  i++) {
        // const cubestatus =  await toio[0].getSlopeStatus()
        // if(cubestatus.isDoubleTapped)
            // console.log(`double tapped`)
        // await new Promise(r => setTimeout(r, 500))
    // }
}

main()