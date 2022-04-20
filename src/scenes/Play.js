class Play extends Phaser.Scene {
    constructor() {
        super("Play");
    }

    preload() {
        //load images here
        this.preload.image('playerCube', './assets/cubePink.png');
    }

    create() {
        this.player = new Cube(this, this.game.config.width/2, this.game.config.height/2, 0, 'playerCube').setOrigin(0,0);
    }
}