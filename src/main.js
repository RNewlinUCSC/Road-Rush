let config = {
    type: Phaser.CANVAS,
    width: 1080,
    height: 480,
    autoCenter: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            fps: 30,
            debug: true         //if this is changed, update global variable to reflect change
        }
    },
    scene: [Play],
}

let game = new Phaser.Game(config)

// reserve inputs
let keyLEFT, keyRIGHT, keyR;

let obstacleTotal = 0;
let debugCheck = true;

