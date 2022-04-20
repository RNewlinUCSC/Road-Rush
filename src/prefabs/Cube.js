class Cube extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, z, texture, frame) {
        super(scene, x, y, z, texture, frame);

        scene.addexisting(this);

    }

    update() {
        
    }
}