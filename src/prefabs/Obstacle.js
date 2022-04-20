class Obstacle extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        this.zone = 3;
        this.setDepth(this.zone);

    }

    update() {
        this.x -= .5;
        this.y += .25;
    }
}