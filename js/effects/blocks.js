class BlocksAnimator {
    // params should have: { simplex, alea, canvas, sliders }
    constructor(color, level, params) {
        this.color = color;
        this.level = level;
        this.alea = params.alea;
        this.canvas = params.canvas;
        this.sliders = params.sliders;
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
        // Draw composite to change all other particle colors
        this.ctx.globalCompositeOperation = options.blendMode;
        this.ctx.fillStyle = 'rgba(255,255,255,' + this.easing(this.level) + ')';
        this.ctx.fillRect(this.canvas.width / 4, this.canvas.height / 4, this.canvas.width / 2, this.canvas.height / 2);

        // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw actual rectangle in a much lighter shade
        this.ctx.globalCompositeOperation = 'source-over';
    }
}