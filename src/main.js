let config = {
    type: Phaser.CANVAS,
    width: 1080,
    height: 480,
    autoCenter: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            fps: 30,
            debug: true         
        }
    },
    scene: [Play],
}
// Get the yaml stuff as quick as possible
let obstacleYAML;
getYAML();

let game = new Phaser.Game(config)

// reserve inputs
let keyLEFT, keyRIGHT, keyR;

let obstacleTotal = 0;
let debugCheck = true;

async function getYAML(){
    const yaml = await fetch("./src/obstacles.yaml");
    const yamlText = await yaml.text();
    obstacleYAML = jsyaml.load(yamlText);
}