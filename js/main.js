var alea;
var audioFiles = [
    "balloons",
    "piano",
    "violin"
];
var canvas;
var ctx;
var fps = 60;
var height;
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
var soundManager;
var sounds = [];
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

    canvas.addEventListener('click', function(e) {

        var clickCoords = getCursorPositionOnCanvas(e);
        for (var i = 0; i < sliders.length; i++) {
            if (sliders[i].hitTest(clickCoords.x, clickCoords.y)) {
                sliders[i].onClick();

                soundManager.setVolume(sounds[i].id, 100 - sounds[i].volume);
                break;
            }
        }
    }, false);

    draw();
}

function initAudio() {
    // initialize the sound manager
    soundManager.url = 'soundManager2/';
    soundManager.useHTML5Audio = true;
    soundManager.preferFlash = false;
    soundManager.useHighPerformance = true; // reduces delays

    // reduce the default 1 sec delay to 500 ms
    soundManager.flashLoadTimeout = 500;

    // mp3 is required by default, but we don't want any requirements
    soundManager.audioFormats.mp3.required = false;

    soundManager.onready(function() {
        // Stuff is ready!
        // console.log('STUFF IS READY!!!');
    });

    var loader = new PxLoader(),
        i, len, url;

    // queue each sound for loading
    for (i = 0, len = audioFiles.length; i < len; i++) {

        // see if the browser can play mp3
        url = 'sounds/' + audioFiles[i] + '.mp3';
        if (!soundManager.canPlayURL(url)) {
            continue; // can't be played
        }

        // queue the sound using the name as the SM2 id
        loader.addSound(audioFiles[i], url);
    }

    loader.addCompletionListener(function() {
        for (var audioFile of audioFiles) {
            var sound = soundManager.setVolume(audioFile, 0);
            sound.play();
            sounds.push(sound);
        }
    });

    loader.start();
}

function getCursorPositionOnCanvas(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
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

    for (var i = 0; i < sliders.length; i++) {
        sliders[i].update(offsetX, offsetY);
        sliders[i].draw();
    }

    offsetX += offsetInc;
    offsetY += offsetInc;

    requestAnimationFrame(draw);
}