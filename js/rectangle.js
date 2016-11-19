class Rectangle {
    constructor(position, size, color, bgColor, canvas) {
        this.position = position;
        this.size = size;
        this.color = color;
        this.bgColor = bgColor;
        this.canvas = canvas;
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
        }
        this.enabled = false;
    }

    hitTest(origin, point) {
        if (point.x < (this.position.x + origin.x)) return false;
        if (point.x > (this.position.x + origin.x + this.size.x)) return false;
        if (point.y < (this.position.y + origin.y)) return false;
        if (point.y > (this.position.y + origin.y + this.size.y)) return false;

        return true;
    }

    draw(origin) {
        var opacity = this.enabled ? "1" : "0.4";
        this.ctx.fillStyle = "rgba(" + hexToRgb(this.color) + ", " + opacity + ")";
        this.ctx.clearRect(this.position.x + origin.x, this.position.y + origin.y, this.size.x, this.size.y);
        this.ctx.fillRect(this.position.x + origin.x, this.position.y + origin.y, this.size.x, this.size.y);
        this.ctx.strokeStyle = this.bgColor;
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(this.position.x + origin.x, this.position.y + origin.y, this.size.x, this.size.y);
    }
}