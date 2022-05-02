//  GROUP: Annie Zhang, Robert Newlin, Michael Remorin
//  TITLE: Road Rush
//  COMPLETED: 5/2/2022
/* 
    CREATIVE TILT:
    - Used YAML as an authoring language to create template obstacles for our game, in order to fine-tune the experience (obstacles.yaml/Play:266)
    - Used math in order to develop our own way of detecting collisions and play-area borders in isometric (Play:325)
    - Used tweens in order to add more polish to the UI (Menu:101/Play:210)
    - Very catchy background music!
    - Retro-esque aesthetic with pixel art style and sounds
*/


let config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 480,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            fps: 30,
            debug: false         
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
let debugCheck = false;     //set false to remove red lines
let highscore = 0;
let leftCheck = true;
let rightCheck = true;

async function loadResources(){
    const yaml = await fetch("./src/obstacles.yaml");
    const yamlText = await yaml.text();
    obstacleYAML = jsyaml.load(yamlText);
}
