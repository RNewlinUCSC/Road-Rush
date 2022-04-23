class Play extends Phaser.Scene {
    constructor() {
        super("Play");
    }

    preload() {
        //load images here
        this.load.image('playerCube', './assets/playerCube.png');
        this.load.image('obstacle', './assets/obstacleCube.png');
        //load sprite sheets
        this.load.spritesheet('rolltateLeft', './assets/pinkCubeSpriteSheetLeft.png', {frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 11});
        this.load.spritesheet('rolltate', './assets/pinkCubeSpriteSheetLeft.png', {frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 11});
    }

    create() {
        this.timer = 0;
        this.timer2 = 10;
        this.timer3 = 20;
        this.spawnX = (game.config.width/2);
        this.spawnY = -48;
        this.seed = 0;

        this.player = new Cube(this, this.game.config.width/3, this.game.config.height/3 * 2, 'playerCube').setOrigin(1,0);
        //this.notplayer = new Cube(this, this.game.config.width/3, this.game.config.height/3 * 2, 'playerCube').setOrigin(1,0);

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

        this.obstacleGroup = this.add.group({
            runChildUpdate: true
        })

            this.spawnObstacle();
            this.obstacleCount++;

        //animation - currently broken
        //this.input.keyboard.on('keydown-LEFT', () => {
            //if(this.player.zone != 1) {
            //this.player.alpha = 0;
            //this.roll = this.physics.add.sprite(this.player.x, this.player.y, 'rolltateLeft').setOrigin(1,0);
            //this.roll.anims.play('rolltateLeft');
            //this.roll.on('animationcomplete', () => {
            //this.player.alpha = 1;
            //});
        //}   
        //});
    }


    spawnObstacle(random) {
        let enemy = new Obstacle(this, this.spawnX + (random * 21), this.spawnY + (random * 12), 'obstacle').setOrigin(1,0);
        this.obstacleGroup.add(enemy);
    }


    update() {
        this.timer++;
        this.timer2++;
        this.seed = Math.floor(Math.random() * (20 + 1));
        this.seed2 = Math.floor(Math.random() * (20 + 1));
        this.seeed3 = Math.floor(Math.random() * (20 + 1));

        this.player.update();

        if(this.timer > 90 && obstacleTotal < 30) {
            this.spawnObstacle(this.seed);
            this.spawnObstacle(this.seed2);
            this.obstacleCount++;
            this.timer = 0;
        }

        if(this.timer2 > 90 && obstacleTotal < 30) {
            this.spawnObstacle(this.seed2);
            this.obstacleCount++;
            this.timer2 = 0;
        }

        if(this.timer3 > 90 && obstacleTotal < 30) {
            this.spawnObstacle(this.seeed3);
            this.obstacleCount++;
            this.timer3 = 0;
        }

        this.physics.world.collide(this.player, this.obstacleGroup, this.playerCollision, null, this);
    }

    playerCollision() {
        this.player.x -= 1.75/6;
        this.player.y += 1/6;
    }
}