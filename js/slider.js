class Slider {
    // params should have: { simplex, alea, canvas }
    constructor(x, y, color, params) {
        this.simplex = params.simplex;
        this.alea = params.alea;
        this.canvas = params.canvas;
        this.ctx = this.canvas.getContext('2d');

        this.x = x;
        this.y = y;
        this.height = (this.alea() * 100) + 20;
        this.width = (this.alea() * 100) + 20;
        this.color = color;
        this.numAgents = (this.alea() * 300) + 200;
        this.agents = [];

        this.params = params;

        for (var i = 0; i < this.numAgents; i++) {
            this.agents.push(new Agent(color, this.params));
        }

        this.enabled = true;
    }

    get actualX() { return this.x * this.canvas.width; }
    get actualY() { return this.y * this.canvas.height; }

    update(offsetX, offsetY) {
        for (var i = 0; i < this.numAgents; i++) {
            this.agents[i].update(offsetX, offsetY);

            if (this.agents[i].ticksLeft <= 0) {
                this.agents[i] = new Agent(this.color, this.params);
            }
        }
    }

    draw() {
        for (var i = 0; i < this.numAgents; i++) {
            this.agents[i].draw();
        }

        var opacity = this.enabled ? "1" : "0.4";
        this.ctx.fillStyle = "rgba(" + this.hexToRgb(this.color) + ", " + opacity + ")";
        this.ctx.fillRect(this.actualX, this.actualY, this.width, this.height)
    }

    hitTest(x, y) {
        if (x < this.actualX) return false;
        if (x > this.actualX + this.width) return false;
        if (y < this.actualY) return false;
        if (y > this.actualY + this.height) return false;

        return true;
    }

    onClick() {
        this.enabled = !this.enabled;
    }

    hexToRgb(hex) {
        var bigint = parseInt(hex.substring(1), 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;

        return r + "," + g + "," + b;
    }
}