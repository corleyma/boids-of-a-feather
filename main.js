import Vector from "./vector"
import Boid from "./boid"
import Flock from "./flock"



document.addEventListener("DOMContentLoaded", () => {
  let opts = {
    position: new Vector(300, 300), //default position
    velocity: new Vector(1, 1), //default starting velocity
    cohesionAOE: 25,
    separationAOE: 8
  };

  const cohSlider = document.getElementById("cohesion-alignment-area");

  cohSlider.addEventListener("change", (e) => {
    opts.cohesionAOE = parseInt(e.target.value);

  });

  const sepSlider = document.getElementById("sepArea");

  sepSlider.addEventListener("change", (e) => {
    console.log(e.target.value);
    opts.separationAOE = parseInt(e.target.value);
    window.changed = true;

  });

  const population = [];
  let size = 800;
  while (size--) {
    opts.position = new Vector(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    opts.velocity = new Vector((Math.random() - .5) * 1, (Math.random() - .5) * 1);
    population.push(new Boid(opts));
  }

  window.flock = new Flock(population,
    0,
    0,
    window.innerWidth,
    window.innerHeight);

  //setup our visualization of the simulation
  const canvas = document.getElementById('flockCanvas');
  canvas.width = window.innerWidth - 30;
  canvas.height = window.innerHeight - 120;
  const context = canvas.getContext('2d');
  // context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'rgba(0,0,0,1)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  function animate() {
    canvas.beginPath(); 
    context.fillStyle = 'rgba(0,0,0,0.15)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    window.flock.forEach(function(boid) {
      const centerX = boid.position.x;
      const centerY = boid.position.y;
      const colorMap = ["#ffffcc",
        "#ffeda0",
        "#fed976",
        "#feb24c",
        "#fd8d3c",
        "#fc4e2a",
        "#e31a1c",
        "#bd0026",
        "#800026"
      ];


      const colorId = ~~(((boid.velocity.x + boid.velocity.y) / 2) * (9 / 2))
      context.beginPath();

      context.fillStyle = colorMap[colorId];
      context.fillRect(centerX, centerY, 3, 3);
    });
    window.flock.tick();
    window.requestAnimationFrame(animate);
  }

  animate();

})
