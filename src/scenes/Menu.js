class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }
    preload(){
        this.load.path = "./assets/";
        this.load.image('playerCube', 'carPink.png');
        this.load.image('background', 'carRoad.png');
        this.load.image('menuSprites', 'menuSprites.png');
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
        this.player = new Cube(this, 390, 340, 'playerCube').setOrigin(1,0);
        this.player.inMenu = true;

        this.add.image(0, 0, 'background').setOrigin(0).setDepth(0);
        this.menuSprites = this.add.image(350, -40, 'menuSprites').setDepth(1000).setOrigin(0);

        this.startLeft = this.add.sprite(250, 315, 'startButton');
        this.startRight = this.add.sprite(490, 420, 'startButton');
        this.anims.create({
            key: 'startButton',
            frames: this.anims.generateFrameNumbers('startButton', { start: 0, end: 7, first: 0}),
            frameRate: 60
        });
    }

    update(time, delta){
        this.player.update(delta/1000);

        // Player moves right, play button animation and tween sprites
        if (this.player.x > 420 && !this.swappingScenes){
            this.swappingScenes = true; 
            this.startRight.anims.play("startButton");
            this.startRight.on('animationcomplete', () => { 
                this.switchScenes();
            })    
        } // Player moves left, play button animation and tween sprites
        if(this.player.x < 360 && !this.swappingScenes){
            console.log("left");
            this.swappingScenes = true;
            this.startLeft.anims.play("startButton");
            this.startLeft.on('animationcomplete', () => { 
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