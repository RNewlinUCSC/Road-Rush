class Play extends Phaser.Scene {
    constructor() {
        super("Play");
    }

    init(data){
        // In the menu, player moves to start the game. This data just lets us place the player in the same spot in a new scene
        this.initialPos = [data.playerX, data.playerY];
    }

    preload() {
        //load audio
        this.load.audio('music', './assets/roadRushBGM.wav');
        this.load.audio('honk', './assets/hornSFX.wav')

        //load images here
        this.load.path = "./assets/"; // set path so that it's easier to type the strings when loading
        this.load.image('obstacle', 'carGray.png');
        this.load.image('uglyCar0', 'uC0.png');
        this.load.image('uglyCar1', 'uC1.png');
        this.load.image('uglyCar2', 'uC2.png');
        this.load.image('uglyCar3', 'uC3.png');
        this.load.image('uglyCar4', 'uC4.png');
        this.load.image('uglyCar5', 'uC5.png');
        this.load.image('uglyCar6', 'uC6.png');
        this.load.image('uglyCar7', 'uC7.png');
        this.load.image('charge', 'charge.png');
        //load sprite sheets
        this.load.spritesheet('lateText', 'lateSheet.png', {frameWidth: 448, frameHeight: 96, startFrame: 0, endFrame: 30});
        //this.load.spritesheet('uglyCars', 'uglyCarAtlas.png', {framewidth: 48, frameHeight: 48, startFrame: 0, endFrame: 7});

        this.textConfig = {
            fontFamily: 'PixelFont',
            fontSize: '48px',
            color: '#FFFFFF',
            align: 'left',
            stroke: '#10141f',
            strokeThickness: 6
        }
    }

    create() {
        //add music
        var backgroundMusic = this.sound.add('music');
        backgroundMusic.loop = true; 
        backgroundMusic.play();

        //ugly car array
        this.carList = ['uglyCar0','uglyCar1','uglyCar2','uglyCar3','uglyCar4','uglyCar5','uglyCar6','uglyCar7'];

        //set values of top bounding line
        this.blx1 = 540;
        this.bly1 = 0;
        this.blx2 = 1080;
        this.bly2 = 311.769;

        //set values of right bounding line *variable names don't match
        this.blLx1 = 522.681;
        this.blLy1 = 480;
        this.blLx2 = 1080;
        this.blLy2 = 158.231;

        //set values of left bounding line *variable names don't match
        this.blRx1 = 665.321;
        this.blRy1 = 0;
        this.blRx2 = 0;
        this.blRy2 = 384.123;

        this.spawnDelay = 2200; // in milliseconds
        this.obstacleSpeed = 100;
        this.score = 0;
        this.lateText = null;

        //player is created here
        this.player = new Cube(this, this.initialPos[0], this.initialPos[1], 'playerCube').setOrigin(1,0);
        this.background = this.add.image(0, 0, 'background').setOrigin(0,0).setDepth(0);
        this.scoreText = this.add.text(150, 50, this.score, this.textConfig).setOrigin(0.5);
        this.BattUI = this.add.text(900, 360, 'battery', this.textConfig).setOrigin(0.5);
        this.battText = this.add.text(980, 400, this.player.chargeTotal, this.textConfig).setOrigin(0.5);
        

        //creates red lines for debug
        this.graphics = this.add.graphics();
        this.line = new Phaser.Geom.Line(this.blx1, this.bly1, this.blx2, this.bly2);
        this.line2 = new Phaser.Geom.Line(this.blLx1, this.blLy1, this.blLx2, this.blLy2);
        this.line3 = new Phaser.Geom.Line(this.blRx1, this.blRy1, this.blRx2, this.blRy2);
        this.graphics.lineStyle(2, 0xff0000);
        //removes lines if debug is turned off *the variable
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
            key: 'late',
            frames: this.anims.generateFrameNumbers('lateText', { start: 0, end: 29, first: 0}),
            frameRate: 30
        });

        //Obstacles group is created
        this.obstacleGroup = this.add.group({
            runChildUpdate: true
        })
        this.chargeGroup = this.add.group({
            runChildUpdate: true
        })

        this.generateObstacles();
        // Timer for how often obstacles should start spawning
        this.spawnTimer = this.time.addEvent({
            delay: this.spawnDelay, 
            callback: function() { 
                this.generateObstacles(); 
            },
            loop: true,
            callbackScope: this
        })
        // Every second, add to the score
        this.scoreTimer = this.time.addEvent({
            delay: 1000, 
            callback: function() {
                if(this.gameOverCheck()){
                    this.incrementScore(1);
                    

                }
                
            },
            loop: true,
            callbackScope: this
        })

        this.batteryTimer = this.time.addEvent({
            delay: 800, 
            callback: function() {
                if(this.gameOverCheck()){
                    if(this.player.chargeTotal > 0) {
                    this.player.chargeTotal -= 1;
                    }
                }    
            },
            loop: true,
            callbackScope: this
        })


    }

    update(time, delta) {
        this.physics.add.overlap(this.player, this.chargeGroup, this.chargeCollision, null, this);

        // Delta is the amount of time since the previous update() call. Using this with the movement makes the game consistent across all framerates
        delta = delta/1000 // Turn delta into milliseconds
        //if gameover is triggered player movement is disabled
        if(this.gameOverCheck()) {
            this.player.update(delta);
            if(this.obstacleSpeed < 220) {
                this.incrementSpeed();
            }
        } else {
            if(keyR.isDown) this.scene.restart();
            if(this.lateText == null){
                //end song and gameover SFX
                this.game.sound.stopAll();
                this.sound.play('honk');
                
                // When it's gameover, play animation for late text
                this.scoreText.alpha = 0;
                this.add.rectangle(0, 0, game.config.width, game.config.height, "#000000", 0.5).setOrigin(0).setDepth(999);
                this.lateText = this.add.sprite(game.config.width-300, 100, 'lateText').setOrigin(0.5).setDepth(1000);
                this.lateText.anims.play('late');
                this.lateText.on('animationcomplete', () => { 
                    // after text animation, add score and instructions for restarting
                    this.textConfig.fontSize = "32px";
                    let highScore = this.add.text(game.config.width+300, 300, `highscore: ${highscore}`, this.textConfig).setOrigin(0.5).setDepth(1000);
                    let instructions = this.add.text(game.config.width+300, 350, `press (r) to restart`, this.textConfig).setOrigin(0.5).setDepth(1000);
                    // smooth animation for text position
                    this.tweens.add({
                        targets: [highScore, instructions],
                        alpha: {from: 0, to: 1},
                        x: {from: game.config.width+300, to: game.config.width-300},
                        ease: "Sine.easeInOut",
                        duration: 500,
                        repeat: 0,
                        yoyo: false
                    })
                })    
            }
        }

        //enables collision between obstacles and players
        this.physics.world.collide(this.player, this.obstacleGroup, this.playerCollision, null, this);
        this.physics.world.collide(this.player, this.chargeGroup, this.chargeCollision, null, this);

        //calls the function that calculates if the player is touching a bounding line, and then slows the player down if true
        if(this.collisionCircleLine()){
            this.player.x -= 1.75/4 * this.player.movespeed * delta;
            this.player.y += 1/4 * this.player.movespeed * delta;
        }
        if(this.collisionLeftBoundingLine()){
            rightCheck = false;
        }else {rightCheck = true;}
        if(this.collisionRightBoundingLine()){
            leftCheck = false;
        }else {leftCheck = true;}

        if(this.player.chargeTotal >= 0) {
            this.updateBattery();
        }
    }

    //function to pass if the player collides with an obstacle
    playerCollision() {
        //this.sound.play('honk');
        this.player.x -= 1.75/8;
        this.player.y += 1/8;
        return true;
    }

    //function that increases the players battery charge
    chargeCollision(player, charge) {
        charge.destroy();
        player.chargeTotal += 5;
        this.score += 100;
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
                    let obstacle = new Obstacle(this, initialPos[0]+(48*column)+(48*row), initialPos[1]+(27*column)-(27*row), Phaser.Utils.Array.GetRandom(this.carList), 0, this.obstacleSpeed);
                    this.obstacleGroup.add(obstacle);
                }
                if(digit == '2'){
                    if(this.player.chargeTotal < 60) {
                    let charge = new Charge(this, initialPos[0]+(48*column)+(48*row), initialPos[1]+(27*column)-(27*row), 'charge', 0, this.obstacleSpeed);
                    this.chargeGroup.add(charge);
                    }
                }
                column++;
            }
            row++;
        }
    }

    // When we increment the speed, change the movespeed of all obstacles, player, and spawning timer
    incrementSpeed(){
        // console.log("Incrementing speed");
        this.obstacleSpeed += .04; // Changes the speed for FUTURE obstacles
        Phaser.Actions.Call(this.obstacleGroup.getChildren(), function(obstacle) {
            obstacle.movespeed = this.obstacleSpeed; // Changes the speed of CURRENT obstacles
        }, this);
        //this.player.movespeed += .01;
        this.spawnTimer.delay -= .2;
    }

    incrementScore(score){
        // console.log("Incrementing score");
        this.score += score;
        this.scoreText.text = this.score;
        if (this.score > highscore) highscore = this.score;

    }

    updateBattery(){
        this.battText.setText(this.player.chargeTotal);
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

    collisionLeftBoundingLine(){
        this.side1 = Math.sqrt(Math.pow(this.player.x - this.blLx1,2) + Math.pow(this.player.y - this.blLy1,2)); // Thats the pythagoras theoram If I can spell it right
        this.side2 = Math.sqrt(Math.pow(this.player.x - this.blLx2,2) + Math.pow(this.player.y - this.blLy2,2));
        this.base = Math.sqrt(Math.pow(this.blLx2 - this.blLx1,2) + Math.pow(this.blLy2 - this.blLy1,2));
    
        if(44 > this.side1 || 44 > this.side2)
            return true;
    
        this.angle1 = Math.atan2( this.blLx2 - this.blLx1, this.blLy2 - this.blLy1 ) - Math.atan2( this.player.x - this.b1Lx1, this.player.y - this.blLy1 ); // Some complicated Math
        this.angle2 = Math.atan2( this.blLx1 - this.blLx2, this.blLy1 - this.blLy2 ) - Math.atan2( this.player.x - this.blLx2, this.player.y - this.blLy2 ); // Some complicated Math again
    
        if(this.angle1 > Math.PI / 2 || this.angle2 > Math.PI / 2) // Making sure if any angle is an obtuse one and Math.PI / 2 = 90 deg
            return false;
    
    
            // Now if none are true then
            this.semiperimeter = (this.side1 + this.side2 + this.base) / 2;
            this.areaOfTriangle = Math.sqrt( this.semiperimeter * (this.semiperimeter - this.side1) * (this.semiperimeter - this.side2) * (this.semiperimeter - this.base) ); // Heron's formula for the area
            this.height = 2*this.areaOfTriangle/this.base;
    
            if( this.height < 44 )
                return true;
            else
                return false;
    
    }

    collisionRightBoundingLine(){
        this.side1 = Math.sqrt(Math.pow(this.player.x - this.blRx1,2) + Math.pow(this.player.y - this.blRy1,2)); // Thats the pythagoras theoram If I can spell it right
        this.side2 = Math.sqrt(Math.pow(this.player.x - this.blRx2,2) + Math.pow(this.player.y - this.blRy2,2));
        this.base = Math.sqrt(Math.pow(this.blRx2 - this.blRx1,2) + Math.pow(this.blRy2 - this.blRy1,2));
    
        if(21 > this.side1 || 21 > this.side2)
            return true;
    
        this.angle1 = Math.atan2( this.blRx2 - this.blRx1, this.blRy2 - this.blRy1 ) - Math.atan2( this.player.x - this.b1Rx1, this.player.y - this.blRy1 ); // Some complicated Math
        this.angle2 = Math.atan2( this.blRx1 - this.blRx2, this.blRy1 - this.blRy2 ) - Math.atan2( this.player.x - this.blRx2, this.player.y - this.blRy2 ); // Some complicated Math again
    
        if(this.angle1 > Math.PI / 2 || this.angle2 > Math.PI / 2) // Making sure if any angle is an obtuse one and Math.PI / 2 = 90 deg
            return false;
    
    
            // Now if none are true then
            this.semiperimeter = (this.side1 + this.side2 + this.base) / 2;
            this.areaOfTriangle = Math.sqrt( this.semiperimeter * (this.semiperimeter - this.side1) * (this.semiperimeter - this.side2) * (this.semiperimeter - this.base) ); // Heron's formula for the area
            this.height = 2*this.areaOfTriangle/this.base;
    
            if( this.height < 21 )
                return true;
            else
                return false;
    
    }
}