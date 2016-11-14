var audios = [];
var alea;
var simplex;
var palette;
var canvas;
var ctx;
var width;
var height;
var sliders = [];
var fps = 60;
var offsetX = 0;
var offsetY = 0;
var offsetInc = 0.002;
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
var audioFiles = [
    "sounds/balloons.mp4",
    "sounds/piano.mp4",
    "sounds/violin.mp4"
];

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
        sliders.push(new Slider(alea(), alea(), color, {simplex, alea, canvas}));
    }

    canvas.addEventListener('click', function(e) {

        var clickCoords = getCursorPositionOnCanvas(e);
        for (var i = 0; i < sliders.length; i++) {
            if (sliders[i].hitTest(clickCoords.x, clickCoords.y)) {
                sliders[i].onClick();
                toggleAudio(i);
                break;
            }
        }
    }, false);

    draw();
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

function getCursorPositionOnCanvas(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return {x, y};
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < sliders.length; i++) {
        sliders[i].update(offsetX, offsetY);
        sliders[i].draw();
    }

    offsetX += offsetInc;
    offsetY += offsetInc;

    requestAnimationFrame(draw);
}