class LaserAnimator {
    // params should have: { simplex, alea, canvas }
    constructor(color, level, params) {
        this.color = color;
        this.level = level;
        this.lasers = [];
        this.alea = params.alea;

        this.spawnLaser = (l) => new Laser(color, l, params);

        var numLasers = 30;//(this.alea() * 300) + 200;
        for (var i = 0; i < numLasers; i++) {
            this.lasers.push(this.spawnLaser(this.level));
        }
    }

    // level should be in range [0,1].
    setLevel(level) {
        this.level = level;
        this.lasers.forEach((l) => l.setLevel(level));
    }

    update(offset) {
        for (var i = 0; i < this.lasers.length; i++) {
            this.lasers[i].update(offset);

            // If that update took the laser offscreen, respawn a new one at the top.
            if (this.lasers[i].isFinished) {
                this.lasers[i] = this.spawnLaser(this.level);
            }
        }
    }

    draw() {
        this.lasers.forEach((l) => l.draw());
    }
}

// Really just a laser particle.
class Laser {
    // params should have: { simplex, alea, canvas }
    constructor(color, level, params) {
        this.color = color;
        this.level = level;
        this.easing = Easing.easeInOutCubic;

        this.simplex = params.simplex;
        this.alea = params.alea;
        this.canvas = params.canvas;
        this.ctx = this.canvas.getContext("2d");

        // These are pixel offsets from halfway across the screen.
        var xMin = -200;
        var xMax = 200;
        var xWidth = xMax - xMin;
        // Height is in percentage of screen height.
        this.heightPercentage = 0.3;
        this.xPositionOffset = lerp(xMin, xMin + xWidth, this.alea());
        this.yPositionPercentage = lerp(-5.3, -0.3, this.alea())
        this.yPositonIncrease = lerp(0.015, 0.02, this.alea());
    }

    // Width is based on the current level.
    get width() {
        return lerp(0, 3, this.level, this.easing);
    }

    get xPosition() {
        return (this.canvas.width / 2) + this.xPositionOffset;
    }

    get yPosition() {
        return this.canvas.height * this.yPositionPercentage;
    }

    get height() {
        return this.canvas.height * this.heightPercentage;
    }

    get isFinished() {
        return this.yPositionPercentage > 1.0;
    }

    setLevel(l) {
        this.level = l;
    }

    update(offset) {
        var inc = lerp(this.yPositonIncrease / 5, this.yPositonIncrease, this.level, this.easing);
        this.yPositionPercentage += inc;
    }

    draw() {
        // Pretty much just a single rectangle.
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.xPosition, this.yPosition, this.width, this.height);
    }
}