const { NearScanner } = require('@toio/scanner')


const TOIONUM = 1
let toio = []

async function main() {
    const cubes = await new NearScanner(TOIONUM).start()
    for(let i=0; i<TOIONUM; i++){
        const t = await cubes[i].connect()
        toio.push(t)
    }

    toio[0].moveTo(50, 50, 5)
    // toio[0].move(30, 30, 1000)
    
}

main()