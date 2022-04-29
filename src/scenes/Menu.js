class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }
    preload(){
        this.load.path = "./assets/";
        this.load.image('playerCube', 'carPink.png');
        this.load.image('background', 'carRoad.png');

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
        // Inputs
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // Game objects
        this.player = new Cube(this, 380, this.game.config.height/3 * 2, 'playerCube').setOrigin(1,0);
        this.player.inMenu = true;

        this.add.image(0, 0, 'background').setOrigin(0).setDepth(0);
        this.add.text(game.config.width-300, 100, "temp name", this.textConfig).setOrigin(0.5);
        this.textConfig.fontSize = "30px";
        this.add.text(game.config.width-300, 200, "(a)(d) to move", this.textConfig).setOrigin(0.5);
        this.add.text(game.config.width-300, 250, `highscore: ${highscore}`, this.textConfig).setOrigin(0.5);
    }

    update(time, delta){
        this.player.update(delta/1000);
        if (this.player.x > 420 || this.player.x < 340) this.scene.start("Play", {playerX: this.player.x, playerY: this.player.y});
    }
}