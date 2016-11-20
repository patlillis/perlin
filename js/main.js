var alea;
var audios = [];
var canvas;
var control;
var ctx;
var dragging = null;
var dragHoldPosition = Vector.zero;
var easeAmount = 0.05;
// var fps = 60;
var hasMoved = false;
var mousePosition = Vector.zero;
var offsetInc = 0.002;
var offset = Vector.zero;
var simplex;
var sliders = [];
var targetPosition = Vector.zero;

function init() {
    canvas = document.getElementById("cnvs");
    canvas.size = () => new Vector(canvas.width, canvas.height);
    ctx = this.canvas.getContext("2d");
    canvas.style.backgroundColor = PALETTE[0];

    resize();

    alea = new Alea();
    simplex = new SimplexNoise(alea);

    for (var i = 0; i < RECTANGLES.length; i++) {
        var data = RECTANGLES[i];
        var color = data[0];
        var audio = data[1];
        var pos0 = data[2];
        var pos1 = data[3];
        var startPos = data[4];
        var rectIndex = 5;

        var slider = new Slider(color, audio, pos0, pos1, startPos, { simplex, alea, canvas });
        for (; rectIndex < data.length; rectIndex++) {
            var rect = data[rectIndex];
            slider.addRectangle(new Rectangle(rect.position, rect.size, slider.color, PALETTE[0], canvas));
        }
        sliders.push(slider);
    }

    canvas.addEventListener("mousedown", canvasMouseDownListener, false)

    draw();
}

// We are going to pay attention to the layering order of the objects so that if a mouse down occurs over more than object,
// only the topmost one will be dragged.
function canvasMouseDownListener(e) {
    mousePosition = getCursorPositionOnCanvas(e);

    //Find which shape was clicked
    for (var i = sliders.length - 1; i >= 0; i--) {
        var slider = sliders[i];
        if (slider.hitTest(mousePosition)) {
            dragging = slider;
            dragging.dragStart(mousePosition);
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
        if (Vector.eq(clickCoords, mousePosition)) {
            for (var i = sliders.length - 1; i >= 0; i--) {
                if (sliders[i].hitTest(clickCoords)) {
                    sliders[i].click();
                    break;
                }
            }
        }
    }

    if (dragging !== null) {
        dragging.dragStop();
        dragging = null;
        hasMoved = false;
        window.removeEventListener("mousemove", canvasMouseMoveListener, false);
    }
}

function canvasMouseMoveListener(e) {
    hasMoved = true;

    //getting mouse position correctly
    mousePosition = getCursorPositionOnCanvas(e);

    if (dragging !== null) {
        dragging.dragMove(mousePosition);
    }
}

// Getting mouse position correctly, being mindful of resizing that may have occured in the browser:
function getCursorPositionOnCanvas(event) {
    var rect = canvas.getBoundingClientRect();
    var x = (event.clientX - rect.left) * (canvas.width / rect.width);
    var y = (event.clientY - rect.top) * (canvas.width / rect.width);
    return new Vector(x, y);
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < sliders.length; i++) {
        sliders[i].update(offset);
        sliders[i].drawBlips();
        sliders[i].drawRectangles();
    }

    offset.x += offsetInc;
    offset.y += offsetInc;

    requestAnimationFrame(draw);
}