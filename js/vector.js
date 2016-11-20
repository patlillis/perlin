class Vector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    static get zero() { return new Vector(0, 0); }

    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }

    static subtract(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static average(v1, v2) {
        return new Vector((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
    }

    static min(v1, v2) {
        return new Vector(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y));
    }

    static max(v1, v2) {
        return new Vector(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y));
    }

    static scale(v, s) {
        return new Vector(v.x * s, v.y * s);
    }

    static lerp(v1, v2, t) {
        return new Vector(lerpDouble(v1.x, v2.x, t), lerpDouble(v1.y, v2.y, t));
    }

    static normalize(v) {
        var len = Math.sqrt(v.x * v.x + v.y * v.y);
        if (len == 0)
            return Vector.zero;

        return new Vector(v.x / len, v.y / len);
    }

    static eq(v1, v2) {
        if (v1 == v2) return true;
        if (!v1 || !v2) return false;
        if (v1.x === v2.x && v1.y === v2.y) return true;
        return false;
    }
}

// Alias for easier writing in presets.js
var V = Vector;