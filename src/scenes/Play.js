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

        this.timer = 0;
        this.timer2 = 10;
        this.timer3 = 20;
        this.spawnX = (game.config.width/2);
        this.spawnY = -48;
        this.seed = 0;

        this.player = new Cube(this, this.game.config.width/3, this.game.config.height/3 * 2, 'playerCube').setOrigin(1,0);
        //this.notplayer = new Cube(this, this.game.config.width/3, this.game.config.height/3 * 2, 'playerCube').setOrigin(1,0);

        //creates red line and circle
        this.graphics = this.add.graphics();
        //this.line = new Phaser.Geom.Line(320, 0, 640, 184.752);  //line for 480x640
        this.line = new Phaser.Geom.Line(this.blx1, this.bly1, this.blx2, this.bly2);
        this.line2 = new Phaser.Geom.Line(540, 480, 1080, 480-311.769);
        this.line3 = new Phaser.Geom.Line(648, 0, 0, 374.123)
        this.graphics.lineStyle(2, 0xff0000);
        if(debugCheck) {
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

            this.spawnObstacle();
            this.obstacleCount++;
    }


    spawnObstacle(random) {
        let enemy = new Obstacle(this, this.spawnX + (random * 21), this.spawnY + (random * 12), 'obstacle').setOrigin(1,0);
        this.obstacleGroup.add(enemy);
    }


    update() {

            this.timer++;
            this.timer2++;
            this.seed = Math.floor(Math.random() * (20 + 1));
            this.seed2 = Math.floor(Math.random() * (20 + 1));
            this.seeed3 = Math.floor(Math.random() * (20 + 1));
        
            if(this.gameOverCheck()) {
                this.player.update();
            }else {
                this.add.image(0,0,'late').setOrigin(0,0).setDepth(1000);
                if(keyR.isDown) {
                    this.scene.restart();
                }
            }
        
            if(this.timer > 90 && obstacleTotal < 30) {
                this.spawnObstacle(this.seed);
                this.obstacleCount++;
                this.timer = 0;
            }
        
            if(this.timer2 > 90 && obstacleTotal < 30) {
                this.spawnObstacle(this.seed2);
                this.obstacleCount++;
                this.timer2 = 0;
            }
        
            if(this.timer3 > 90 && obstacleTotal < 30) {
                this.spawnObstacle(this.seeed3);
                this.obstacleCount++;
                this.timer3 = 0;
            }

        this.physics.world.collide(this.player, this.obstacleGroup, this.playerCollision, null, this);

        if(this.collisionCircleLine()){
            this.player.x -= 1.75/8;
            this.player.y += 1/8;
        }
    }

    playerCollision() {
        this.player.x -= 1.75/8;
        this.player.y += 1/8;
    }

    gameOverCheck() {
        if(this.player.x < -20 || this.player.y > 480) {
            return false;
        }
        return true;
    }


    //credit: Coding Hub 
    //source: https://stackoverflow.com/questions/10957689/collision-detection-between-a-line-and-a-circle-in-javascript
    collisionCircleLine(){
        this.side1 = Math.sqrt(Math.pow(this.player.x - this.blx1,2) + Math.pow(this.player.y - this.bly1,2)); // Thats the pythagoras theoram If I can spell it right
        this.side2 = Math.sqrt(Math.pow(this.player.x - this.blx2,2) + Math.pow(this.player.y - this.bly2,2));
        this.base = Math.sqrt(Math.pow(this.blx2 - this.blx1,2) + Math.pow(this.bly2 - this.bly1,2));
    
        if(20 > this.side1 || 20 > this.side2)
            return true;
    
        this.angle1 = Math.atan2( this.blx2 - this.blx1, this.bly2 - this.bly1 ) - Math.atan2( this.player.x - this.b1x1, this.player.y - this.bly1 ); // Some complicated Math
        this.angle2 = Math.atan2( this.blx1 - this.blx2, this.bly1 - this.bly2 ) - Math.atan2( this.player.x - this.blx2, this.player.y - this.bly2 ); // Some complicated Math again
    
        if(this.angle1 > Math.PI / 2 || this.angle2 > Math.PI / 2) // Making sure if any angle is an obtuse one and Math.PI / 2 = 90 deg
            return false;
    
    
            // Now if none are true then
            this.semiperimeter = (this.side1 + this.side2 + this.base) / 2;
            this.areaOfTriangle = Math.sqrt( this.semiperimeter * (this.semiperimeter - this.side1) * (this.semiperimeter - this.side2) * (this.semiperimeter - this.base) ); // Heron's formula for the area
            this.height = 2*this.areaOfTriangle/this.base;
    
            if( this.height < 20 )
                return true;
            else
                return false;
    
    }
}