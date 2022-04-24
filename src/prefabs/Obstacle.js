class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCircle(23, 12, -2);
        this.setImmovable();
    }

    update() {
        this.x -= 1.75/2;
        this.y += 1/2;
        this.destroyObstacle
        this.setDepth(this.y + 14);
    }

    destroyObstacle() {
        if(this.x < 0) {
            this.destroy();
            obstacleTotal--;
        }
    }
}