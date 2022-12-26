let dot = document.getElementById('dot');
let countdown = document.getElementById('countdown');
let cameraRig = document.getElementById('camera-rig');
let camera = document.getElementById('camera');

AFRAME.registerComponent("event-listener", {
    init: function() {
        this.el.addEventListener("click", function(e) {
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
        startScene2();
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
  document.getElementById('scene1').setAttribute('visible', 'true');
  document.getElementById('scene2').setAttribute('visible', 'false');
  countdown.setAttribute('visible', 'false');
  resetCamera();
  enableDot();
}

function startScene2() {
  setScene2Camera();
  document.getElementById('scene1').setAttribute('visible', 'false');
  document.getElementById('scene2').setAttribute('visible', 'true');
  var entity = document.querySelector('[sound]');
  entity.components.sound.playSound();
}

function disableDot() {
  dot.setAttribute('visible', 'false');
  dot.setAttribute('position', '0 100 10');
}

function enableDot() {
  dot.setAttribute('visible', 'true');
  dot.setAttribute('position', '0 5 -10');
}

function resetCamera() {
  let controls = camera.components['look-controls'];
  controls.pitchObject.rotation.x = 0;
  controls.yawObject.rotation.y = 0;

  cameraRig.setAttribute('position', '0 1.6 0');
  camera.setAttribute('position', '0 0 0');
  camera.removeAttribute("alongpath");
}

function setScene2Camera() {
  resetCamera();
  cameraRig.setAttribute('position', '0 1.6 20');
  camera.setAttribute("alongpath", "curve", "#track1");
}

