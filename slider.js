document.addEventListener("DOMContentLoaded", ()=> {
  function modifyOffset() {
      var el, newPoint, newPlace, offset, siblings, k;
      width    = this.offsetWidth;
      // newPoint = (this.value - this.getAttribute("min")) / (this.getAttribute("max") - this.getAttribute("min"));
      // offset   = -1;
      // if (newPoint < 0) { newPlace = 0;  }
      // else if (newPoint > 1) { newPlace = width; }
      // else { newPlace = width * newPoint + offset; offset -= newPoint;}
      siblings = this.parentNode.childNodes;
      for (var i = 0; i < siblings.length; i++) {
          sibling = siblings[i];
          if (sibling.id == this.id) { k = true; }
          if ((k == true) && (sibling.nodeName == "OUTPUT")) {
              outputTag = sibling;
          }
      }
      // outputTag.style.left       = newPlace + "px";
      // outputTag.style.marginLeft = offset + "%";
      outputTag.innerHTML        = this.value;
  }

  function modifyInputs() {

      var inputs = document.getElementsByTagName("input");
      for (var i = 0; i < inputs.length; i++) {
          if (inputs[i].getAttribute("type") == "range") {
              inputs[i].onchange = modifyOffset;

              // the following taken from http://stackoverflow.com/questions/2856513/trigger-onchange-event-manually
              if ("fireEvent" in inputs[i]) {
                  inputs[i].fireEvent("onchange");
              } else {
                  var evt = document.createEvent("HTMLEvents");
                  evt.initEvent("change", false, true);
                  inputs[i].dispatchEvent(evt);
              }
          }
      }
  }

  modifyInputs();
})
