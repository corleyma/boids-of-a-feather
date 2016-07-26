import Box from "./box"
import Point from "./point"

export default class Quadtree {
  constructor(box, max, maxLevel, level) {
    this.box = box;
    this.children = null;
    this.value = [];
    this.max = max || 15; //maximum points allowed per node
    this.max_level = maxLevel || 10
    this.level = level || 0
  }

  insert(point, object) {
    //check if should contain point
    if (!this.box.contains(point)){
      return this;
    }

    //if is a leaf node and not full, then insert
    //need to check if it already exists though
    let i;
    if ( this.children === null &&
         ( (this.value.length < this.max) ||
           (this.level === this.maxLevel)
         )
       ){

      for( i = 0; i < this.value.length; i++ ){
        if(this.value[i].point.equals(point)){
          this.value[i].value = object;
          return;
        }
      }
      this.value.push({point, value:object});
      return this;
    }

    //if is a leaf node but full, call split
    if(this.children === null && this.level < this.maxLevel){
        this.split();
    }

    // if is not a leaf node, call insert on child nodes
    for( i = 0; i < this.children.length; i++ ){
      this.children[i].insert(point, object);
    }
    this.value = [];
    return this;
  }

  split() {
    //split into 4 congruent child quadrants using box quadrant method
    nextLevel = this.level + 1
    this.children = this.box.split();
    for(var i = 0; i < this.children.length; i++) {
      this.children[i] = new Quadtree(this.children[i],
                                      this.max,
                                      this.maxLevel,
                                      this.nextLevel);
    }
    //redistribute values to appropriate child nodes
    for(i = 0; i < this.value.length; i++){
      for(let k = 0; k < this.children.length; k++){
        this.children[k].insert(this.value[i].point, this.value[i].value);
      }
    }
  }

  queryRange(box) {
    //return all point/value pairs contained in range
    const result = [];
    this._queryRangeRec(box, result);
    return result;
  }

  _queryRangeRec(box, result) {
    //if query area doesn't overlap this box then return
    if (!this.box.overlaps(box)){
      return;
    }
    //if leaf node with contained value(s), then check against contained objects
    let i;
    if(this.value.length > 0){
      for( i = 0; i < this.value.length; i++ ){
        if(box.contains(this.value[i].point)){
          result.push(this.value[i]);
        }
      }
      return;
    }
    //if has children, then make recursive call on children
    if(this.children !== null){
      for( i = 0; i < this.children.length; i++ ){
        this.children[i]._queryRangeRec(box, result);
      }
      return;
    }
  }

  queryPoint(point) {
    //return value if point in tree
    if(!this.box.contains(point)){
      return null;
    }

    if (this.value.length > 0){
      for (var i = 0; i < this.value.length; i++){
        if (this.value[i].point.equals(point)){
         return this.value[i].value;
        }
      }
    }

    if (this.children !== null){
      let val = null;
      for(var i = 0; i < this.children.length; i++){
        val = val || this.children[i].queryPoint(point);
      }
      return val;
    }
    return null;
  }

  clear() {
    this.children = null;
    this.value = [];
  }
}
