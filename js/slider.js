class Slider {
    // position is percentage of total canvas size, params should have: { simplex, alea, canvas }
    constructor(color, audioUrl, position0, position1, startPosition, params) {
        this.alea = params.alea;
        this.position0 = position0;
        this.position1 = position1;
        // Parametric position in range [0,1] from position0 to position1.
        this.positionParameter = startPosition;
        this.color = color;
        this.blips = [];
        this.rectangles = [];
        this.level = false;
        this.canvas = params.canvas;
        this.easeAmount = 0.08;

        this.spawnBlip = () => new Blip(color, this.positionParameter, params);

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
            audioEl.volume = this.positionParameter;
            audioEl.play();
            this.audio = audioEl;
        }
    }

    addRectangle(r) {
        this.rectangles.push(r);
        this.min = Vector.min(this.min, r.position);
        this.max = Vector.max(this.max, Vector.add(r.position, r.size));
    }

    percentageToScreenPos(p) {
        return new Vector(this.canvas.width * p.x, this.canvas.height * p.y);
    }

    // In screen coordinates.
    get origin() {
        return this.percentageToScreenPos(this.position);
    }

    // In percentage.
    get position() {
        return Vector.lerp(this.position0, this.position1, this.positionParameter);
    }

    get position0Screen() { return this.percentageToScreenPos(this.position0); }
    get position1Screen() { return this.percentageToScreenPos(this.position1); }

    update(offset) {
        // Update position, if dragging.

        if (this.dragging) {
            var targetPar = this.getClosestPoint(this.targetPosition);
            var distance = targetPar - this.positionParameter;
            var easedDistance = distance * this.easeAmount;
            var newPar = this.positionParameter + easedDistance;
            this.positionParameter = newPar;
            this.setLevel(this.positionParameter);
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

    // l should be in range [0,1].
    setLevel(l) {
        // for (var i = 0; i < this.rectangles.length; i++) {
        //     this.rectangles[i].setLevel(l);
        // }
        for (var i = 0; i < this.blips.length; i++) {
            this.blips[i].setLevel(l);
        }

        // Toggle audio on/off
        if (this.audio) {
            this.audio.volume = l;
        }
    }

    click() {
        // Toggle opacity to indicate on/off
        // this.enabled = !this.enabled;
        // for (var i = 0; i < this.rectangles.length; i++) {
        //     this.rectangles[i].enabled = this.enabled;
        // }
        // for (var i = 0; i < this.blips.length; i++) {
        //     this.blips[i].enabled = this.enabled;
        // }

        // // Toggle audio on/off
        // if (this.audio) {
        //     this.audio.volume = 1.0 - this.audio.volume;
        // }
    }
    
    // Returns the parametric value t, where t is in [0, 1] such that
    // the closest point between this.offPosition and this.onPosition
    // to p is the lerp at t.
    getClosestPoint(p) {
        var aToP = Vector.subtract(p, this.position0Screen);
        var aToB = Vector.subtract(this.position1Screen, this.position0Screen);
        var dot = Vector.dotProduct(aToP, aToB);
        var t = dot / aToB.magnitude;

        // Make sure we're within bounds.
        return clamp(t, 0, 1);
    }
}