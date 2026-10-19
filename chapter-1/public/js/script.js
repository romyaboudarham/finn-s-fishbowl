let pondImg;
let pondSound;

function preload() {
    pondImg = loadImage('public/img/pond-v2.png');
    //pondSound = loadSound('public/sounds/pond-dec-3.mp3');
}

let show = false;

//Connect directly to the Feather's websocket (its own Wi-Fi network is always 192.168.4.1)
const FEATHER_URL = 'ws://192.168.4.1:81';

//Show connection state in the header so a black screen isn't a mystery
function setStatus(msg) {
    console.log(msg);
    let el = document.getElementById('status');
    if (el) el.textContent = msg;
}

function connectSensor() {
    let socket = new WebSocket(FEATHER_URL);
    socket.onopen = function () {
        setStatus('Sensor: connected');
    };
    socket.onmessage = function (event) {
        let data = JSON.parse(event.data);
        console.log('foot:', data.foot);
        parse(data);
    };
    //Retry if the Feather restarts or isn't on yet
    socket.onclose = function () {
        setStatus('Sensor: not connected (join the pond_sensor Wi-Fi) - retrying...');
        show = false;
        setTimeout(connectSensor, 1000);
    };
}
connectSensor();

//Function to parse incoming data, e.g. {"foot":1234}
function parse(incoming) {
    if (incoming.foot > 2000) {
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

    // create mapping surface - p5.mapper clamps it to the canvas size,
    // so fit it inside the window while keeping the pond's proportions
    let fit = min(width / pondImg.width, height / pondImg.height) * 0.9;
    quadMap = pMapper.createQuadMap(pondImg.width * fit, pondImg.height * fit);
    quadMap.x -= quadMap.width / 2;
    quadMap.y -= quadMap.height / 2;

}

function draw() {
    background(0);
    //Always show the pond while calibrating so the corners can be dragged
    if (show || isCalibratingMapper()) {
        tint(255, fade);
        showImg();
        if (fade < 255) fade += fadeAmount; 
    } else if (fade > 0) {
        tint(255, fade);
        showImg();
        fade -= fadeAmount; 
    } else {
        quadMap.displayTexture(null);
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

function showImg() {
    // Map the whole image onto the quad, edge to edge (calibration sets its shape).
    // p5.mapper's mesh only reaches (res-1)/res of the texture, so shrink the
    // texture size by the same amount to make the image reach the far edges
    let edge = (quadMap.res - 1) / quadMap.res;
    quadMap.displayTexture(pondImg, 0, 0, quadMap.width * edge, quadMap.height * edge);
}