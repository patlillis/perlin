class ScreenAnimator {
    // params should have: { simplex, alea, canvas }
    constructor(color, level, params) {
        this.color = color;
        this.level = level;
        this.alea = params.alea;
        this.canvas = params.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.easing = Easing.easeInOutQuad;
    }

    // level should be in range [0,1].
    setLevel(level) {
        this.level = level;
    }

    update(offset) {
        // Unused
    }

    draw() {
        var angle = lerp((3 * Math.PI / 4), (Math.PI / 2) + (3 * Math.PI / 4), this.level, this.easing);

        // Rotate
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate(angle);
        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);

        // Draw composite to change all other particle colors
        this.ctx.globalCompositeOperation = 'source-atop';
        this.ctx.fillStyle = this.color;
        this.drawRect();

        // Draw actual rectangle in a much lighter shade
        this.ctx.globalCompositeOperation = 'source-over';
        // this.ctx.fillStyle = 'rgba(' + hexToRgb(this.color) + ',' + (this.easing(this.level) * 1.00) + ')';
        // this.drawRect();

        // Unrotate
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate(-angle);
        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
    }

    drawRect() {
        var rectHeight = lerp(0, this.level * this.canvas.height / 4, this.level, this.easing);

        // Rect 1 position scales from (canvas.height / 2 - 20) to (0)
        var rect1Start = lerp(this.canvas.height / 2, this.canvas.height * 1 / 8, this.level, this.easing);

        // Rect 2 position scales from canvas.height / 2 + 20 to (canvas.height * 2 / 3)
        var rect2Start = lerp(this.canvas.height / 2, this.canvas.height * 5 / 8, this.level, this.easing);

        // Draw rect 1
        this.ctx.fillRect(-this.canvas.width * 2, rect1Start, 4 * this.canvas.width, rectHeight);

        // Draw rect 2
        this.ctx.fillRect(-this.canvas.width * 2, rect2Start, 4 * this.canvas.width, rectHeight);
    }
}