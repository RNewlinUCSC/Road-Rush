class Cube extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCircle(23, 0, 0);
        this.movespeed = 100;
    }

    update(delta) {
        this.x += 1.75/8 * this.movespeed * delta;
        this.y -= 1/8 * this.movespeed * delta;
        this.setDepth(this.y + 14);

        if(keyLEFT.isDown) {
            this.x -= 1.75 * (this.movespeed/1.5) * delta;
            this.y -= 1 * (this.movespeed/1.5) * delta;
        }

        if(keyRIGHT.isDown) {
            this.x += 1.75 * (this.movespeed/1.5) * delta;
            this.y += 1 * (this.movespeed/1.5) * delta;
        }
    }
}