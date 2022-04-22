let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    autoCenter: true,
    scene: [Play],
}

let game = new Phaser.Game(config)

// reserve inputs
let keyLEFT, keyRIGHT;

// test comment