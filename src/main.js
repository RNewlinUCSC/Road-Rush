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
            debug: false         //if this is changed, update global variable to reflect change
        }
    },
    scene: [Play],
}

let game = new Phaser.Game(config)

// reserve inputs
let keyLEFT, keyRIGHT;

let obstacleTotal = 0;
let debugCheck = false;

