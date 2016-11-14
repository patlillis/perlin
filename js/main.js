var alea;
var audioFiles = [
    "sounds/balloons.mp3",
    "sounds/piano.mp3",
    "sounds/violin.mp3"
];
var audios = [];
var canvas;
var control;
var ctx;
var dragging = null;
var dragHoldX;
var dragHoldY;
var easeAmount = 0.05;
var fps = 60;
var hasMoved = false;
var height;
var mouseX;
var mouseY;
var offsetInc = 0.002;
var offsetX = 0;
var offsetY = 0;
var palette;
var palettes = {
    blue: [
        '#FAFAFA',
        '#C7EEFF',
        '#0077C0',
        '#1D242B'
    ],
    lemonade: [
        '#F7E74A',
        '#09C6AB',
        '#068888',
        '#02556D'
    ],
    cyborg: [
        '#3C2F3D',
        '#2EAC6D',
        '#9DDA52',
        '#F0F0F0'
    ],
    acid: [
        '#041122',
        '#259073',
        '#7FDA89',
        '#E6F99D'
    ]
};
var simplex;
var sliders = [];
var targetX;
var targetY;
var width;

function init() {
    initAudio();
    palette = palettes.acid;

    canvas = document.getElementById("cnvs");
    ctx = this.canvas.getContext("2d");
    canvas.style.backgroundColor = palette[0];

    resize();

    alea = new Alea();
    simplex = new SimplexNoise(alea);

    for (var i = 1; i < palette.length; i++) {
        var color = palette[i];
        sliders.push(new Slider(alea(), alea(), color, { simplex, alea, canvas }));
    }

    canvas.addEventListener("mousedown", canvasMouseDownListener, false);

    draw();
}

// We are going to pay attention to the layering order of the objects so that if a mouse down occurs over more than object,
// only the topmost one will be dragged.
function canvasMouseDownListener(e) {
    var clickCoords = getCursorPositionOnCanvas(e);
    mouseX = clickCoords.x;
    mouseY = clickCoords.y;

    //Find which shape was clicked
    for (var i = sliders.length - 1; i >= 0; i--) {
        var slider = sliders[i];
        if (slider.hitTest(mouseX, mouseY)) {
            dragging = slider;

            // We will pay attention to the point on the object where the mouse is "holding" the object:
            dragHoldX = mouseX - slider.actualX;
            dragHoldY = mouseY - slider.actualY;

            targetX = mouseX - dragHoldX;
            targetY = mouseY - dragHoldY;

            break;
        }
    }

    if (dragging !== null) {
        window.addEventListener("mousemove", canvasMouseMoveListener, false);
    }

    canvas.removeEventListener("mousedown", canvasMouseDownListener, false);
    window.addEventListener("mouseup", canvasMouseUpListener, false);

    // Code below prevents the mouse down from having an effect on the main browser window:
    if (e.preventDefault) {
        e.preventDefault();
    } // Standard
    else if (e.returnValue) {
        e.returnValue = false;
    } // Older IE
    return false;
}

function canvasMouseUpListener(e) {
    canvas.addEventListener("mousedown", canvasMouseDownListener, false);
    window.removeEventListener("mouseup", canvasMouseUpListener, false);

    if (!hasMoved) {
        // Didn't drag anything, see if one of the controls was clicked.
        var clickCoords = getCursorPositionOnCanvas(e);
        if (clickCoords.x == mouseX && clickCoords.y == mouseY) {
            for (var i = sliders.length - 1; i >= 0; i--) {
                if (sliders[i].hitTest(clickCoords.x, clickCoords.y)) {
                    sliders[i].onClick();
                    toggleAudio(i);
                    break;
                }
            }
        }
    }

    if (dragging !== null) {
        dragging = null;
        hasMoved = false;
        window.removeEventListener("mousemove", canvasMouseMoveListener, false);
    }
}

function canvasMouseMoveListener(e) {
    hasMoved = true;
    var posX;
    var posY;

    //Control can move around in the middle quarter of the canvas
    var minX = 0;
    var maxX = canvas.width - dragging.width;
    var minY = 0;
    var maxY = canvas.height - dragging.height;

    //getting mouse position correctly
    var clickCoords = getCursorPositionOnCanvas(e);
    mouseX = clickCoords.x;
    mouseY = clickCoords.y;

    //clamp x and y positions to prevent object from dragging outside of canvas
    posX = mouseX - dragHoldX;
    posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
    posY = mouseY - dragHoldY;
    posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

    targetX = posX;
    targetY = posY;
}



function initAudio() {
    function preloadAudio(url) {
        var audio = new Audio();
        // once this file loads, it will call loadedAudio()
        // the file will be kept by the browser as cache
        audio.addEventListener('canplaythrough', audioLoaded.bind(null, url), false);
        audio.src = url;
    }

    function audioLoaded(url) {
        var audio = document.createElement("audio");
        audio.src = url;
        audio.loop = true;
        audios.push(audio);
    }

    for (var i = 0; i < audioFiles.length; i++) {
        preloadAudio(audioFiles[i]);
    }
}

function toggleAudio(i) {
    if (audios[i].paused)
        audios[i].play();
    else
        audios[i].pause();
}

// Getting mouse position correctly, being mindful of resizing that may have occured in the browser:
function getCursorPositionOnCanvas(event) {
    var rect = canvas.getBoundingClientRect();
    var x = (event.clientX - rect.left) * (canvas.width / rect.width);
    var y = (event.clientY - rect.top) * (canvas.width / rect.width);
    return { x, y };
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    if (dragging !== null) {
        dragging.setActualX(dragging.actualX + easeAmount * (targetX - dragging.actualX));
        dragging.setActualY(dragging.actualY + easeAmount * (targetY - dragging.actualY));
    }

    for (var i = 0; i < sliders.length; i++) {
        sliders[i].update(offsetX, offsetY);
        sliders[i].draw();
    }

    offsetX += offsetInc;
    offsetY += offsetInc;

    requestAnimationFrame(draw);
}