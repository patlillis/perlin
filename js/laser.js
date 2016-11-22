class LaserAnimator {
    // params should have: { simplex, alea, canvas }
    constructor(color, level, params) {
        this.color = color;
        this.level = level;
        this.lasers = [];
        this.alea = params.alea;

        this.spawnLaser = () => new Laser(color, this.level, params);

        var numLasers = 30;//(this.alea() * 300) + 200;
        for (var i = 0; i < numLasers; i++) {
            this.lasers.push(this.spawnLaser());
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
                this.lasers[i] = this.spawnLaser();
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
        this.xPositionOffset = (this.alea() * xWidth) + xMin;
        this.yPositionPercentage = -((this.alea() * 5) + 0.3);
        this.yPositonIncrease = (this.alea() * 0.015) + 0.015;
    }

    // Width is based on the current level.
    get width() {
        return this.level * 3;
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
        this.yPositionPercentage += this.yPositonIncrease;
    }

    draw() {
        // Pretty much just a single rectangle.
        if (this.level > 0.0) {
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(this.xPosition, this.yPosition, this.width, this.height);
        }
    }
}