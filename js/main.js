var canvas;
var ctx;
var width;
var height;
var agents = [];
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

function init() {
    var palette = palettes.acid;

    canvas = document.getElementById("cnvs");
    ctx = this.canvas.getContext("2d");
    canvas.style.backgroundColor = palette[0];

    resize();

    var alea = new Alea();
    var simplex = new SimplexNoise(alea);

    for (var i = 0; i < 3000; i++) {
        agents.push(new Agent(simplex, alea, canvas, palette.slice(1, palette.length)));
    }

    draw();
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < agents.length; i++) {
        agents[i].update(offsetX, offsetY);
        agents[i].draw();
    }

    offsetX += offsetInc;
    offsetY += offsetInc;

    requestAnimationFrame(draw);
}