class Cube extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        this.zone = 3;

    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyLEFT) && this.zone != 1) {
            this.x -= this.width/2;
            this.y -= this.height/4;
            this.zone -= 1;
        }
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT) && this.zone != 5) {
            this.x += this.width/2;
            this.y += this.height/4;
            this.zone += 1;
        }
    }
}