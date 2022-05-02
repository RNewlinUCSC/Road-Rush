class Decor extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, speed) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.setOrigin(0, 0)
        this.setDepth(999);
        this.movespeed = speed;
    }

    update(time, delta) {
        delta = delta/1000
        this.x -= 1.75/2 * this.movespeed * delta;
        this.y += 1/2 * this.movespeed * delta;
        
        if(this.x < -50) this.destroy();
    }
}