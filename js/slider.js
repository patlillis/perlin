class Slider {
    // position is percentage of total canvas size, params should have: { simplex, alea, canvas }
    constructor(color, position, params) {
        this.alea = params.alea;
        this.position = position;
        this.color = color;
        this.agents = [];
        this.rectangles = [];
        this.enabled = true;
        this.canvas = params.canvas;

        this.spawnAgent = () => new Agent(color, params);

        var numAgents = (this.alea() * 300) + 200;
        for (var i = 0; i < numAgents; i++) {
            this.agents.push(this.spawnAgent());
        }

        // Tracks the total encompasing size of all rectangles. These are relative positions from the slider's origin.
        this.min = new Vector(Infinity, Infinity);
        this.max = new Vector(-Infinity, -Infinity);
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
        for (var i = 0; i < this.agents.length; i++) {
            this.agents[i].update(offset);

            if (this.agents[i].ticksLeft <= 0) {
                this.agents[i] = this.spawnAgent();
            }
        }
    }

    drawAgents() {
        for (var i = 0; i < this.agents.length; i++) {
            this.agents[i].draw();
        }
    }

    drawRectangles() {
        for (var i = 0; i < this.rectangles.length; i++) {
            this.rectangles[i].draw(this.origin);
        }
    }

    hitTest(point) {
        for (var i = 0; i < this.rectangles.length; i++) {
            if (this.rectangles[i].hitTest(this.origin, point)) return true;
        }

        return false;
    }

    onClick() {
        this.enabled = !this.enabled;

        for (var i = 0; i < this.rectangles.length; i++) {
            this.rectangles[i].enabled = this.enabled;
        }
    }
}