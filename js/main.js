var canvas;
var ctx;
var width;
var height;
var agents = [];
var fps = 60;
var offsetX = 0;
var offsetY = 0;
var offsetInc = 0.004;

function init() {
    canvas = document.getElementById("cnvs");
    ctx = this.canvas.getContext("2d");

    resize();

    var alea = new Alea();
    var simplex = new SimplexNoise(alea);

    for (var i = 0; i < 2000; i++) {
        agents.push(new Agent(simplex, alea, canvas));
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