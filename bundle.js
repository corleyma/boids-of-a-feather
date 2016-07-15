/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _vector = __webpack_require__(1);
	
	var _vector2 = _interopRequireDefault(_vector);
	
	var _boid = __webpack_require__(2);
	
	var _boid2 = _interopRequireDefault(_boid);
	
	var _flock = __webpack_require__(4);
	
	var _flock2 = _interopRequireDefault(_flock);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	document.addEventListener("DOMContentLoaded", function () {
	  var opts = {
	    position: new _vector2.default(300, 300), //default position
	    velocity: new _vector2.default(1, 1), //default starting velocity
	    cohesionAOE: 25,
	    separationAOE: 8
	  };
	
	  var cohSlider = document.getElementById("cohesion-alignment-area");
	
	  cohSlider.addEventListener("change", function (e) {
	    opts.cohesionAOE = parseInt(e.target.value);
	  });
	
	  var sepSlider = document.getElementById("sepArea");
	
	  sepSlider.addEventListener("change", function (e) {
	    console.log(e.target.value);
	    opts.separationAOE = parseInt(e.target.value);
	    window.changed = true;
	  });
	
	  var population = [];
	  var size = 800;
	  while (size--) {
	    opts.position = new _vector2.default(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
	    opts.velocity = new _vector2.default((Math.random() - .5) * 1, (Math.random() - .5) * 1);
	    population.push(new _boid2.default(opts));
	  }
	
	  window.flock = new _flock2.default(population, 0, 0, window.innerWidth, window.innerHeight);
	
	  //setup our visualization of the simulation
	  var canvas = document.getElementById('flockCanvas');
	  canvas.width = window.innerWidth - 30;
	  canvas.height = window.innerHeight - 120;
	  var context = canvas.getContext('2d');
	  // context.fillRect(0, 0, canvas.width, canvas.height);
	  context.fillStyle = 'rgba(0,0,0,1)';
	  context.fillRect(0, 0, canvas.width, canvas.height);
	
	  function animate() {
	    context.fillStyle = 'rgba(0,0,0,0.15)';
	    context.fillRect(0, 0, canvas.width, canvas.height);
	    window.flock.forEach(function (boid) {
	      var centerX = boid.position.x;
	      var centerY = boid.position.y;
	      var colorMap = ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"];
	
	      var colorId = ~~((boid.velocity.x + boid.velocity.y) / 2 * (9 / 2));
	      context.beginPath();
	
	      context.fillStyle = colorMap[colorId];
	      context.fillRect(centerX, centerY, 3, 3);
	    });
	    window.flock.tick();
	    window.requestAnimationFrame(animate);
	  }
	
	  animate();
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Vector = function () {
	  function Vector(x, y) {
	    _classCallCheck(this, Vector);
	
	    this.x = x || 0;
	    this.y = y || 0;
	  }
	
	  _createClass(Vector, [{
	    key: "add",
	    value: function add(v2) {
	      var x = this.x;
	      var y = this.y;
	      for (var i = 0; i < arguments.length; i++) {
	        x += arguments[i].x;
	        y += arguments[i].y;
	      }
	      return new Vector(x, y);
	    }
	  }, {
	    key: "sub",
	    value: function sub(v2) {
	      var x = this.x;
	      var y = this.y;
	      for (var i = 0; i < arguments.length; i++) {
	        x -= arguments[i].x;
	        y -= arguments[i].y;
	      }
	      return new Vector(x, y);
	    }
	  }, {
	    key: "distance",
	    value: function distance(v2) {
	      return Math.sqrt(Math.pow(this.x - v2.x, 2) + Math.pow(this.y - v2.y, 2));
	    }
	  }, {
	    key: "multiplyScalar",
	    value: function multiplyScalar(val) {
	      this.x *= val;
	      this.y *= val;
	      return this;
	    }
	  }, {
	    key: "magnitude",
	    value: function magnitude() {
	      return this.distance(this.origin);
	    }
	  }, {
	    key: "unitVector",
	    value: function unitVector() {
	      var limit = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
	
	      var m = this.magnitude() || 1;
	      return new Vector(this.x * limit / m, this.y * limit / m);
	    }
	  }]);
	
	  return Vector;
	}();
	
	Vector.prototype.origin = new Vector(0, 0);
	
	exports.default = Vector;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _vector = __webpack_require__(1);
	
	var _vector2 = _interopRequireDefault(_vector);
	
	var _box = __webpack_require__(6);
	
	var _box2 = _interopRequireDefault(_box);
	
	var _point = __webpack_require__(7);
	
	var _point2 = _interopRequireDefault(_point);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Boid = function () {
	  function Boid(opts) {
	    _classCallCheck(this, Boid);
	
	    this.opts = opts;
	    this.position = opts.position || new _vector2.default(0, 0);
	    this.velocity = opts.velocity || new _vector2.default(0, 0);
	    this.acceleration = opts.acceleration || new _vector2.default(0, 0);
	    this.velocityLimit = opts.velocityLimit || 2.5;
	    this.accelerationLimit = opts.accelerationLimit || .5;
	
	    //forces
	    this.cohesionAOE = this.opts.cohesionAOE || 20;
	    this.separationAOE = this.opts.separationAOE || 8;
	    this.alignmentAOE = this.opts.cohesionAOE || 20;
	
	    this.cohesionStrength = opts.cohesionStrength || 1;
	    this.separationStrength = opts.separationStrength || 30;
	    this.alignmentStrength = opts.alignmentStrength || 15;
	    this.boundaryStrength = opts.boundaryStrength || 50;
	
	    this.nextAcceleration = new _vector2.default(0, 0);
	  }
	
	  _createClass(Boid, [{
	    key: 'update',
	    value: function update() {
	      this.updatePosition();
	      this.updateVelocity();
	      this.updateAcceleration();
	    }
	  }, {
	    key: 'updateVelocity',
	    value: function updateVelocity() {
	      this.velocity = this.velocity.add(this.acceleration);
	      if (this.velocity.magnitude() > this.velocityLimit) {
	        this.velocity = this.velocity.unitVector(this.velocityLimit);
	      }
	    }
	  }, {
	    key: 'updatePosition',
	    value: function updatePosition() {
	      this.position = this.position.add(this.velocity);
	    }
	  }, {
	    key: 'updateAcceleration',
	    value: function updateAcceleration() {
	      this.acceleration = this.nextAcceleration;
	      if (this.acceleration.magnitude() > this.accelerationLimit) {
	        this.acceleration = this.acceleration.unitVector(this.accelerationLimit);
	      }
	    }
	  }, {
	    key: 'calculateNextAcceleration',
	    value: function calculateNextAcceleration(quadtree) {
	      var resultVector = new _vector2.default(0, 0);
	      this.cohesionAOE = this.opts.cohesionAOE;
	      var neighbors = this.getNeighbors(this.cohesionAOE, this.position, quadtree);
	
	      var cohesionForce = this.calculateCohesionForce(neighbors).multiplyScalar(this.cohesionStrength);
	
	      var alignmentForce = this.calculateAlignmentForce(neighbors).multiplyScalar(this.alignmentStrength);
	
	      var separationForce = this.calculateSeparationForce(quadtree).multiplyScalar(this.separationStrength);
	
	      var boundaryAvoidanceForce = this.boundaryAvoidance().multiplyScalar(this.boundaryStrength);
	
	      resultVector = resultVector.add(cohesionForce);
	      resultVector = resultVector.add(alignmentForce);
	      resultVector = resultVector.add(separationForce);
	      resultVector = resultVector.add(boundaryAvoidanceForce);
	
	      this.nextAcceleration = this.acceleration.add(resultVector);
	
	      if (this.nextAcceleration.magnitude() > this.accelerationLimit) {
	        this.nextAcceleration.unitVector(this.accelerationLimit);
	      }
	    }
	  }, {
	    key: 'getNeighbors',
	    value: function getNeighbors(aoe, position, quadtree) {
	
	      var aoeRange = new _box2.default(new _point2.default(position.x - aoe, position.y - aoe), new _point2.default(position.x + aoe, position.y + aoe));
	      var neighbors = quadtree.queryRange(aoeRange);
	
	      //get all boids within AoE
	      // const aoeBounds = new BoxPoint(position.x, position.y, aoe.width, aoe.height);
	      // const neighbors = quadtree.retrieve(aoeBounds);
	
	      neighbors = neighbors.map(function (neighbor) {
	        return neighbor.value;
	      });
	
	      return neighbors;
	    }
	  }, {
	    key: 'calculateCohesionForce',
	    value: function calculateCohesionForce(neighbors) {
	      //
	      // const neighbors = this.getNeighbors(this.cohesionAOE,
	      //                                     this.position,
	      //                                     quadtree)
	
	      var result = new _vector2.default(0, 0);
	
	      if (neighbors.length === 0) {
	        return result;
	      }
	
	      for (var i = 0; i < neighbors.length; i++) {
	        result = result.add(neighbors[i].position);
	      }
	
	      //average
	      result.multiplyScalar(1 / neighbors.length);
	
	      //subtract current position from center of mass
	      result = result.sub(this.position);
	      return result;
	    }
	  }, {
	    key: 'calculateAlignmentForce',
	    value: function calculateAlignmentForce(neighbors) {
	      //
	      // const neighbors = this.getNeighbors(this.alignmentAOE,
	      //                                     this.position,
	      //                                     quadtree)
	
	      var result = new _vector2.default(0, 0);
	      if (neighbors.length === 0 || neighbors === undefined) {
	        return result;
	      }
	
	      for (var i = 0; i < neighbors.length; i++) {
	        result = result.add(neighbors[i].velocity);
	      }
	      result.multiplyScalar(1 / neighbors.length); //avg neighbor orientation
	      return result;
	    }
	  }, {
	    key: 'calculateSeparationForce',
	    value: function calculateSeparationForce(quadtree) {
	      this.separationAOE = this.opts.separationAOE;
	      var neighbors = this.getNeighbors(this.separationAOE, this.position, quadtree);
	      var result = new _vector2.default(0, 0);
	      if (neighbors.length === 0 || neighbors === undefined) {
	        return result;
	      }
	
	      //determine the repulsion vector and add to final result
	      for (var i = 0; i < neighbors.length; i++) {
	        result = result.add(this.position.sub(neighbors[i].position));
	      }
	
	      //get average
	      result.multiplyScalar(1 / neighbors.length);
	      return result;
	    }
	  }, {
	    key: 'boundaryAvoidance',
	    value: function boundaryAvoidance() {
	      var bounds = [50, 50, window.innerHeight - 130, window.innerWidth - 100];
	      var result = new _vector2.default(0, 0);
	
	      if (this.position.x < bounds[1]) {
	        result.x = bounds[1] - this.position.x;
	      } else if (this.position.x > bounds[3]) {
	        result.x = bounds[3] - this.position.x;
	      }
	
	      if (this.position.y < bounds[0]) {
	        result.y = bounds[0] - this.position.y;
	      } else if (this.position.y > bounds[2]) {
	        result.y = bounds[2] - this.position.y;
	      }
	
	      return result;
	    }
	  }]);
	
	  return Boid;
	}();
	
	exports.default = Boid;
	;

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	// import BoxPoint from "./boxPoint";
	
	
	var _vector = __webpack_require__(1);
	
	var _vector2 = _interopRequireDefault(_vector);
	
	var _quadtree = __webpack_require__(5);
	
	var _quadtree2 = _interopRequireDefault(_quadtree);
	
	var _box = __webpack_require__(6);
	
	var _box2 = _interopRequireDefault(_box);
	
	var _point = __webpack_require__(7);
	
	var _point2 = _interopRequireDefault(_point);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Flock = function () {
	  function Flock(population, originX, originY, width, height) {
	    _classCallCheck(this, Flock);
	
	    // this.i = 0
	    this.population = population || [];
	    this.quadtree = new _quadtree2.default(new _box2.default(new _point2.default(originX, originY), new _point2.default(originX + width, originY + height)));
	  }
	
	  _createClass(Flock, [{
	    key: "tick",
	    value: function tick() {
	      //insert boids into quadtree
	      var i = void 0,
	          point = void 0,
	          boid = void 0;
	      for (i = 0; i < this.population.length; i++) {
	        boid = this.population[i];
	        point = new _point2.default(boid.position.x, boid.position.y);
	        this.quadtree.insert(point, boid);
	      }
	
	      //calculate the forces on and resulting acceleration of each boid
	      for (i = 0; i < this.population.length; i++) {
	        //the callback function here returns the set of boids that will cause an effect
	        //it is abstracted as a callback so we're not hardwired into using a quadtree
	        //for neighbor range lookup
	        if (window.changed) {
	          debugger;
	        }
	        this.population[i].calculateNextAcceleration(this.quadtree);
	      }
	      //update acceleration velocity and position for each boid
	      //after we've calculated what the current forces being applied
	      //to the boid are
	      for (i = 0; i < this.population.length; i++) {
	        this.population[i].update();
	      }
	      //reset our quadtree
	      this.quadtree.clear();
	    }
	  }, {
	    key: "forEach",
	    value: function forEach(callback) {
	      for (var i = 0; i < this.population.length; i++) {
	        callback(this.population[i]);
	      }
	    }
	  }]);
	
	  return Flock;
	}();
	
	exports.default = Flock;
	;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _box = __webpack_require__(6);
	
	var _box2 = _interopRequireDefault(_box);
	
	var _point = __webpack_require__(7);
	
	var _point2 = _interopRequireDefault(_point);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Quadtree = function () {
	  function Quadtree(box, max) {
	    _classCallCheck(this, Quadtree);
	
	    this.box = box;
	    this.children = null;
	    this.value = [];
	    this.max = max || 10; //maximum points allowed per node
	  }
	
	  _createClass(Quadtree, [{
	    key: "insert",
	    value: function insert(point, object) {
	      //check if should contain point
	      if (!this.box.contains(point)) {
	        return this;
	      }
	
	      //if is a leaf node and not full, then insert
	      //need to check if it already exists though
	      var i = void 0;
	      if (this.children === null && this.value.length < this.max) {
	        for (i = 0; i < this.value.length; i++) {
	          if (this.value[i].point.equals(point)) {
	            this.value[i].value = object;
	            return;
	          }
	        }
	        this.value.push({ point: point, value: object });
	        return this;
	      }
	
	      //if is a leaf node but full, call split
	      if (this.children === null) {
	        this.split();
	      }
	
	      // if is not a leaf node, call insert on child nodes
	      for (i = 0; i < this.children.length; i++) {
	        this.children[i].insert(point, object);
	      }
	      this.value = [];
	      return this;
	    }
	  }, {
	    key: "split",
	    value: function split() {
	      //split into 4 congruent child quadrants using box quadrant method
	      this.children = this.box.split();
	      for (var i = 0; i < this.children.length; i++) {
	        this.children[i] = new Quadtree(this.children[i], this.max);
	      }
	      //redistribute values to appropriate child nodes
	      for (i = 0; i < this.value.length; i++) {
	        for (var k = 0; k < this.children.length; k++) {
	          this.children[k].insert(this.value[i].point, this.value[i].value);
	        }
	      }
	    }
	  }, {
	    key: "queryRange",
	    value: function queryRange(box) {
	      //return all point/value pairs contained in range
	      var result = [];
	      this._queryRangeRec(box, result);
	      return result;
	    }
	  }, {
	    key: "_queryRangeRec",
	    value: function _queryRangeRec(box, result) {
	      //if query area doesn't overlap this box then return
	      if (!this.box.overlaps(box)) {
	        return;
	      }
	      //if leaf node with contained value(s), then check against contained objects
	      var i = void 0;
	      if (this.value.length > 0) {
	        for (i = 0; i < this.value.length; i++) {
	          if (box.contains(this.value[i].point)) {
	            result.push(this.value[i]);
	          }
	        }
	        return;
	      }
	      //if has children, then make recursive call on children
	      if (this.children !== null) {
	        for (i = 0; i < this.children.length; i++) {
	          this.children[i]._queryRangeRec(box, result);
	        }
	        return;
	      }
	    }
	  }, {
	    key: "queryPoint",
	    value: function queryPoint(point) {
	      //return value if point in tree
	      if (!this.box.contains(point)) {
	        return null;
	      }
	
	      if (this.value.length > 0) {
	        for (var i = 0; i < this.value.length; i++) {
	          if (this.value[i].point.equals(point)) {
	            return this.value[i].value;
	          }
	        }
	      }
	
	      if (this.children !== null) {
	        var val = null;
	        for (var i = 0; i < this.children.length; i++) {
	          val = val || this.children[i].queryPoint(point);
	        }
	        return val;
	      }
	      return null;
	    }
	  }, {
	    key: "clear",
	    value: function clear() {
	      this.children = null;
	      this.value = [];
	    }
	  }]);
	
	  return Quadtree;
	}();
	
	exports.default = Quadtree;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _point = __webpack_require__(7);
	
	var _point2 = _interopRequireDefault(_point);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Box = function () {
	  function Box(least, greatest) {
	    _classCallCheck(this, Box);
	
	    this.low = least;
	    this.high = greatest;
	  }
	
	  _createClass(Box, [{
	    key: "contains",
	    value: function contains(point) {
	      if (this.low.lte(point) && this.high.gte(point)) {
	        return true;
	      }
	      return false;
	    }
	  }, {
	    key: "overlaps",
	    value: function overlaps(box) {
	      //if this contains either point of box, then there is an overlap
	      if (this.contains(box.low) || this.contains(box.high) || box.contains(this.low) || box.contains(this.high)) {
	        return true;
	      }
	      return false;
	    }
	  }, {
	    key: "split",
	    value: function split() {
	      var result = [];
	      result.push(new Box(this.low, new _point2.default((this.low.x + this.high.x) / 2, (this.low.y + this.high.y) / 2)));
	      result.push(new Box(new _point2.default((this.low.x + this.high.x) / 2, this.low.y), new _point2.default(this.high.x, (this.low.y + this.high.y) / 2)));
	      result.push(new Box(new _point2.default((this.low.x + this.high.x) / 2, (this.low.y + this.high.y) / 2), this.high));
	      result.push(new Box(new _point2.default(this.low.x, (this.low.y + this.high.y) / 2), new _point2.default((this.low.x + this.high.x) / 2, this.high.y)));
	      return result;
	    }
	  }]);
	
	  return Box;
	}();
	
	exports.default = Box;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Point = function () {
	  function Point(x, y) {
	    _classCallCheck(this, Point);
	
	    this.x = x;
	    this.y = y;
	  }
	
	  _createClass(Point, [{
	    key: "lte",
	    value: function lte(point) {
	      if (this.x <= point.x && this.y <= point.y) {
	        return true;
	      }
	      return false;
	    }
	  }, {
	    key: "gte",
	    value: function gte(point) {
	      if (this.x >= point.x && this.y >= point.y) {
	        return true;
	      }
	      return false;
	    }
	  }, {
	    key: "equals",
	    value: function equals(point) {
	      return this.x === point.x && this.y === point.y;
	    }
	  }]);
	
	  return Point;
	}();
	
	exports.default = Point;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map