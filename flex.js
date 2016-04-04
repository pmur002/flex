
function viewport(x, y, w, h, xscale=[0, 1], yscale=[0, 1]) {
    var w = w;
    var h = h;
    var xscale = xscale;
    var yscale = yscale;
    var paddingLeft = 0;
    var paddingRight = 0;
    var paddingTop = 0;
    var paddingBottom = 0;
    var children = [];

    var parentsvg = 
        document.createElementNS("http://www.w3.org/2000/svg", "svg");
    parentsvg.setAttribute("x", x);
    parentsvg.setAttribute("y", y);
    parentsvg.setAttribute("width", w);
    parentsvg.setAttribute("height", h);
    parentsvg.setAttribute("style",
		           "border: solid 1px; margin: 5px");
    
    // Firefox needs width/height on <foreignObject/> 
    // (Chrome does not)
    var foreignObject =
        document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    foreignObject.setAttribute("x", x);
    foreignObject.setAttribute("y", y);
    foreignObject.setAttribute("width", w);
    foreignObject.setAttribute("height", h);
    parentsvg.appendChild(foreignObject);

    var html = document.createElement("html");
    foreignObject.appendChild(html);

    var body = document.createElement("body");
    body.setAttribute("style", "margin: 0");
    html.appendChild(body);

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("x", x);
    svg.setAttribute("y", y);
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    svg.setAttribute("style", "overflow: visible");
    body.appendChild(svg);

    function childRange(range) {
	for (var i = 0; i < children.length; i++) {
	    crange = children[i].range();
	    range.x = [ Math.min(range.x[0], crange.x[0]),
			Math.max(range.x[1], crange.x[1]) ];
	    range.y = [ Math.min(range.y[0], crange.y[0]),
			Math.max(range.y[1], crange.y[1]) ];
	}
	return range;
    }
    
    function adjustScale(range) {
        if (range.x[0] < xscale[0]) {
            xscale[0] = range.x[0]
        }
        if (range.x[1] > xscale[1]) {
            xscale[1] = range.x[1]
        }
        if (range.y[0] < yscale[0]) {
            yscale[0] = range.y[0]
        }
        if (range.y[1] > yscale[1]) {
            yscale[1] = range.y[1]
        }
    }
    
    function adjustSize(range, force=false) {
        var xrange = xscale[1] - xscale[0];
        var newxrange;
        if (force) {
            newxrange = range.x[1] - range.x[0];
        } else { 
            newxrange = Math.max(range.x[1], xscale[1]) - 
                Math.min(range.x[0], xscale[0]);
        }
        w = w*newxrange/xrange;
        svg.setAttribute("width", w);
        parentsvg.setAttribute("width", w + paddingLeft + paddingRight);
        foreignObject.setAttribute("width", w + paddingLeft + paddingRight);
        var yrange = yscale[1] - yscale[0];
        var newyrange;
        if (force) {
            newyrange = range.y[1] - range.y[0];
        } else { 
            newyrange = Math.max(range.y[1], yscale[1]) - 
                Math.min(range.y[0], yscale[0]);
        }
        h = h*newyrange/yrange;
        svg.setAttribute("height", h);
        parentsvg.setAttribute("height", h + paddingTop + paddingBottom);
        foreignObject.setAttribute("height", h + paddingTop + paddingBottom);
    }

    function adjustPadding(bbox) {
        var pleft = "";
        var pright = "";
        var ptop = "";
        var pbottom = "";
        if (bbox.x < 0) {
            paddingLeft = Math.abs(bbox.x);
            pleft = "padding-left:" + paddingLeft + ";";
        }
        if (bbox.x + bbox.width > w) {
            paddingRight = (bbox.width + bbox.x - w);
            pright = "padding-right:" + paddingRight + ";";
        }
        if (bbox.y < 0 ) {
            paddingTop = Math.abs(bbox.y);
            ptop = "padding-top:" + paddingTop + ";";
        }
        if (bbox.y + bbox.height > h) {
            paddingBottom = (bbox.height + bbox.y - h);
            pbottom = "padding-bottom:" + paddingBottom + ";";
        }
        svg.setAttribute("style", 
                         "overflow: visible; " + 
                         pleft + pright + ptop + pbottom);
        foreignObject.setAttribute("width", w + paddingLeft + paddingRight);
        foreignObject.setAttribute("height", h + paddingTop + paddingBottom);
        parentsvg.setAttribute("width", w + paddingLeft + paddingRight);
        parentsvg.setAttribute("height", h + paddingTop + paddingBottom);
    }

    this.xscale = function() {
        return xscale;
    }

    this.yscale = function() {
        return yscale;
    }

    this.width = function() {
        return w;
    }

    this.height = function() {
        return h;
    }

    this.init = function() {
        document.body.appendChild(parentsvg);
    }

    this.add = function(child, reflow="static") {
	var range = child.range();
	switch (reflow) {	    
	case "static":
	    // Do NOT change size or scale on viewport
	    break;
	case "rescale":
	    // Change scale based on content, but NOT size
	    // AND reduce scale if necessary
	    range = childRange(range);
            xscale = range.x;
            yscale = range.y
            for (var i = 0; i < children.length; i++) {
                children[i].update(this);
            }
	    break;
	case "zoom":
	    // Change scale based on content, but NOT size
	    // BUT only expand scale (do not reduce)
            if (range.x[0] < xscale[0] || range.x[1] > xscale[1] ||
                range.y[0] < yscale[0] || range.y[1] > yscale[1]) {
		adjustScale(range);
		for (var i = 0; i < children.length; i++) {
                    children[i].update(this);
		}
	    }
	    break;
	case "resize":
	    // Change scale AND size based on content
	    // AND shrink if necessary
	    var range = child.range();
	    range = childRange(range);
            adjustSize(range, true);
            xscale = range.x;
            yscale = range.y
            for (var i = 0; i < children.length; i++) {
                children[i].update(this);
            }
	    break;
	case "grow":
	    // Change scale AND size based on content
	    // BUT only grow (do not shrink)
            if (range.x[0] < xscale[0] || range.x[1] > xscale[1] ||
                range.y[0] < yscale[0] || range.y[1] > yscale[1]) {
                adjustSize(range);
		adjustScale(range);
		for (var i = 0; i < children.length; i++) {
                    children[i].update(this);
		}
	    }
	    break;
	}

	// Build and add new child
        child.build(this);
        svg.appendChild(child.svg());
        children.push(child);

	if (reflow != "static") {
	    // Adjust viewport margin for content outside scale range
            var bbox = svg.getBBox();
            if (bbox.x < 0 || (bbox.x + bbox.width) > w ||
		bbox.y < 0 || (bbox.y + bbox.height) > h) {
		adjustPadding(bbox);
            }
	}
    }
}

function points(x, y) {
    // assume x and y same length
    var x = x;
    var y = y;
    var svg = null;
    var children = [];

    this.svg = function() {
        return svg;
    }

    function position(child, i, parent) {
        var xs = parent.xscale();
        var ys = parent.yscale();
        child.setAttribute("cx", 
                           parent.width()*(x[i] - xs[0])/(xs[1] - xs[0]));
        child.setAttribute("cy", 
                           parent.height()*(y[i] - ys[0])/(ys[1] - ys[0]));
    }
    
    this.range = function() {
        return { x: [ Math.min(...x), Math.max(...x) ],
                 y: [ Math.min(...y), Math.max(...y) ] };
    }
    
    this.build = function(parent) {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var n = x.length;
        for (var i = 0; i < n; i++) {
            var c = document.createElementNS("http://www.w3.org/2000/svg", 
                                             "circle");
            position(c, i, parent);
            c.setAttribute("r", 3);
            svg.appendChild(c);
            children.push(c);
        }
    }

    // Recalculate position
    this.update = function(parent) {
        for (var i = 0; i < children.length; i++) {
            position(children[i], i, parent);
        }
    }
}

function text(lab, x, y) {
    // assume lab, x and y same length
    var svg = null;
    var children = [];

    this.svg = function() {
        return svg;
    }

    function position(child, i, parent) {
        var xs = parent.xscale();
        var ys = parent.yscale();
        child.setAttribute("x", 
                           parent.width()*(x[i] - xs[0])/(xs[1] - xs[0]));
        child.setAttribute("y", 
                           parent.height()*(y[i] - ys[0])/(ys[1] - ys[0]));
    }
    
    this.range = function() {
        return { x: [ Math.min(...x), Math.max(...x) ],
                 y: [ Math.min(...y), Math.max(...y) ] };
    }
    
    this.build = function(parent) {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var n = x.length;
        for (var i = 0; i < n; i++) {
            var t = document.createElementNS("http://www.w3.org/2000/svg", 
                                             "text");
            position(t, i, parent);
	    t.setAttribute("text-anchor", "middle");
	    t.setAttribute("dominant-baseline", "middle");
	    var textNode = document.createTextNode(lab[i]);
            t.appendChild(textNode);

            svg.appendChild(t);
            children.push(t);
        }
    }

    // Recalculate position
    this.update = function(parent) {
        for (var i = 0; i < children.length; i++) {
            position(children[i], i, parent);
        }
    }
}

