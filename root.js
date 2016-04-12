
function root(w, h, parent) {
    var div;
    div = createHTML("div");
    div.setAttribute("id", "root");
    div.setAttribute("style", 
                     "width: " + w + "; height: " + h);
    var parentElt = document.querySelector(parent);
    parentElt.appendChild(div);

    this.xscale = function() {
        return [0, 1];
    }

    this.yscale = function() {
        return [0, 1];
    }

    this.width = function() {
        return div.scrollWidth;
    } 

    this.height = function() {
        return div.scrollHeight;
    }
    
    this.setContent = function(child) {
        child.build(this);
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
        div.appendChild(child.content());
    }
}

