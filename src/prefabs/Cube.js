class Cube extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCircle(23, 0, 0);
        this.inMenu = false;
        this.movespeed = 100;
        this.chargeTotal = 100;
    }

    update(delta) {
        this.setDepth(this.y + 14);
        if(this.inMenu) this.anims.play('playerForward', 0, true); 
        if(!this.inMenu && !keyLEFT.isDown && !keyRIGHT.isDown && !game.input.activePointer.isDown){ 
            this.anims.play('playerForward', true);
            this.x += 1.75/8 * this.movespeed * delta;
            this.y -= 1/8 * this.movespeed * delta;
            if(this.chargeTotal <= 0) {
                this.x -= 1.75/3 * this.movespeed * delta;
                this.y += 1/3 * this.movespeed * delta;
            }
        }
        if((keyLEFT.isDown && leftCheck) || (game.input.activePointer.isDown && game.input.activePointer.x < 540 && leftCheck)) {
            this.anims.play('playerLeft', true);
            this.x -= 1.75 * (this.movespeed/1.2) * delta;
            this.y -= 1 * (this.movespeed/1.2) * delta;
        }

        if((keyRIGHT.isDown && rightCheck) || (game.input.activePointer.isDown && game.input.activePointer.x > 540 && rightCheck)) {
            this.anims.play('playerRight', true);
            this.x += 1.75 * (this.movespeed/1.2) * delta;
            this.y += 1 * (this.movespeed/1.2) * delta;
        }
        if(!keyLEFT.isDown && !keyRIGHT.isDown) {
        }
    }
}