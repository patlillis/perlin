class Agent {
    // params should have: { simplex, alea, canvas }
    constructor(color, params) {
        this.simplex = params.simplex;
        this.alea = params.alea;
        this.canvas = params.canvas;
        this.ctx = this.canvas.getContext("2d");

        this.position = new Vector(this.alea(), this.alea());

        this.speed = 0.005 * this.alea() + 0.001;
        this.resistance = this.alea();

        this.pastPositions = [this.position];

        this.color = color;
        this.lineWidth = (0.75 * this.alea()) + 0.25;
        this.maxPastPositions = 5;//Math.floor(10 * this.alea());
        this.ticksLeft = this.alea() * 1000 + 1000;
    }

    update(offset) {
        // Get the pixel the agent is over
        var pixel = this.simplex.noise2D(this.position.x + offset.x, this.position.y + offset.y);

        // Set the angle and the speed according to brightness
        var speed = pixel * this.speed;
        var angle = pixel * 360 * Math.PI / 180;

        // Update the agent's position / rotation
        this.position.x += Math.cos(angle) * speed * (1 - this.resistance);
        this.position.y += Math.sin(angle) * speed * (1 - this.resistance);
        this.rotation = pixel * 360;

        this.position.x = this.mod(this.position.x, 1.0);
        this.position.y = this.mod(this.position.y, 1.0);

        this.pastPositions.push(this.position.clone());

        if (this.pastPositions.length > this.maxPastPositions) this.pastPositions.shift();

        this.resistance += 0.05 * (this.alea() - 0.5);

        if (this.resistance < 0) this.resistance = 0.2 * this.alea();
        if (this.resistance > 1) this.resistance = 0.2 * this.alea() + 0.8;
        this.resistance = Math.min(Math.max(this.resistance, 0), 1.0);

        this.ticksLeft--;
    }

    draw() {
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

        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 0.3;
        ctx.stroke();
    }

    mod(n, m) {
        return ((n % m) + m) % m;
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