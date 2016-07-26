import Vector from './vector'
import Box from './box'
import Point from './point'

export default class Boid {
  constructor(opts) {
    this.opts = opts;
    this.position           = opts.position           || new Vector(0,0);
    this.velocity           = opts.velocity           || new Vector(0,0);
    this.acceleration       = opts.acceleration       || new Vector(0,0);
    this.velocityLimit      = opts.velocityLimit      || 2.5;
    this.accelerationLimit  = opts.accelerationLimit  || .5;

    //forces
    this.cohesionAOE        = this.opts.cohesionAOE   ||  20
    this.separationAOE      = this.opts.separationAOE ||  8
    this.alignmentAOE       = this.opts.cohesionAOE   ||  20

    this.cohesionStrength   = opts.cohesionStrength   || 1
    this.separationStrength = opts.separationStrength || 30
    this.alignmentStrength  = opts.alignmentStrength  || 15
    this.boundaryStrength   = opts.boundaryStrength   || 50

    this.nextAcceleration   = new Vector(0, 0);


  }

  update() {
    this.updatePosition();
    this.updateVelocity();
    this.updateAcceleration();
  }

  updateVelocity() {
    this.velocity = this.velocity.add(this.acceleration);
    if(this.velocity.magnitude() > this.velocityLimit){
      this.velocity = this.velocity.unitVector(this.velocityLimit);
    }
  }

  updatePosition() {
    this.position = this.position.add(this.velocity);
  }

  updateAcceleration() {
    this.acceleration = this.nextAcceleration;
    if(this.acceleration.magnitude() > this.accelerationLimit){
      this.acceleration = this.acceleration.unitVector(this.accelerationLimit);
    }
  }

  calculateNextAcceleration(quadtree) {
    let resultVector = new Vector(0, 0);
    this.cohesionAOE = this.opts.cohesionAOE
    const neighbors = this.getNeighbors(this.cohesionAOE,
                                        this.position,
                                        quadtree);

    const cohesionForce = this.calculateCohesionForce(neighbors)
                              .multiplyScalar(this.cohesionStrength);

    const alignmentForce = this.calculateAlignmentForce(neighbors)
                               .multiplyScalar(this.alignmentStrength);

    const separationForce = this.calculateSeparationForce(quadtree)
                                .multiplyScalar(this.separationStrength);

    const boundaryAvoidanceForce = this.boundaryAvoidance()
                                       .multiplyScalar(this.boundaryStrength)

    resultVector = resultVector.add(cohesionForce)
    resultVector = resultVector.add(alignmentForce)
    resultVector = resultVector.add(separationForce)
    resultVector = resultVector.add(boundaryAvoidanceForce)


    this.nextAcceleration = this.acceleration.add(resultVector);

    if (this.nextAcceleration.magnitude() > this.accelerationLimit){
      this.nextAcceleration.unitVector(this.accelerationLimit);
    }
  }


  getNeighbors(aoe, position, quadtree){

    const aoeRange = new Box(new Point(position.x-aoe, position.y-aoe),
                         new Point(position.x+aoe, position.y+aoe));
    let neighbors = quadtree.queryRange(aoeRange);


    //get all boids within AoE
    // const aoeBounds = new BoxPoint(position.x, position.y, aoe.width, aoe.height);
    // const neighbors = quadtree.retrieve(aoeBounds);

    neighbors = neighbors.slice(0,20)
                         .map( (neighbor)=>{
                           return neighbor.value;
                         });

    return neighbors;

  }

  calculateCohesionForce(neighbors){
    //
    // const neighbors = this.getNeighbors(this.cohesionAOE,
    //                                     this.position,
    //                                     quadtree)

    let result = new Vector(0, 0);

    if(neighbors.length === 0){ return result; }

    for (let i = 0; i < neighbors.length; i++) {
      result = result.add(neighbors[i].position);
    }

    //average
    result.multiplyScalar(1/neighbors.length);

    //subtract current position from center of mass
    result = result.sub(this.position);
    return result;
  }

  calculateAlignmentForce(neighbors){
    //
    // const neighbors = this.getNeighbors(this.alignmentAOE,
    //                                     this.position,
    //                                     quadtree)

    let result = new Vector(0, 0);
    if( (neighbors.length === 0) || (neighbors === undefined) )
    { return result; }

    for (let i = 0; i < neighbors.length; i++) {
      result = result.add(neighbors[i].velocity);
    }
    result.multiplyScalar(1/neighbors.length);  //avg neighbor orientation
    return result;

  }

  calculateSeparationForce(quadtree){
    this.separationAOE = this.opts.separationAOE;
    const neighbors = this.getNeighbors(this.separationAOE,
                                        this.position,
                                        quadtree)
    let result = new Vector(0, 0);
    if(neighbors.length === 0 || neighbors === undefined){ return result; }

    //determine the repulsion vector and add to final result
    for (let i = 0; i < neighbors.length; i++) {
      result = result.add(this.position.sub(neighbors[i].position));
    }

    //get average
    result.multiplyScalar(1/neighbors.length);
    return result;
  }

  boundaryAvoidance(){
    const bounds =  [50, 50, window.innerHeight-130, window.innerWidth-100];
    let result = new Vector(0, 0);

    if (this.position.x < bounds[1]) {
      result.x = bounds[1]-this.position.x;
    } else if (this.position.x > bounds[3]) {
      result.x = bounds[3]-this.position.x;
    }

    if (this.position.y < bounds[0]) {
      result.y = bounds[0]-this.position.y;
    } else if (this.position.y > bounds[2]) {
      result.y = bounds[2]-this.position.y;
    }

    return result;
  }

};
