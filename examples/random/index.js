const { Client } = require('node-osc');
const { NearScanner } = require('./scanner');

const ip = '127.0.0.1';
const port = 5020;
const address = '/toio';
const client = new Client(ip, port);
const bMove = true;

let toio = [];
const toionum = 2;
let connected = 0;
let d = 1;
let toiopos = Array.from(new Array(toionum), () => new Array(3).fill(0)); // x, y, angle
const maxpos = 380;
let lastangle = [];
let volume = [100, 100];
let loop = 0

const connect = async () => {
    const cubes = await new NearScanner(toionum).start();

    const t1 = await cubes[0].connect()
    connected += 1
    toio.push(t1);
    const t2 = await cubes[1].connect()
    connected += 1
    toio.push(t2);
    console.log('toio setup');

    for(let i=0; i<toio.length; i++){
        toio[i].on('id:position-id', data => {
            toiopos[i][0] = data.x-58;
            toiopos[i][1] = data.y-59;
            let angle = data.angle;
            diff = angle - lastangle[i]
            toiopos[i][2] = diff
            lastangle[i] = angle
            for(let j=0; j<3; j++) {
                toiopos[i][j] = alignnumber(toiopos[i][j], i,  j);
            }
        })
    }

}

const alignnumber = (v, i, j) => {
    if(j == 2){
        loop += 1
        if(loop>1000)
            loop = 0
        if(loop % 10 == 0){
            volume[i] += v*3
        }
        if(volume[i] < 20)
            volume[i] = 20
        else if(volume[i] > 500)
            volume[i] = 500
        v = volume[i]
        return v
    }
    return v
}

const addRandom = (v, r) =>  {
    let value = v + Math.random() * r - r/2.0;
    return value;
}
const toioposcheck = (pnx, pny) => {
    let nx;
    if(pnx > maxpos) nx = maxpos - 120;
    else if(pnx < 0) nx = 120;
    else nx = pnx;

    let ny;
    if(pny > maxpos) ny = maxpos - 120;
    else if(pny < 0) ny = 120;
    else ny = pny;

    // return [nx, -ny]
    // return [25*d, 20*d]
}

const createoscmsg = () => {
    let msg = "";
    for(let i=0; i<toionum; i++) {
        for(let j=0; j<3; j++) {
            let v = Math.round(toiopos[i][j]);
            msg += `${v} `;
        }
    }
    let d = Math.round(getDistance());
    msg += `${d}`;
    return msg;
}

const moverandomly = (roughness, duration) => {
    if (roughness < 1) roughness = 1;
    for(let i=0; i<toionum; i++) {
        // let nx = addRandom(toiopos[i][0], roughness);
        let nx = 0;
        let ny = addRandom(toiopos[i][1], roughness);
        // toio[i].move(...toioposcheck(nx, ny), duration);
        toio[i].move(10*d, 10*d, 10000)
        console.log(d)
        // if(d == 1) toio[i].moveTo(50, 450)
        // else toio[i].moveTo(50, 50)
    }
}

const getDistance = () => {
    let dx = Math.abs(toiopos[0][0] - toiopos[1][0]);
    let dy = Math.abs(toiopos[0][1] - toiopos[1][1]);
    let distance = Math.sqrt(dx*dx + dy*dy);
    return distance;
}


(async function() {

    connect();

    setInterval(function() {
        if(toionum != connected){
            console.log(`not enough connected => ${connected}`)
            return
        }
        if(bMove == false){
            return
        }
        d *= -1
        moverandomly(80, 500);
        // toioposcheck();
    }, 10000);

    setInterval(function() {
        // let msg = createoscmsg();
        // client.send(address, msg);
        // console.log(`[OSC SEND] ${msg}`);
    }, 100);

})();
