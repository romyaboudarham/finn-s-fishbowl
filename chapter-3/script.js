let dot = document.getElementById('dot');
let countdown = document.getElementById('countdown');
let rig = document.getElementById('rig');
let camera = document.getElementById('camera');
let cursor = document.getElementById('cursor');

AFRAME.registerComponent("event-listener", {
    init: function() {
        this.el.addEventListener("click", function(e) {
          cursor.setAttribute('visible', 'false');
          countdown.dispatchEvent(new CustomEvent('countdown-begin'))
          countdown.setAttribute('visible', 'true');
          disableDot();
        });
    }
  });

AFRAME.registerComponent("countdown-animation-manager", {
    init: function() {
      // wait for the first animation to finish
      this.el.addEventListener("animationcomplete__first", e => {
        // start the second animation
        e.target.setAttribute('text-geometry', 'value', '2');
        this.el.emit("second")
      })
      this.el.addEventListener("animationcomplete__second", e => {
        // start the second animation
        e.target.setAttribute('text-geometry', 'value', '1');
        this.el.emit("third")
      })
      this.el.addEventListener("animationcomplete__third", e => {
        startScene();
      })
    }
  });

AFRAME.registerComponent('restart-chapter', {
  schema: {type: 'selector'},

  init: function () {
    var soundEl = this.el;

    soundEl.addEventListener('sound-ended', function () {
      restart();
    });
  }
});

function restart() {
  document.getElementById('countdown').setAttribute('text-geometry', 'value', '3');
  countdown.setAttribute('visible', 'false');
  cursor.setAttribute('visible', 'true');
  resetCamera();
  enableDot();
}

function startScene() {
  rig.setAttribute("alongpath", "curve", "#track1");
  rig.setAttribute("alongpath", "dur", "500");
  var entity = document.querySelector('[sound]');
  entity.components.sound.playSound();
}

function disableDot() {
  dot.setAttribute('visible', 'false');
  dot.setAttribute('position', '0 100 17');
}

function enableDot() {
  dot.setAttribute('visible', 'true');
  dot.setAttribute('position', '0 6.1 17');
}

function resetCamera() {
  let controls = camera.components['look-controls'];
  controls.pitchObject.rotation.x = 0;
  controls.yawObject.rotation.y = 0;
  rig.setAttribute("alongpath", "curve", "#track2");
}
