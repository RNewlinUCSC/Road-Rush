class Cube extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCircle(20, 4, 4);
        this.zone = 3;
        this.setDepth(this.zone);
        //this.setDragX(350);
        //this.setDragY(200);
    }

    update() {
        this.x += 1.75/6;
        this.y -= 1/6;
        if(Phaser.Input.Keyboard.JustDown(keyLEFT) && this.zone != 1) {
            this.setVelocityX(-21*4);
            this.setVelocityY(- 12*4);
            //this.zone -= 1;
            this.setDepth(this.x);
        }
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT) && this.zone != 5) {
            this.setVelocityX(21*4);
            this.setVelocityY(12*4);
            //this.zone += 1;
            this.setDepth(this.x);
        }
    }
}