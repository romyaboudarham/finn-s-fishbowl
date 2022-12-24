AFRAME.registerComponent("event-listener", {
    init: function() {
        this.el.addEventListener("click", function(e) {
            var dot = document.getElementById('dot');
            var countdown = document.getElementById('countdown')
            countdown.dispatchEvent(new CustomEvent('countdown-begin'))
            countdown.setAttribute('visible', 'true');
            dot.parentNode.removeChild(dot);
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
        // start the second animation
        // document.location.href = 'panic.html';
        var entity = document.querySelector('[sound]');
        document.getElementById('scene1').setAttribute('visible', 'false');
        document.getElementById('scene2').setAttribute('visible', 'true');
        entity.components.sound.playSound();
      })
    }
  });

  AFRAME.registerComponent('restart-chapter', {
    schema: {type: 'selector'},
  
    init: function () {
      var soundEl = this.el;
  
      soundEl.addEventListener('sound-ended', function () {
        document.location.href = 'index.html';
      });
    }
  });
  