class Agent {
    // params should have: { simplex, alea, canvas }
    constructor(color, params) {
        this.simplex = params.simplex;
        this.alea = params.alea;
        this.canvas = params.canvas;
        this.ctx = this.canvas.getContext("2d");

        this.x = this.alea();
        this.y = this.alea();

        this.speed = 0.005 * this.alea() + 0.001;
        this.resistance = this.alea();

        this.pastX = [];
        this.pastY = [];

        this.color = color;
        this.lineWidth = Math.floor(2 * this.alea());
        this.pastSegments = 5;//Math.floor(10 * this.alea());
        this.ticksLeft = this.alea() * 1000 + 1000;
    }

    update(offsetX, offsetY) {
        // Get the pixel the agent is over
        var pixel = this.simplex.noise2D(this.x + offsetX, this.y + offsetY);

        // Set the angle and the speed according to brightness
        var speed = pixel * this.speed;
        var angle = pixel * 360 * Math.PI / 180;

        // Update the agent's position / rotation
        this.x += Math.cos(angle) * speed * (1 - this.resistance);
        this.y += Math.sin(angle) * speed * (1 - this.resistance);
        this.rotation = pixel * 360;

        this.x = this.mod(this.x, 1.0);
        this.y = this.mod(this.y, 1.0);

        this.pastX.push(this.x);
        this.pastY.push(this.y);

        if (this.pastX.length > this.pastSegments) this.pastX.shift();
        if (this.pastY.length > this.pastSegments) this.pastY.shift();

        this.resistance += 0.05 * (this.alea() - 0.5);

        if (this.resistance < 0) this.resistance = 0.2 * this.alea();
        if (this.resistance > 1) this.resistance = 0.2 * this.alea() + 0.8;
        this.resistance = Math.min(Math.max(this.resistance, 0), 1.0);

        this.ticksLeft--;
    }

    draw() {
        ctx.beginPath();

        var x = this.pastX[0];
        var y = this.pastY[0];

        ctx.moveTo(x * this.canvas.width, y * this.canvas.height);

        for (var i = 1; i < this.pastSegments; i++) {
            var newX = this.pastX[i];
            var newY = this.pastY[i];

            if (this.checkLine(x, newX) && this.checkLine(y, newY)) {
                ctx.lineTo(newX * this.canvas.width, newY * this.canvas.height);
            }
            else {
                ctx.stroke();
                ctx.moveTo(newX * this.canvas.width, newY * this.canvas.height);
            }

            x = newX;
            y = newY;
        }

        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    }

    mod(n, m) {
        return ((n % m) + m) % m;
    }

    // Make sure that a line from a to b didn't cross the screen boundary.
    checkLine(a, b) {
        if (a < 0.2 && b > 0.8) return false;
        if (b < 0.2 && a > 0.8) return false;
        return true;
    }
}