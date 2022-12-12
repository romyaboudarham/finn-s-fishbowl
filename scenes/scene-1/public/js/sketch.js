// --------------------------------------------------------
// analog-joystick
// --------------------------------------------------------
let socket;
let pointSizeX      = 150;
let pointSizeY      = 150;

let resistance = 1023;

function preload() {
    sasha = loadImage("../media/sasha1.jpg");
  }

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    socket = io.connect();

    socket.on('data',
        (data) => {
            // weight in grams
            resistance = data.weightData;
            // console.log(weight);
        });
    textSize(200)
    fade = 0
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

var fade;
var fadeAmount = 5;
var show = false;

function draw() {
    sasha.resize(400,450);
    background(0, 0, 0);
    if (show && fade<255) {
        fill(255, 0, 0, fade);
        image(sasha,window.innerWidth/2-100, window.innerHeight/2-100);
        fade += fadeAmount; 
    } else if (fade == 255) {
        fill(255, 0, 0, fade);
        image(sasha,window.innerWidth/2-100, window.innerHeight/2-100);
    }çcc

    if (resistance < 200) {
        show = true;
    }
}