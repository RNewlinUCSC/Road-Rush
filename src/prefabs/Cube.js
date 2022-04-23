class Cube extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        this.zone = 3;
        this.setDepth(this.zone);

    }

    update() {
        //if(Phaser.Input.Keyboard.JustDown(keyLEFT) && this.zone != 1) {
            //this.x -= this.width/2 - 2;
            //this.y -= this.height/4 + 1;
            //this.zone -= 1;
            //this.setDepth(this.zone);
            //return 1;
        //}
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT) && this.zone != 5) {
            this.x += 21;
            this.y += 12;
            this.zone += 1;
            this.setDepth(this.zone);
            return 2;
        }
    }
}