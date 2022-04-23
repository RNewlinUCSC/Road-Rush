let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    autoCenter: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            fps: 30,
            debug: true
        }
    },
    scene: [Play],
}

let game = new Phaser.Game(config)

// reserve inputs
let keyLEFT, keyRIGHT;

let obstacleTotal = 0;

