class BlipAnimator {
    // params should have: { simplex, alea, canvas }
    constructor(color, level, params) {
        this.color = color;
        this.level = level;
        this.blips = [];
        this.alea = params.alea;
        this.easing = Easing.easeInOutCubic;

        this.spawnBlip = () => new Blip(color, this.level, params);

        var numBlips = (this.alea() * 300) + 200;
        for (var i = 0; i < numBlips; i++) {
            this.blips.push(this.spawnBlip());
        }
    }

    // level should be in range [0,1].
    setLevel(level) {
        this.level = level;
        this.blips.forEach((b) => b.setLevel(level));
    }

    update(offset) {
        this.blips.forEach((b) => b.update(offset));
    }

    draw() {
        this.blips.forEach((b) => b.draw());
    }
}

class Blip {
    // params should have: { simplex, alea, canvas }
    constructor(color, level, params) {
        this.simplex = params.simplex;
        this.alea = params.alea;
        this.canvas = params.canvas;
        this.ctx = this.canvas.getContext("2d");

        this.position = new Vector(this.alea(), this.alea());

        this.speed = 0.005 * this.alea() + 0.001;
        this.resistance = this.alea();

        this.pastPositions = [this.position];

        this.color = color;
        this.lineWidth = 0.5 * this.alea() + 0.25;
        this.maxPastPositions = Math.floor(10 * this.alea());
        this.level = level;

        this.pulsePeriod = 5 * this.alea() + 1;
        this.pulseAmplitude = 0.5 * this.alea() + 0.5;
    }

    calculateOpacity() {
        var ms = new Date().getTime() / 800;
        var sin = Math.sin((ms) * this.pulsePeriod);
        // Scale to between 0 and 1.
        var opacity = (sin * 0.5) + 0.5;
        // Scale to between (1 - amplitude) and 1.
        return (opacity * this.pulseAmplitude) + (1 - this.pulseAmplitude);
    }

    setLevel(l) {
        this.level = l;
    }

    update(offset) {
        // Get the pixel the blip is over
        var pixel = this.simplex.noise2D(this.position.x + offset.x, this.position.y + offset.y);

        // Set the angle and the speed according to brightness
        var speed = pixel * this.speed * lerp(0.25, 2, this.level, this.easing);
        var angle = pixel * 360 * Math.PI / 180;

        // Update the blip's position / rotation
        this.position.x += Math.cos(angle) * speed * (1 - this.resistance);
        this.position.y += Math.sin(angle) * speed * (1 - this.resistance);
        this.rotation = pixel * 360;

        this.position.x = mod(this.position.x, 1.0);
        this.position.y = mod(this.position.y, 1.0);

        this.pastPositions.push(this.position.clone());

        if (this.pastPositions.length > this.maxPastPositions) this.pastPositions.shift();

        this.resistance += 0.05 * (this.alea() - 0.5);

        if (this.resistance < 0) this.resistance = 0.2 * this.alea();
        if (this.resistance > 1) this.resistance = 0.2 * this.alea() + 0.8;
        this.resistance = Math.min(Math.max(this.resistance, 0), 1.0);
    }

    draw() {
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = lerp(0, 3, this.level, this.easing);
        this.ctx.lineCap = "round";

        this.ctx.beginPath();

        var pastPosition = this.pastPositions[0];

        this.ctx.moveTo(pastPosition.x * this.canvas.width, pastPosition.y * this.canvas.height);

        for (var i = 1; i < this.pastPositions.length; i++) {
            var newPosition = this.pastPositions[i];

            if (this.checkPoints(pastPosition, newPosition)) {
                this.ctx.lineTo(newPosition.x * this.canvas.width, newPosition.y * this.canvas.height);
            }
            else {
                this.ctx.stroke();
                this.ctx.moveTo(newPosition.x * this.canvas.width, newPosition.y * this.canvas.height);
            }

            pastPosition = newPosition;
        }

        ctx.stroke();
    }

    // Make sure that a line from a to b didn't cross the screen boundary.
    checkPoints(a, b) {
        if (a.x < 0.2 && b.x > 0.8) return false;
        if (b.x < 0.2 && a.x > 0.8) return false;
        if (a.y < 0.2 && b.y > 0.8) return false;
        if (b.y < 0.2 && a.y > 0.8) return false;
        return true;
    }
}