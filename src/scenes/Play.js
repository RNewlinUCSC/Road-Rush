class Play extends Phaser.Scene {
    constructor() {
        super("Play");
    }

    init(data){
        // In the menu, player moves to start the game. This data just lets us place the player in the same spot in a new scene
        this.initialPos = [data.playerX, data.playerY];
    }

    preload() {
        //load images here
        this.load.path = "./assets/"; // set path so that it's easier to type the strings when loading
        this.load.image('obstacle', 'carGray.png');
        this.load.image('late', 'youreLate.png');
        this.load.image('charge', 'charge.png');
        //load sprite sheets

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
        console.log("In Play");
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
        this.thresholds = [50, 100, 150, 200, 250]; // When player reaches a score in this array, speed increases

        //player is created here
        this.player = new Cube(this, this.initialPos[0], this.initialPos[1], 'playerCube').setOrigin(1,0);
        this.background = this.add.image(0, 0, 'background').setOrigin(0,0).setDepth(0);
        this.scoreText = this.add.text(150, 50, this.score, this.textConfig).setOrigin(0.5);
        

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
                    // Increment speed based on current score
                    if(this.thresholds.includes(this.score)) this.incrementSpeed();
                }    
            },
            loop: true,
            callbackScope: this
        })


    }

    update(time, delta) {
        console.log(this.player.chargeTotal);
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
            if(this.lateText==null) this.lateText = this.add.image(0,0,'late').setOrigin(0,0).setDepth(1000);
            if(keyR.isDown) this.scene.restart();
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
    }

    //function to pass if the player collides with an obstacle
    playerCollision() {
        this.player.x -= 1.75/8;
        this.player.y += 1/8;
    }

    chargeCollision(player, charge) {
        charge.destroy();
        player.chargeTotal += 10;
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
                    let obstacle = new Obstacle(this, initialPos[0]+(48*column)+(48*row), initialPos[1]+(27*column)-(27*row), 'obstacle', 0, this.obstacleSpeed);
                    this.obstacleGroup.add(obstacle);
                }
                if(digit == '2'){
                    let charge = new Charge(this, initialPos[0]+(48*column)+(48*row), initialPos[1]+(27*column)-(27*row), 'charge', 0, this.obstacleSpeed);
                    this.chargeGroup.add(charge);
                }
                column++;
            }
            row++;
        }
    }

    // When we increment the speed, change the movespeed of all obstacles, player, and spawning timer
    incrementSpeed(){
        // console.log("Incrementing speed");
        this.obstacleSpeed += .02; // Changes the speed for FUTURE obstacles
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