
function flexbox(direction="row") {
    var children = [];
    var div = createHTML("div");
    div.setAttribute("style", 
                     "display: flex; flex-direction: " + direction);

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
    
    this.build = function() {
    };

    this.content = function() {
        return div;
    }
    
    this.add = function(child) {
        child.build(this);
        div.appendChild(child.content());
        children.push(child);
    }
}

// widths and heights should each be an array of strings
function grid(widths, heights) {
    var children = [];

    var widthStr = "";
    for (var i = 0; i < widths.length; i++) {
        widthStr = widthStr + widths[i] + " ";
    }

    var heightStr = "";
    for (var i = 0; i < heights.length; i++) {
        heightStr = heightStr + heights[i] + " ";
    }

    var div = createHTML("div");
    div.setAttribute("style", 
                     "display: grid; " +
                     "grid-template-columns: " + widthStr + "; " + 
                     "grid-template-rows: " + heightStr);

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
    
    this.build = function() {
    };

    this.content = function() {
        return div;
    }
    
    this.add = function(child) {
        child.build(this);
        div.appendChild(child.content());
        children.push(child);
    }    
}
