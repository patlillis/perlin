var alea;
var audios = [];
var canvas;
var control;
var ctx;
var dragging = null;
var dragHoldPosition = Vector.zero;
var easeAmount = 0.05;
var fps = 60;
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
        var slider = new Slider(data[0], data[1], data[2], { simplex, alea, canvas });
        sliders.push(slider);

        for (var j = 3; j < data.length; j++) {
            var rect = data[j];
            slider.addRectangle(new Rectangle(rect.position, rect.size, slider.color, PALETTE[0], canvas));
        }
    }

    canvas.addEventListener("mousedown", canvasMouseDownListener, false);
    canvas.addEventListener("touchstart", canvasMouseDownListener, false);

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

            // We will pay attention to the point on the object where the mouse is "holding" the object:
            dragHoldPosition.x = mousePosition.x - slider.origin.x;
            dragHoldPosition.y = mousePosition.y - slider.origin.y;

            targetPosition.x = mousePosition.x - dragHoldPosition.x;
            targetPosition.y = mousePosition.y - dragHoldPosition.y;

            break;
        }
    }

    if (dragging !== null) {
        window.addEventListener("mousemove", canvasMouseMoveListener, false);
        window.addEventListener("touchmove", canvasMouseMoveListener, false);
    }

    canvas.removeEventListener("mousedown", canvasMouseDownListener, false);
    canvas.removeEventListener("touchstart", canvasMouseDownListener, false);
    window.addEventListener("mouseup", canvasMouseUpListener, false);
    window.addEventListener("touchend", canvasMouseUpListener, false);

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
    canvas.addEventListener("touchstart", canvasMouseDownListener, false);
    window.removeEventListener("mouseup", canvasMouseUpListener, false);
    window.removeEventListener("touchend", canvasMouseUpListener, false);

    if (!hasMoved) {
        // Didn't drag anything, see if one of the controls was clicked.
        var clickCoords = getCursorPositionOnCanvas(e);
        if (Vector.eq(clickCoords, mousePosition)) {
            for (var i = sliders.length - 1; i >= 0; i--) {
                if (sliders[i].hitTest(clickCoords)) {
                    sliders[i].onClick();
                    break;
                }
            }
        }
    }

    if (dragging !== null) {
        dragging = null;
        hasMoved = false;
        window.removeEventListener("mousemove", canvasMouseMoveListener, false);
        window.removeEventListener("touchmove", canvasMouseMoveListener, false);
    }
}

function canvasMouseMoveListener(e) {
    hasMoved = true;

    //Control can move around in the middle quarter of the canvas
    var min = Vector.subtract(Vector.zero, dragging.min);
    var max = Vector.subtract(canvas.size(), dragging.max);

    //getting mouse position correctly
    mousePosition = getCursorPositionOnCanvas(e);

    //clamp x and y positions to prevent object from dragging outside of canvas
    var pos = new Vector(mousePosition.x - dragHoldPosition.x, mousePosition.y - dragHoldPosition.y);
    pos.x = (pos.x < min.x) ? min.x : ((pos.x > max.x) ? max.x : pos.x);
    pos.y = (pos.y < min.y) ? min.y : ((pos.y > max.y) ? max.y : pos.y);

    targetPosition = pos;
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

    if (dragging !== null) {
        var x = dragging.origin.x + easeAmount * (targetPosition.x - dragging.origin.x);
        var y = dragging.origin.y + easeAmount * (targetPosition.y - dragging.origin.y);
        dragging.setOrigin(new Vector(x, y));
    }

    for (var i = 0; i < sliders.length; i++) {
        sliders[i].update(offset);
        sliders[i].drawRectangles();
    }

    for (var i = 0; i < sliders.length; i++) {
        sliders[i].drawAgents();
    }

    offset.x += offsetInc;
    offset.y += offsetInc;

    requestAnimationFrame(draw);
}