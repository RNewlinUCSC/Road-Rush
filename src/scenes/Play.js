class Play extends Phaser.Scene {
    constructor() {
        super("Play");
    }

    preload() {
        //load images here
        this.load.image('playerCube', './assets/playerCube.png');
        this.load.image('obstacle', './assets/obstacleCube.png');
        this.load.image('slowZone', './assets/slowZoneRed.png');
        this.load.image('late', './assets/youreLate.png');
        //load sprite sheets
        this.load.spritesheet('rolltateLeft', './assets/pinkCubeSpriteSheetLeft.png', {frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 11});
        this.load.spritesheet('rolltate', './assets/pinkCubeSpriteSheetLeft.png', {frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 11});
    }

    create() {
        //set values of top bounding line
        this.blx1 = 540;
        this.bly1 = 0;
        this.blx2 = 1080;
        this.bly2 = 311.769;

        this.timerDelay = 5000; // in milliseconds

        this.player = new Cube(this, this.game.config.width/3, this.game.config.height/3 * 2, 'playerCube').setOrigin(1,0);

        //creates red line and circle
        this.graphics = this.add.graphics();
        //this.line = new Phaser.Geom.Line(320, 0, 640, 184.752);  //line for 480x640
        this.line = new Phaser.Geom.Line(this.blx1, this.bly1, this.blx2, this.bly2);
        this.line2 = new Phaser.Geom.Line(540, 480, 1080, 480-311.769);
        this.line3 = new Phaser.Geom.Line(648, 0, 0, 374.123)
        this.graphics.lineStyle(2, 0xff0000);
        if(config.physics.arcade.debug) {
            this.graphics.strokeLineShape(this.line);
            this.graphics.strokeLineShape(this.line2);
            this.graphics.strokeLineShape(this.line3);
        }

        //set controls
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        //animation config
        this.anims.create({
            key: 'rolltate',
            frames: this.anims.generateFrameNumbers('rolltate', { start: 0, end: 11, first: 0}),
            frameRate: 30
        });
        this.anims.create({
            key: 'rolltateLeft',
            frames: this.anims.generateFrameNumbers('rolltateLeft', { start: 0, end: 11, first: 0}),
            frameRate: 30
        });

        this.obstacleGroup = this.add.group({
            runChildUpdate: true
        })

        this.generateObstacles();
        // Timer for how often obstacles should start spawning
        this.timer = this.time.addEvent({
            delay: this.timerDelay, 
            callback: function() { 
                if(this.gameOverCheck()) this.generateObstacles(); 
            },
            loop: true,
            callbackScope: this
          })
    }

    update() {
        //if gameover is triggered player movement is disabled
        if(this.gameOverCheck()) {
            this.player.update();
        } else {
            //temp game over screen
            this.add.image(0,0,'late').setOrigin(0,0).setDepth(1000);
            if(keyR.isDown) {
                this.scene.restart();
            }
        }

        //enables collision between obstacles and players
        this.physics.world.collide(this.player, this.obstacleGroup, this.playerCollision, null, this);

        if(this.collisionCircleLine()){
            this.player.x -= 1.75/8;
            this.player.y += 1/8;
        }
    }

    //function to pass if the player collides with an obstacle
    playerCollision() {
        this.player.x -= 1.75/8;
        this.player.y += 1/8;
    }
    //returns true if the player goes off the bottom or left of the screen
    gameOverCheck() {
        if(this.player.x < -20 || this.player.y > 480) {
            return false;
        }
        return true;
    }

    generateObstacles(){
        const initialPos = [842, -68]; // Changing this = changes where obstacles start spawning
        let key;
        // If you're testing an obstacle, make it keep spawning
        if(obstacleYAML.ObstacleTest != null){
            key = obstacleYAML.ObstacleTest;
        } else { // If not testing, generate random obstacle
            const keys = Object.keys(obstacleYAML);
            key = keys[Math.floor(Math.random() * keys.length)];
            if (key == "ObstacleTest") return this.generateObstacles();
        }

        const currentObstacle = obstacleYAML[key];
        let row = 0;
        // Since we want the bottom stuff to spawn first, loop backwards
        for (let i = currentObstacle.length-1; i >= 0; i--) {
            let splitRow = currentObstacle[i].split(", ");
            let column = 0;
            for(const digit of splitRow){
                if(digit == '1'){
                    let obstacle = new Obstacle(this, initialPos[0]+(48*column)+(48*row), initialPos[1]+(27*column)-(27*row), 'obstacle', 0).setOrigin(0.5);
                    this.obstacleGroup.add(obstacle);
                }
                column++;
            }
            row++;
        }
    }

    //credit: Coding Hub 
    //source: https://stackoverflow.com/questions/10957689/collision-detection-between-a-line-and-a-circle-in-javascript
    collisionCircleLine(){
        this.side1 = Math.sqrt(Math.pow(this.player.x - this.blx1,2) + Math.pow(this.player.y - this.bly1,2)); // Thats the pythagoras theoram If I can spell it right
        this.side2 = Math.sqrt(Math.pow(this.player.x - this.blx2,2) + Math.pow(this.player.y - this.bly2,2));
        this.base = Math.sqrt(Math.pow(this.blx2 - this.blx1,2) + Math.pow(this.bly2 - this.bly1,2));
    
        if(20 > this.side1 || 20 > this.side2) return true;
    
        this.angle1 = Math.atan2( this.blx2 - this.blx1, this.bly2 - this.bly1 ) - Math.atan2( this.player.x - this.b1x1, this.player.y - this.bly1 ); // Some complicated Math
        this.angle2 = Math.atan2( this.blx1 - this.blx2, this.bly1 - this.bly2 ) - Math.atan2( this.player.x - this.blx2, this.player.y - this.bly2 ); // Some complicated Math again
    
        if(this.angle1 > Math.PI / 2 || this.angle2 > Math.PI / 2) {// Making sure if any angle is an obtuse one and Math.PI / 2 = 90 deg
            return false;
        }
    
    
        // Now if none are true then
        this.semiperimeter = (this.side1 + this.side2 + this.base) / 2;
        this.areaOfTriangle = Math.sqrt( this.semiperimeter * (this.semiperimeter - this.side1) * (this.semiperimeter - this.side2) * (this.semiperimeter - this.base) ); // Heron's formula for the area
        this.height = 2*this.areaOfTriangle/this.base;

        if( this.height < 20 ) return true;
        else return false;
    }
}