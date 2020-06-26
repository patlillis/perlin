class Slider {
    // position is percentage of total canvas size, params should have: { simplex, alea, canvas }
    constructor(animator, color, bgColor, audioUrl, position0, position1, startPosition, params) {
        // this.animator = animator;
        this.alea = params.alea;
        this.position0 = position0;
        this.position1 = position1;
        // Parametric position in range [0,1] from position0 to position1.
        this.positionParameter = startPosition;
        this.color = color;
        this.bgColor = bgColor;
        this.rectangles = [];
        this.canvas = params.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.easeAmount = 0.1;

        // For bob & sway
        this.swaySpeed = lerp(0.001, 0.005, this.alea());
        this.swayDirection = this.alea < 0.5 ? +1 : -1;
        this.swayOffset = this.alea();
        this.swayMax = 15;
        this.swayClamp = 8;

        // For showing the arrows in/out.
        this.isHovering = false;
        this.arrowAlpha = 0;

        this.animator = new animator(this.color, this.positionParameter, params);

        // Tracks the total encompasing size of all rectangles. These are relative positions from the slider's origin.
        this.min = new Vector(Infinity, Infinity);
        this.max = new Vector(-Infinity, -Infinity);
        this.mid = Vector.zero;

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

    toggleMuted() {
        this.audio.muted = !this.audio.muted;
    }   

    addRectangle(r) {
        this.rectangles.push(r);
        this.min = Vector.min(this.min, r.position);
        this.max = Vector.max(this.max, Vector.add(r.position, r.size));
        this.mid = Vector.average(this.min, this.max);
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

    // Angle (in radians) from position0Screen to position1Screen
    get position0To1ScreenAngle() {
        var dx = this.position1Screen.x - this.position0Screen.x;
        var dy = this.position0Screen.y - this.position1Screen.y;
        var thetaRadians = Math.atan2(dy, dx);

        return thetaRadians;
    }

    // A vector from position0Screen to position1Screen
    get position0To1Screen() {
        return Vector.subtract(this.position1Screen, this.position0Screen);
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

        // Update effect animator
        this.animator.update(offset);

        // Update arrow alpha, for hovering over sliders
        var arrowAlphaInc = 0.08;
        var newArrowAlpha = this.arrowAlpha;
        if (this.isHovering || this.dragging) {
            newArrowAlpha += arrowAlphaInc;
        }
        else {
            newArrowAlpha -= arrowAlphaInc;
        }
        this.arrowAlpha = clamp(newArrowAlpha, 0.0, 1.0);

        // Update bob & sway
        this.swayOffset += this.swayDirection * this.swaySpeed;
        if (this.swayOffset >= 1 || this.swayOffset <= 0) {
            this.swayDirection = -this.swayDirection;
        }
        this.swayOffset = clamp(this.swayOffset, 0, 1);
    }

    drawAnimator() {
        this.animator.draw();
    }

    drawRectangles() {
        var swayOffset = lerp(-this.swayClamp, this.swayClamp, this.swayOffset, Easing.easeInOutCubic);
        this.rectangles.forEach((r) => r.draw(Vector.add(this.origin, new Vector(0, swayOffset))));
    }

    drawArrows() {
        this.ctx.globalAlpha = this.arrowAlpha;
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = this.bgColor;
        this.ctx.lineWidth = 2;

        // Draw up arrow.
        var arrowDistance = (15 * this.arrowAlpha) + 70;

        // Towards 1
        this.ctx.globalAlpha = this.arrowAlpha;
        if (this.positionParameter >= 0.95) {
            this.ctx.globalAlpha = 0.2 * this.arrowAlpha;
        }
        var forwardAngle = this.position0To1ScreenAngle;
        var forwardOffsetX = Math.cos(forwardAngle) * arrowDistance;
        var forwardOffsetY = -Math.sin(forwardAngle) * arrowDistance;
        this.drawArrow(Vector.add(this.mid, new Vector(forwardOffsetX, forwardOffsetY)), forwardAngle);

        // Towards 0
        this.ctx.globalAlpha = this.arrowAlpha;
        if (this.positionParameter <= 0.05) {
            this.ctx.globalAlpha = 0.2 * this.arrowAlpha;
        }
        var backwardAngle = Math.PI + forwardAngle;
        var backwardOffsetX = -Math.cos(backwardAngle) * arrowDistance;
        var backwardOffsetY = Math.sin(backwardAngle) * arrowDistance;
        this.drawArrow(Vector.subtract(this.mid, new Vector(backwardOffsetX, backwardOffsetY)), backwardAngle);

        // Reset alpha
        this.ctx.globalAlpha = 1.0;
    }

    // Offset is a Vector (pixels), angle is in radians.
    // Angle of 0 means draw it pointing to the right.
    drawArrow(offset, arrowAngle) {
        var arrowLength = 20;
        var arrowWidth = 6;
        var arrowInnerWidth = arrowLength - arrowWidth;
        var arrowOrigin = Vector.add(this.origin, offset);

        // The angle of the main arrow bend
        var theta = (Math.PI / 4);
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        // The angle of the outer corners
        var angle = (Math.PI / 4);
        var sinAngle = Math.sin(angle);
        var cosAngle = Math.cos(angle);

        this.ctx.translate(arrowOrigin.x, arrowOrigin.y);
        this.ctx.rotate(-arrowAngle + 1 * (Math.PI / 2));

        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);

        var x = -(arrowLength * sinTheta);
        var y = (arrowLength * cosTheta);
        this.ctx.lineTo(x, y);

        x += arrowWidth * sinAngle;
        y += arrowWidth * cosAngle;
        this.ctx.lineTo(x, y);

        x += arrowInnerWidth * sinTheta;
        y -= arrowInnerWidth * cosTheta;
        this.ctx.lineTo(x, y);

        x += arrowInnerWidth * sinTheta;
        y += arrowInnerWidth * cosTheta;
        this.ctx.lineTo(x, y);

        x += arrowWidth * sinAngle;
        y -= arrowWidth * cosAngle;
        this.ctx.lineTo(x, y);

        this.ctx.closePath();

        this.ctx.fill();
        this.ctx.stroke();
        // reset current transformation matrix to the identity matrix
        this.ctx.rotate(arrowAngle - 1 * (Math.PI / 2));
        this.ctx.translate(-arrowOrigin.x, -arrowOrigin.y);
    }

    hitTest(point) {
        return this.rectangles.some((r) => r.hitTest(this.origin, point));
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
        this.animator.setLevel(l);
        // Toggle audio on/off
        if (this.audio) {
            this.audio.volume = l;
        }
    }

    // Returns the parametric value t, where t is in [0, 1] such that
    // the closest point between this.offPosition and this.onPosition
    // to p is the lerp at t.
    getClosestPoint(p) {
        var position0ToP = Vector.subtract(p, this.position0Screen);
        var dot = Vector.dotProduct(position0ToP, this.position0To1Screen);
        var t = dot / this.position0To1Screen.magnitude;

        // Make sure we're within bounds.
        return clamp(t, 0, 1);
    }
}