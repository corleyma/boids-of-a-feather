
export default class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  lte(point) {
    if(this.x <= point.x && this.y <= point.y){
      return true;
    }
    return false;
  }

  gte(point) {
    if (this.x >= point.x && this.y >= point.y){
      return true;
    }
    return false;
  }

  equals(point) {
    return (this.x === point.x  && this.y === point.y);
  }
}
