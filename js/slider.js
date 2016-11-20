class Slider {
    // position is percentage of total canvas size, params should have: { simplex, alea, canvas }
    constructor(color, audioUrl, offPosition, onPosition, startPosition, params) {
        this.alea = params.alea;
        this.offPosition = offPosition;
        this.onPosition = onPosition;
        this.position = Vector.lerp(offPosition, onPosition, startPosition);
        this.color = color;
        this.blips = [];
        this.rectangles = [];
        this.enabled = false;
        this.canvas = params.canvas;
        this.easeAmount = 0.05;

        this.spawnBlip = () => new Blip(color, params);

        var numBlips = (this.alea() * 300) + 200;
        for (var i = 0; i < numBlips; i++) {
            this.blips.push(this.spawnBlip());
        }

        // Tracks the total encompasing size of all rectangles. These are relative positions from the slider's origin.
        this.min = new Vector(Infinity, Infinity);
        this.max = new Vector(-Infinity, -Infinity);

        this.initAudio(audioUrl);

        // For tracking movement.
        this.dragging = false;
        // Position on slider that mouse was clicked.
        this.dragPoint = Vector.zero;
        // Position the slider should be moving towards.
        this.targetPosition = Vector.zero;
    }

    initAudio(url) {
        var audio = new Audio();
        // once this file loads, it will call audioLoaded()
        // the file will be kept by the browser as cache
        audio.addEventListener('canplaythrough', audioLoaded.bind(this), false);
        audio.src = url;

        function audioLoaded() {
            var audioEl = document.createElement("audio");
            audioEl.src = url;
            audioEl.loop = true;
            audioEl.volume = 0;
            audioEl.play();
            this.audio = audioEl;
        }
    }

    addRectangle(r) {
        this.rectangles.push(r);
        this.min = Vector.min(this.min, r.position);
        this.max = Vector.max(this.max, Vector.add(r.position, r.size));
    }

    get origin() {
        return new Vector(this.canvas.width * this.position.x, this.canvas.height * this.position.y);
    }

    setOrigin(o) {
        this.position.x = o.x / this.canvas.width;
        this.position.y = o.y / this.canvas.height;
    }

    update(offset) {
        // Update position, if dragging.

        if (this.dragging) {
            var distance = Vector.subtract(this.targetPosition, this.origin);
            var easedDistance = Vector.scale(distance, easeAmount);
            var newOrigin = Vector.add(this.origin, easedDistance);
            this.setOrigin(newOrigin);
        }

        for (var i = 0; i < this.blips.length; i++) {
            this.blips[i].update(offset);
        }
    }

    drawBlips() {
        for (var i = 0; i < this.blips.length; i++) {
            this.blips[i].draw();
        }
    }

    drawRectangles() {
        for (var i = 0; i < this.rectangles.length; i++) {
            this.rectangles[i].draw(this.origin);
        }
    }

    hitTest(point) {
        for (var i = 0; i < this.rectangles.length; i++) {
            if (this.rectangles[i].hitTest(this.origin, point)) {
                return true;
            }
        }
        return false;
    }

    dragStart(mousePosition) {
        this.dragging = true;
        // We will pay attention to the point on the object where the mouse is "holding" the object:
        this.dragPoint = Vector.subtract(mousePosition, this.origin);
        // Position we should be moving towards
        this.targetPosition = Vector.subtract(mousePosition, this.dragPoint);
    }

    dragMove(mousePosition) {
        //Control can move around in the middle quarter of the canvas
        var min = Vector.subtract(Vector.zero, this.min);
        var max = Vector.subtract(this.canvas.size(), this.max);

        //clamp x and y positions to prevent object from dragging outside of canvas
        var pos = Vector.subtract(mousePosition, this.dragPoint);
        pos = Vector.max(pos, min);
        pos = Vector.min(pos, max);

        this.targetPosition = pos;
    }

    dragStop() {
        this.dragging = false;
    }

    click() {
        // Toggle opacity to indicate on/off
        this.enabled = !this.enabled;
        for (var i = 0; i < this.rectangles.length; i++) {
            this.rectangles[i].enabled = this.enabled;
        }
        for (var i = 0; i < this.blips.length; i++) {
            this.blips[i].enabled = this.enabled;
        }

        // Toggle audio on/off
        if (this.audio) {
            this.audio.volume = 1.0 - this.audio.volume;
        }
    }
}