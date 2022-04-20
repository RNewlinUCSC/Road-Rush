const { Phaser } = require("../lib/phaser");

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    autoCenter: true,
    scene: [],
}

let game = new Phaser.Game(config)

