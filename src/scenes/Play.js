class Play extends Phaser.Scene {
    constructor() {
        super("Play");
    }

    preload() {
        //load images here
        this.load.image('playerCube', './assets/playerCube.png');
        this.load.image('obstacle', './assets/cubeBlue.png');
        //load sprite sheets
        this.load.spritesheet('rolltateLeft', './assets/pinkCubeSpriteSheetLeft.png', {frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 11});
        this.load.spritesheet('rolltate', './assets/pinkCubeSpriteSheetLeft.png', {frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 11});
    }

    create() {
        this.enemy = new Obstacle(this, this.game.config.width/3 * 2, this.game.config.height/3, 'obstacle').setOrigin(1,0);
        this.player = new Cube(this, this.game.config.width/3, this.game.config.height/3 * 2, 'playerCube').setOrigin(1,0);
        this.notplayer = new Cube(this, this.game.config.width/3, this.game.config.height/3 * 2, 'playerCube').setOrigin(1,0);

        //set controls
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //animation config
        this.anims.create({
            key: 'rolltate',
            frames: this.anims.generateFrameNumbers('rolltate', { start: 0, end: 11, first: 0}),
            frameRate: 30
        });
        this.anims.create({
            key: 'rolltateLeft',
            frames: this.anims.generateFrameNumbers('rolltateLeft', { start: 0, end: 11, first: 0}),
            frameRate: 30
        });

        if(Phaser.Input.Keyboard.JustDown(keyLEFT) && this.player.zone != 1) {
            this.player.x -= 21;
            this.player.y -= 12;
            this.player.zone -= 1;
            this.player.setDepth(this.player.zone);
        }
    }

    update() {
        if(this.player.update() == 1) {
            this.player.alpha = 0;
            this.rollLeft = this.add.sprite(this.player.x, this.player.y, 'rolltateLeft').setOrigin(1,0);
            this.rollLeft.anims.play('rolltateLeft')
            console.log(this.rollLeft.anims.getProgress);
            this.rollLeft.on('animationcomplete', () => {
                this.player.x -= 21;
                this.player.y -= 12;
            this.player.alpha = 1;
            });
        }
        this.enemy.update();
    }
}