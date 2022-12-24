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
    console.log(data);
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
    if (incoming[0] == '/ground' && incoming[1] > 2000) {
        // pondSound.play();
        pondSound.setVolume(.7);
        show = true;
    }
}

// MODIFY ME
let pMapper;
let quadMap, triMap, lineMap, maskMap;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    // create mapper object
    pMapper = createProjectionMapper(this);

    // create mapping surfaces
    // triMap = pMapper.createTriMap(300, 300);
    quadMap = pMapper.createQuadMap(900, 900);
    quadMap.x -= quadMap.width / 2;
    quadMap.y -= quadMap.height / 2;

    // lineMap = pMapper.createLineMap();

    // // creates a black mask with 5 moveable points
    // maskMap = pMapper.createMaskMap(5);
}

function draw() {
    background(0);

    if (show) {
        quadMap.clear();
        quadMap.imageMode(CENTER);
        quadMap.image(pondImg, 0, 0);
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
