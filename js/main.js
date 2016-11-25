var alea;
var audios = [];
var canvas;
var control;
var ctx;
var dragging = null;
var dragHoldPosition = Vector.zero;
var easeAmount = 0.05;
var hasMoved = false;
var mousePosition = Vector.zero;
var offsetInc = 0.002;
var offset = Vector.zero;
var simplex;
var sliders = [];
var targetPosition = Vector.zero;

function init() {
    var bgColor = PALETTE[0];
    canvas = document.getElementById("cnvs");
    canvas.size = () => new Vector(canvas.width, canvas.height);
    ctx = this.canvas.getContext("2d");
    canvas.style.backgroundColor = bgColor;

    resize();

    alea = new Alea();
    simplex = new SimplexNoise(alea);

    for (var i = 0; i < RECTANGLES.length; i++) {
        var data = RECTANGLES[i];
        var dataIndex = 0;
        var animator = data[dataIndex++];
        var color = data[dataIndex++];
        var audio = data[dataIndex++];
        var pos0 = data[dataIndex++];
        var pos1 = data[dataIndex++];
        var startPos = data[dataIndex++];

        var slider = new Slider(animator, color, bgColor, audio, pos0, pos1, startPos, { simplex, alea, canvas });
        for (; dataIndex < data.length; dataIndex++) {
            var rect = data[dataIndex];
            slider.addRectangle(new Rectangle(rect.position, rect.size, slider.color, bgColor, canvas));
        }
        sliders.push(slider);
    }

    canvas.addEventListener("mousedown", canvasMouseDownListener, false);
    window.addEventListener("mousemove", canvasMouseMoveListener, false);

    draw();
}

// We are going to pay attention to the layering order of the objects so that if a mouse down occurs over more than object,
// only the topmost one will be dragged.
function canvasMouseDownListener(e) {
    mousePosition = getCursorPositionOnCanvas(e);

    //Find which shape was clicked
    sliders.someReverse(function (s) {
        if (s.hitTest(mousePosition)) {
            dragging = s;
            dragging.dragStart(mousePosition);
            // Break loop early.
            return true;
        }
    });

    if (dragging !== null) {
        window.addEventListener("mousemove", canvasDragMouseMoveListener, false);
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
    mousePosition = getCursorPositionOnCanvas(e);

    canvas.addEventListener("mousedown", canvasMouseDownListener, false);
    window.removeEventListener("mouseup", canvasMouseUpListener, false);

    if (!hasMoved) {
        // Didn't drag anything, for now there's no behavior in that case.
    }

    if (dragging !== null) {
        dragging.dragStop();
        dragging = null;
        hasMoved = false;
        window.removeEventListener("mousemove", canvasDragMouseMoveListener, false);
    }

    canvasMouseMoveListener(e);
}

function canvasMouseMoveListener(e) {
    mousePosition = getCursorPositionOnCanvas(e);

    // Find which shape was hovered
    var isHovering = (dragging != null);
    sliders.someReverse(function (s) {
        if (!isHovering && s.hitTest(mousePosition)) {
            s.isHovering = true;
            isHovering = true;
        }
        else {
            s.isHovering = false;
        }
    });
}

function canvasDragMouseMoveListener(e) {
    mousePosition = getCursorPositionOnCanvas(e);
    hasMoved = true;

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

    sliders.forEach((s) => s.update(offset));
    sliders.forEach((s) => s.drawAnimator());
    sliders.forEach((s) => s.drawRectangles());
    sliders.forEach((s) => s.drawArrows());

    offset.x += offsetInc;
    offset.y += offsetInc;

    requestAnimationFrame(draw);
}