class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }
    preload(){   
        this.load.path = "./assets/";
        // Load audio
        this.load.audio('sfx_select', 'selectSFX.wav');
        this.load.audio('music', 'roadRushBGM.wav');
        this.load.audio('honk', 'hornSFX.wav')
        // Load images
        // this.load.image('playerCube', 'pinkCar.png');
        this.load.image('background', 'carRoad.png');
        this.load.image('menuSprites', 'menuSprites.png');
        this.load.atlas('decorAtlas', 'decorAtlas.png', 'decorAtlas.json');
        this.load.atlas('uglyCarAtlas2', 'uglyCarAtlas2.png', 'uglyCarAtlas2.json');
        this.load.spritesheet('playerLeftSheet', 'carPinkLeftSheet.png', {frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('playerRightSheet', 'carPinkRightSheet.png', {frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('playerForwardSheet', 'carPinkSheet.png', {frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('startButton', 'startSheet.png', {frameWidth: 192, frameHeight: 112, startFrame: 0, endFrame: 7});

        this.textConfig = {
            fontFamily: 'PixelFont',
            fontSize: '80px',
            color: '#FFFFFF',
            align: 'left',
            stroke: '#10141f',
            strokeThickness: 6
        }
    }
    
    create(){
        // Used for swapping from Menu to Play scenes
        this.swappingScenes = false;

        // Inputs
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // Game objects
        this.player = new Cube(this, 390, 340, 'playerForwardSheet').setOrigin(1,0);
        this.player.inMenu = true;

        this.add.image(0, 0, 'background').setOrigin(0).setDepth(0);
        this.menuSprites = this.add.image(350, -40, 'menuSprites').setDepth(1000).setOrigin(0);

        this.startLeft = this.add.sprite(250, 315, 'startButton');
        this.startRight = this.add.sprite(490, 420, 'startButton');

        // Animations
        this.anims.create({
            key: 'startButton',
            frames: this.anims.generateFrameNumbers('startButton', { start: 0, end: 7, first: 0}),
            frameRate: 60
        });
        this.anims.create({
            key: 'playerLeft',
            frames: this.anims.generateFrameNumbers('playerLeftSheet', { start: 0, end: 0, first: 0}),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'playerRight',
            frames: this.anims.generateFrameNumbers('playerRightSheet', { start: 0, end: 0, first: 0}),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'playerForward',
            frames: this.anims.generateFrameNumbers('playerForwardSheet', { start: 0, end: 7, first: 0}),
            frameRate: 30,
            repeat: -1
        });
    }

    update(time, delta){
        this.player.update(delta/1000);

        // Player moves right, play button animation and tween sprites
        if (this.player.x > 420 && !this.swappingScenes){
            this.swappingScenes = true; 
            this.player.inMenu = false;
            this.startRight.anims.play("startButton");
            this.startRight.on('animationcomplete', () => { 
                this.sound.play('sfx_select');
                this.switchScenes();
            })    
        } // Player moves left, play button animation and tween sprites
        if(this.player.x < 360 && !this.swappingScenes){
            this.swappingScenes = true;
            this.player.inMenu = false;
            this.startLeft.anims.play("startButton");
            this.startLeft.on('animationcomplete', () => { 
                this.sound.play('sfx_select');
                this.switchScenes();
            })    
        }
    }

    switchScenes(){
        this.tween = this.tweens.add({
            targets: [this.startLeft, this.startRight, this.menuSprites],
            x: '-=700',
            y: '+=400',
            ease: "Sine.easeInOut",
            duration: 2000,
            repeat: 0,
            yoyo: false
        })
        this.tween.on('complete', () => {
            
            this.scene.start("Play", {playerX: this.player.x, playerY: this.player.y});
        });
    }
}