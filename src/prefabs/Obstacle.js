class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.timer = 0
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCircle(20, 4, 4);
        this.zone = 3;
        this.setDepth(this.zone);
        this.setImmovable();
    }

    update() {
        this.x -= 1.75/2;
        this.y += 1/2;
        this.destroyObstacle
    }

    destroyObstacle() {
        if(this.x < 0) {
            this.destroy();
            obstacleTotal--;
        }
    }
}