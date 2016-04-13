
function container(direction="row") {
    var children = [];
    div = createHTML("div");
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
