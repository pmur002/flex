
function flexbox(direction="row") {
    var children = [];
    var div = createHTML("div");
    div.setAttribute("style", 
                     "display: flex; flex-direction: " + direction);

    this.build = function() {
    };

    this.content = function() {
        return div;
    }
    
    this.add = function(child) {
        child.build();
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

    this.build = function() {
    };

    this.content = function() {
        return div;
    }
    
    this.add = function(child) {
        child.build();
        div.appendChild(child.content());
        children.push(child);
    }    
}
