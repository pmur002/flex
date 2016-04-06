
createSVG = function(elt) {
    return document.createElementNS("http://www.w3.org/2000/svg", elt);
}

// A 'scale' can be [min,max] OR [max.min]
// A 'range' is [min,max]

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

    var parentsvg = createSVG("svg");
    parentsvg.setAttribute("x", x);
    parentsvg.setAttribute("y", y);
    parentsvg.setAttribute("width", w);
    parentsvg.setAttribute("height", h);
    parentsvg.setAttribute("style",
		           "border: solid 1px; margin: 5px");
    
    // Firefox needs width/height on <foreignObject/> 
    // (Chrome does not)
    var foreignObject = createSVG("foreignObject");
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

    var svg = createSVG("svg");
    svg.setAttribute("x", x);
    svg.setAttribute("y", y);
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    svg.setAttribute("style", "overflow: visible");
    body.appendChild(svg);

    function childXRange(range) {
	for (var i = 0; i < children.length; i++) {
	    crange = children[i].xrange();
	    range = [ Math.min(range[0], crange[0]),
		       Math.max(range[1], crange[1]) ];
	}
	return range;
    }
    
    function childYRange(range) {
	for (var i = 0; i < children.length; i++) {
	    crange = children[i].yrange();
	    range = [ Math.min(range[0], crange[0]),
		      Math.max(range[1], crange[1]) ];
	}
	return range;
    }
    
    function adjustXScale(range) {
        if (xscale[0] < xscale[1]) {
            if (range[0] < xscale[0]) {
                xscale[0] = range[0]
            }
            if (range[1] > xscale[1]) {
                xscale[1] = range[1]
            }
        } else {
            if (range[0] < xscale[1]) {
                xscale[1] = range[0]
            }
            if (range[1] > xscale[0]) {
                xscale[0] = range[1]
            }
        }
    }
    
    function adjustYScale(range) {
        if (yscale[0] < yscale[1]) {
            if (range[0] < yscale[0]) {
                yscale[0] = range[0]
            }
            if (range[1] > yscale[1]) {
                yscale[1] = range[1]
            }
        } else {
            if (range[0] < yscale[1]) {
                yscale[1] = range[0]
            }
            if (range[1] > yscale[0]) {
                yscale[0] = range[1]
            }
        }
    }
    
    function adjustXSize(range, force=false) {
        var xrange = Math.abs(xscale[1] - xscale[0]);
        var newxrange;
        if (force) {
            newxrange = range[1] - range[0];
        } else { 
            newxrange = Math.max(range[1], xscale[0], xscale[1]) - 
                Math.min(range[0], xscale[0], xscale[1]);
        }
        w = w*newxrange/xrange;
        svg.setAttribute("width", w);
        parentsvg.setAttribute("width", w + paddingLeft + paddingRight);
        foreignObject.setAttribute("width", w + paddingLeft + paddingRight);
    }

    function adjustYSize(range, force=false) {
        var yrange = Math.abs(yscale[1] - yscale[0]);
        var newyrange;
        if (force) {
            newyrange = range[1] - range[0];
        } else { 
            newyrange = Math.max(range[1], yscale[0], yscale[1]) - 
                Math.min(range[0], yscale[0], yscale[1]);
        }
        h = h*newyrange/yrange;
        svg.setAttribute("height", h);
        parentsvg.setAttribute("height", h + paddingTop + paddingBottom);
        foreignObject.setAttribute("height", h + paddingTop + paddingBottom);
    }

    function adjustXPadding(bbox) {
        if (bbox.x < 0) {
            paddingLeft = Math.abs(bbox.x);
        }
        if (bbox.x + bbox.width > w) {
            paddingRight = (bbox.width + bbox.x - w);
        }
    }

    function adjustYPadding(bbox) {
        if (bbox.y < 0 ) {
            paddingTop = Math.abs(bbox.y);
        }
        if (bbox.y + bbox.height > h) {
            paddingBottom = (bbox.height + bbox.y - h);
        }
    }

    function adjustPadding() {
        var pleft = "padding-left:" + paddingLeft + ";";
        var pright = "padding-right:" + paddingRight + ";";
        var ptop = "padding-top:" + paddingTop + ";";
        var pbottom = "padding-bottom:" + paddingBottom + ";";
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

    this.add = function(child, reflowx="static", reflowy=reflowx) {
	var range = child.xrange();
        var update = false;
	switch (reflowx) {
	case "static":
	    // Do NOT change size or scale on viewport
	    break;
	case "rescale":
	    // Change scale based on content, but NOT size
	    // AND reduce scale if necessary
	    range = childXRange(range);
            if (xscale[0] < xscale[1]) {
                xscale = range;
            } else {
                xscale = [ range[1], range[0] ];
            }
            update = true;
	    break;
	case "zoom":
	    // Change scale based on content, but NOT size
	    // BUT only expand scale (do not reduce)
            if (range[0] < Math.min(xscale[0], xscale[1]) || 
                range[1] > Math.max(xscale[0], xscale[1])) {
		adjustXScale(range);
                update = true;
	    }
	    break;
	case "resize":
	    // Change scale AND size based on content
	    // AND shrink if necessary
	    range = childXRange(range);
            adjustXSize(range, true);
            if (xscale[0] < xscale[1]) {
                xscale = range;
            } else {
                xscale = [ range[1], range[0] ];
            }
            update = true;
	    break;
	case "grow":
	    // Change scale AND size based on content
	    // BUT only grow (do not shrink)
            if (range[0] < Math.min(xscale[0], xscale[1]) || 
                range[1] > Math.max(xscale[0], xscale[1])) {
                adjustXSize(range);
		adjustXScale(range);
                update = true;
	    }
	    break;
	}
	var range = child.yrange();
	switch (reflowy) {	    
	case "static":
	    // Do NOT change size or scale on viewport
	    break;
	case "rescale":
	    // Change scale based on content, but NOT size
	    // AND reduce scale if necessary
	    range = childYRange(range);
            if (yscale[0] < yscale[1]) {
                yscale = range
            } else {
                yscale = [ range[1], range[0] ];
            }
            update = true;
	    break;
	case "zoom":
	    // Change scale based on content, but NOT size
	    // BUT only expand scale (do not reduce)
            if (range[0] < Math.min(yscale[0], yscale[1]) || 
                range[1] > Math.max(yscale[0], yscale[1])) {
		adjustYScale(range);
                update = true;
	    }
	    break;
	case "resize":
	    // Change scale AND size based on content
	    // AND shrink if necessary
	    range = childYRange(range);
            adjustYSize(range, true);
            if (yscale[0] < yscale[1]) {
                yscale = range
            } else {
                yscale = [ range[1], range[0] ];
            }
            update = true;
	    break;
	case "grow":
	    // Change scale AND size based on content
	    // BUT only grow (do not shrink)
            if (range[0] < Math.min(yscale[0], yscale[1]) || 
                range[1] > Math.max(yscale[0], yscale[1])) {
                adjustYSize(range);
		adjustYScale(range);
                update = true;
	    }
	    break;
	}
        if (update) {
            for (var i = 0; i < children.length; i++) {
                children[i].update(this);
            }
        }

	// Build and add new child
        child.build(this);
        svg.appendChild(child.svg());
        children.push(child);

        var bbox = svg.getBBox();
        var updatePadding = false;
	if (reflowx != "static") {
	    // Adjust viewport margin for content outside scale range
            if (bbox.x < 0 || (bbox.x + bbox.width) > w) {
		adjustXPadding(bbox);
                udpatePadding = true;
            }
	}
	if (reflowy != "static") {
	    // Adjust viewport margin for content outside scale range
            if (bbox.y < 0 || (bbox.y + bbox.height) > h) {
		adjustYPadding(bbox);
                updatePadding = true;
            }
	}
        if (updatePadding) {
            adjustPadding();
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
        if (xs[0] < xs[1]) {
            child.setAttribute("cx", 
                               parent.width()*(x[i] - xs[0])/(xs[1] - xs[0]));
        } else {
            child.setAttribute("cx", 
                               parent.width()*
                               (1 - (x[i] - xs[1])/(xs[0] - xs[1])));
        }
        if (ys[0] < ys[1]) {
            child.setAttribute("cy", 
                               parent.height()*(y[i] - ys[0])/(ys[1] - ys[0]));
        } else {
            child.setAttribute("cy", 
                               parent.height()*
                               (1 - (y[i] - ys[1])/(ys[0] - ys[1])));
        }
    }
    
    this.xrange = function() {
        return [ Math.min(...x), Math.max(...x) ];
    }
    
    this.yrange = function() {
        return [ Math.min(...y), Math.max(...y) ];
    }
    
    this.build = function(parent) {
        svg = createSVG("g");
        var n = x.length;
        for (var i = 0; i < n; i++) {
            var c = createSVG("circle");
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
        if (xs[0] < xs[1]) {
            child.setAttribute("x", 
                               parent.width()*(x[i] - xs[0])/(xs[1] - xs[0]));
        } else {
            child.setAttribute("x", 
                               parent.width()*
                               (1 - (x[i] - xs[1])/(xs[0] - xs[1])));
        } 
        if (ys[0] < ys[1]) {
            child.setAttribute("y", 
                               parent.height()*(y[i] - ys[0])/(ys[1] - ys[0]));
        } else {
            child.setAttribute("y", 
                               parent.height()*
                               (1 - (y[i] - ys[1])/(ys[0] - ys[1])));
        }
    }
    
    this.xrange = function() {
        return [ Math.min(...x), Math.max(...x) ];
    }
    
    this.yrange = function() {
        return [ Math.min(...y), Math.max(...y) ];
    }
    
    this.build = function(parent) {
        svg = createSVG("g");
        var n = x.length;
        for (var i = 0; i < n; i++) {
            var t = createSVG("text");
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

