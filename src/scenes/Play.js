class Play extends Phaser.Scene {
    constructor() {
        super("Play");
    }

    preload() {
        //load images here
        this.load.image('playerCube', './assets/cubePink.png');
    }

    create() {
        this.player = new Cube(this, this.game.config.width/2, this.game.config.height/2, 'playerCube').setOrigin(1,0);
    }

    update() {

    }
}