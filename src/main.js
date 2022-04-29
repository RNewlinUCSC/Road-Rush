let config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 480,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            fps: 30,
            debug: true         
        }
    },
    scene: [Menu, Play, Credits]
}
// Get the yaml stuff as quick as possible
let obstacleYAML;
loadResources();

let game = new Phaser.Game(config)

// reserve inputs
let keyLEFT, keyRIGHT, keyR, keyC, keyP;

let obstacleTotal = 0;
let debugCheck = true;
let highscore = 0;
let leftCheck = true;
let rightCheck = true;

async function loadResources(){
    const yaml = await fetch("./src/obstacles.yaml");
    const yamlText = await yaml.text();
    obstacleYAML = jsyaml.load(yamlText);
}
