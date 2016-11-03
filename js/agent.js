class Agent {
    constructor(simplex, alea, canvas) {
        this.simplex = simplex;
        this.alea = alea;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        this.x = this.alea();
        this.y = this.alea();

        this.speed = 0.01 * this.alea();
        this.resistance = this.alea();

        this.pastX = [];
        this.pastY = [];
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

        this.x = Agent.mod(this.x, 1.0);
        this.y = Agent.mod(this.y, 1.0);

        this.pastX.push(this.x);
        this.pastY.push(this.y);

        if (this.pastX.length > 10) this.pastX.shift();
        if (this.pastY.length > 10) this.pastY.shift();

        this.resistance += this.alea();
        this.resistance = Agent.mod(this.resistance, 1.0);
    }

    draw() {
        for (var i = 0; i < this.pastX.length; i++) {
            var adjustedX = this.pastX[i] * this.canvas.width;
            var adjustedY = this.pastY[i] * this.canvas.height;

            this.ctx.fillRect(adjustedX,adjustedY,3,3);
        }
    }

    static mod(n, m) {
        return ((n % m) + m) % m;
    }
}