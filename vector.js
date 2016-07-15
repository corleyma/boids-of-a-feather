

class Vector {
  constructor(x, y) {
    this.x = x || 0;
    this.y  = y  || 0;
  }

  add(v2) {
    let x = this.x;
    let y = this.y;
    for (let i = 0; i < arguments.length; i++){
      x += arguments[i].x;
      y += arguments[i].y;
    }
    return new Vector(x, y);
  }

  sub(v2) {
    let x = this.x;
    let y = this.y;
    for (let i = 0; i < arguments.length; i++){
      x -= arguments[i].x;
      y -= arguments[i].y;
    }
    return new Vector(x, y);
  }

  distance(v2) {
    return Math.sqrt(Math.pow((this.x-v2.x), 2) + Math.pow((this.y-v2.y), 2));
  }

  multiplyScalar(val) {
    this.x *= val;
    this.y  *= val;
    return this;
  }

  magnitude() {
    return this.distance(this.origin);
  }

  unitVector(limit=1) {
    const m = this.magnitude() || 1;
    return new Vector(this.x*limit/m, this.y*limit/m);
  }
}

Vector.prototype.origin = new Vector(0, 0);

export default Vector;
