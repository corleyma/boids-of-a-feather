import Point from "./point"

export default class Box {
  constructor(least, greatest) {
    this.low = least;
    this.high = greatest;
  }

  contains(point) {
    if(this.low.lte(point) && this.high.gte(point)){
      return true;
    }
    return false;
  }

  overlaps(box) {
    //if this contains either point of box, then there is an overlap
    if(this.contains(box.low) || this.contains(box.high) ||
       box.contains(this.low) || box.contains(this.high)){
        return true;
    }
    return false;
  }

  split() {
    const result = [];
    result.push(new Box(this.low, new Point((this.low.x+this.high.x)/2, (this.low.y+this.high.y)/2)));
    result.push(new Box(new Point((this.low.x+this.high.x)/2, this.low.y),
                new Point(this.high.x, (this.low.y+this.high.y)/2)));
    result.push(new Box(new Point((this.low.x+this.high.x)/2, (this.low.y+this.high.y)/2), this.high));
    result.push(new Box(new Point(this.low.x, (this.low.y+this.high.y)/2),
                new Point((this.low.x+this.high.x)/2, this.high.y)));
    return result;
  }
}
