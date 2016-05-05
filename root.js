
function root(w, h, parent) {
    var content = null;
    var div;
    div = createHTML("div");
    div.setAttribute("id", "root");
    div.setAttribute("style", 
                     "width: " + w + "; height: " + h);
    var parentElt = document.querySelector(parent);
    parentElt.appendChild(div);
    // When root <div> changes, update children
    var me = this;
    function resize() {
        if (content != null) {
            content.update(me);
        }
    }
    window.onresize = resize;

    this.xscale = function() {
        return [0, 1];
    }

    this.yscale = function() {
        return [0, 1];
    }

    this.xflip = function() {
        return false;
    }

    this.yflip = function() {
        return false;
    }

    this.width = function() {
        return div.clientWidth;
    } 

    this.height = function() {
        return div.clientHeight;
    }
    
    this.setContent = function(child) {
        // FIXME: child MUST be a viewport?
        child.build(this);
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
        div.appendChild(child.content());
        content = child;
    }
}

