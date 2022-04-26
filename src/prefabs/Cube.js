class Cube extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCircle(23, 12, -2);
    }

    update() {
        this.x += 1.75/8;
        this.y -= 1/8;
        this.setDepth(this.y + 14);

        if(keyLEFT.isDown) {
            this.x -= 1.75;
            this.y -= 1;;
        }

        if(keyRIGHT.isDown) {
            this.x += 1.75;
            this.y += 1;
        }
    }
}