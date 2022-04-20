class Play extends Phaser.Scene {
    constructor() {
        super("Play");
    }

    preload() {
        //load images here
        this.load.image('playerCube', './assets/cubePink.png');
        this.load.image('obstacle', './assets/cubeBlue.png');
    }

    create() {
        this.enemy = new Obstacle(this, this.game.config.width/3, this.game.config.height/3 * 2, 'obstacle').setOrigin(1,0);
        this.player = new Cube(this, this.game.config.width/3, this.game.config.height/3 * 2, 'playerCube').setOrigin(1,0);

        //set controls
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        this.player.update();
    }
}