let pondImg;
let pondSound;

function preload() {
    pondImg = loadImage('public/img/just-pond.png');
    pondSound = loadSound('public/sounds/pond-dec-3.mp3');
}

//Connect to node server and recieve data via a websocket
var socket = io.connect('//localhost:3000');
socket.on('mysocket', function (data) {
    //log the data
    // console.log(data);
    //parse the data
    parse(data);
    //Jquery function to set text of H1 text to websocket data
    // $('#incoming').text(data);

});
socket.on('error', function () {
    console.error(arguments)
});

let show = false;

//Function to parse incoming data
function parse(incoming) {
    if ((incoming[0] == '/foot' && incoming[1] > 2000) || (incoming[0] == '/finger' && incoming[1] > 2000)) {
        // pondSound.play();
        // pondSound.setVolume(.7);
        show = true;
    } else {
        show = false;
    }
}

let pMapper;
let quadMap;
let fade;
let fadeAmount = 10;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    fade = 0

    // create mapper object
    pMapper = createProjectionMapper(this);

    // create mapping surfaces
    quadMap = pMapper.createQuadMap(pondImg.width+50, pondImg.height+50);
    quadMap.x -= quadMap.width / 2;
    quadMap.y -= quadMap.height / 2;

    // TEST
    // quadMap.imageMode(CENTER);
    // quadMap.image(pondImg, 0, 0);

}

function draw() {
    background(0);
    quadMap.clear();

    if (show) {
        tint(255, fade);
        quadMap.imageMode(CENTER);
        quadMap.image(pondImg, 0, 0);

        // if (fade<0) fadeAmount=1; 
        // if (fade>255) fadeAmount=-10; 
        if (fade < 255) fade += fadeAmount; 
    } else if (fade > 0) {
        tint(255, fade);
        quadMap.imageMode(CENTER);
        quadMap.image(pondImg, 0, 0);
        fade -= fadeAmount; 
    }
}

function keyPressed() {
    switch (key) {
        case 'c':
            // enter/leave calibration mode
            pMapper.toggleCalibration();
            break;
        case 'l':
            // load calibration file
            pMapper.load("maps/map.json");
            break;
        case 's':
            // saves the calibration to map.json
            pMapper.save("map.json");
            break;
        case 'f':
            let fs = fullscreen();
            document.getElementById("header").style.display = "none";
            fullscreen(!fs);
            console.log("go")
            break;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
