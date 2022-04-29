class Charge extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, speed) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5)
        this.body.setCircle(18, 6, 5);
        this.movespeed = speed;
    }

    update(time, delta) {
        delta = delta/1000
        this.x -= 1.75/2 * this.movespeed * delta;
        this.y += 1/2 * this.movespeed * delta;
        this.setDepth(this.y + 14);
    }
}