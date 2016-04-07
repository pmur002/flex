
createHTML = function(elt) {
    return document.createElement(elt);
}

createSVG = function(elt) {
    return document.createElementNS("http://www.w3.org/2000/svg", elt);
}

// A 'scale' can be [min,max] OR [max.min]
// A 'range' is [min,max]

transformX = function(x, parent) {

    var transScale = function(x, parent) {
        var xs = parent.xscale();
        if (xs[0] < xs[1]) {
            return parent.width()*(x - xs[0])/(xs[1] - xs[0]);
        } else {
            return parent.width()*(1 - (x - xs[1])/(xs[0] - xs[1]));
        }
    }
    
    var transform = function(x) {
        if (x.includes("px")) {
            return x.replace(/px/, "");
        } else if (x.includes("%")) {
            var percent = Number(x.replace(/%/, ""));
            return parent.width()*percent/100;
        } else {
            // Better be a number!!
            return transScale(x, parent);
        }
    }
    
    if (typeof(x) === "string") {
        return eval(x.replace(/[0-9]*[.]?[0-9]+(px|%)?/g, transform));
    } else {
        return transScale(x, parent);
    }
}

transformY = function(y, parent) {

    var transScale = function(y, parent) {
        var ys = parent.yscale();
        if (ys[0] < ys[1]) {
            return parent.height()*(y - ys[0])/(ys[1] - ys[0]);
        } else {
            return parent.height()*(1 - (y - ys[1])/(ys[0] - ys[1]));
        }
    }
    
    var transform = function(x) {
        if (x.includes("px")) {
            return Number(x.replace(/px/, ""));
        } else if (x.includes("%")) {
            var percent = Number(x.replace(/%/, ""));
            return parent.height()*percent/100;
        } else {
            // Better be a number!!
            return transScale(x, parent);
        }
    }
    
    if (typeof(y) === "string") {
        return eval(y.replace(/[0-9]*[.]?[0-9]+(px|%)?/g, transform));
    } else {
        return transScale(y, parent);
    }
}

transformW = function(w, parent) {

    var transScale = function(w, parent) {
        var xs = parent.xscale();
        return parent.width()*w/(xs[1] - xs[0]);
    }
    
    var transform = function(x) {
        if (x.includes("px")) {
            return x.replace(/px/, "");
        } else if (x.includes("%")) {
            var percent = Number(x.replace(/%/, ""));
            return parent.width()*percent/100;
        } else {
            // Better be a number!!
            return transScale(x, parent);
        }
    }
    
    if (typeof(w) === "string") {
        return eval(w.replace(/[0-9]*[.]?[0-9]+(px|%)?/g, transform));
    } else {
        return transScale(w, parent);
    }
}

transformH = function(h, parent) {

    var transScale = function(h, parent) {
        var ys = parent.yscale();
        return parent.height()*h/(ys[1] - ys[0]);
    }
    
    var transform = function(x) {
        if (x.includes("px")) {
            return x.replace(/px/, "");
        } else if (x.includes("%")) {
            var percent = Number(x.replace(/%/, ""));
            return parent.height()*percent/100;
        } else {
            // Better be a number!!
            return transScale(x, parent);
        }
    }
    
    if (typeof(h) === "string") {
        return eval(h.replace(/[0-9]*[.]?[0-9]+(px|%)?/g, transform));
    } else {
        return transScale(h, parent);
    }
}

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

function viewport(x, y, w, h, xscale=[0, 1], yscale=[0, 1], clip=true) {
    var parentObj = null;
    var w = w;
    var h = h;
    var xscale = xscale;
    var yscale = yscale;
    var paddingLeft = 0;
    var paddingRight = 0;
    var paddingTop = 0;
    var paddingBottom = 0;
    var outersvg = null;
    var foreignObject = null;
    var svg = null;
    var children = [];

    function childXRange(range) {
	for (var i = 0; i < children.length; i++) {
	    crange = children[i].xrange(this);
	    range = [ Math.min(range[0], crange[0]),
		       Math.max(range[1], crange[1]) ];
	}
	return range;
    }
    
    function childYRange(range) {
	for (var i = 0; i < children.length; i++) {
	    crange = children[i].yrange(this);
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
        outersvg.setAttribute("width", w + paddingLeft + paddingRight);
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
        outersvg.setAttribute("height", h + paddingTop + paddingBottom);
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
                         pleft + pright + ptop + pbottom);
        foreignObject.setAttribute("width", w + paddingLeft + paddingRight);
        foreignObject.setAttribute("height", h + paddingTop + paddingBottom);
        outersvg.setAttribute("width", w + paddingLeft + paddingRight);
        outersvg.setAttribute("height", h + paddingTop + paddingBottom);
    }

    this.content = function() {
        return outersvg;
    }

    this.xscale = function() {
        return xscale;
    }

    this.yscale = function() {
        return yscale;
    }

    this.width = function() {
        return transformW(w, parentObj);
    }

    this.height = function() {
        return transformH(h, parentObj);
    }

    this.build = function(parent) {
        var tx = transformX(x, parent);
        var ty = transformY(y, parent);
        var tw = transformW(w, parent);
        var th = transformH(h, parent);

        outersvg = createSVG("svg");
        outersvg.setAttribute("x", tx);
        outersvg.setAttribute("y", ty);
        outersvg.setAttribute("width", tw);
        outersvg.setAttribute("height", th);
        // FIXME: this outer SVG overflow does not work on Firefox
        //        (but does work on Chrome)
        if (clip) {
            outersvg.setAttribute("overflow", "hidden");
        } else {
            outersvg.setAttribute("overflow", "visible");
        }
        outersvg.setAttribute("style",
		               "border: solid 1px #DDD; margin: 5px");
    
        // Firefox needs width/height on <foreignObject/> 
        // (Chrome does not)
        foreignObject = createSVG("foreignObject");
        foreignObject.setAttribute("x", tx);
        foreignObject.setAttribute("y", ty);
        foreignObject.setAttribute("width", tw);
        foreignObject.setAttribute("height", th);
        outersvg.appendChild(foreignObject);

        var html = createHTML("html");
        foreignObject.appendChild(html);

        var body = createHTML("body");
        body.setAttribute("style", "margin: 0");
        html.appendChild(body);

        svg = createSVG("svg");
        svg.setAttribute("x", tx);
        svg.setAttribute("y", ty);
        svg.setAttribute("width", tw);
        svg.setAttribute("height", th);
        svg.setAttribute("overflow", "visible");
        body.appendChild(svg);

        parentObj = parent;
    }

    this.add = function(child, reflowx="static", reflowy=reflowx) {
	var range = child.xrange(this);
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
	var range = child.yrange(this);
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
        svg.appendChild(child.content());
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

    this.content = function() {
        return svg;
    }

    function position(child, i, parent) {
        child.setAttribute("cx", transformX(x[i], parent));
        child.setAttribute("cy", transformY(y[i], parent));
    }
    
    this.xrange = function(parent) {
        return [ Math.min(...x), Math.max(...x) ];
    }
    
    this.yrange = function(parent) {
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

    this.content = function() {
        return svg;
    }

    function position(child, i, parent) {
        child.setAttribute("x", transformX(x[i], parent));
        child.setAttribute("y", transformY(y[i], parent));
    }
    
    this.xrange = function(parent) {
        return [ Math.min(...x), Math.max(...x) ];
    }
    
    this.yrange = function(parent) {
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

function xaxis() {
    // assume lab, x and y same length
    var svg = null;
    var children = {};

    this.content = function() {
        return svg;
    }

    function positionChildren(parent) {
        var xs = parent.xscale();
        var xs = parent.xscale();
        var leftTick = Math.min(xs[0], xs[1]);
        var rightTick = Math.max(xs[0], xs[1]);
        var ltx = transformX(leftTick, parent);
        var rtx = transformX(rightTick, parent);
        var top = transformY(1, parent);
        var bot = transformY("1 + 10px", parent);
        children.major.setAttribute("x1", ltx);
        children.major.setAttribute("x2", rtx);
        children.major.setAttribute("y1", top);
        children.major.setAttribute("y2", top);
        children.tick1.setAttribute("x1", ltx);
        children.tick1.setAttribute("x2", ltx);
        children.tick1.setAttribute("y1", top);
        children.tick1.setAttribute("y2", bot);
        children.tick2.setAttribute("x1", rtx);
        children.tick2.setAttribute("x2", rtx);
        children.tick2.setAttribute("y1", top);
        children.tick2.setAttribute("y2", bot);
        children.ticklab1.setAttribute("x", ltx);
        children.ticklab1.setAttribute("y", bot);
	var textNode = document.createTextNode(leftTick);
        children.ticklab1.removeChild(children.ticklab1.childNodes[0]);
        children.ticklab1.appendChild(textNode);
        children.ticklab2.setAttribute("x", rtx);
        children.ticklab2.setAttribute("y", bot);
	textNode = document.createTextNode(rightTick);
        children.ticklab2.removeChild(children.ticklab2.childNodes[0]);
        children.ticklab2.appendChild(textNode);
    }
    
    this.xrange = function(parent) {
        var xs = parent.xscale();
        return [ Math.min(xs[0], xs[1]), Math.max(xs[0], xs[1]) ];
    }
    
    this.yrange = function(parent) {
        var ys = parent.yscale();
        return [ Math.min(ys[0], ys[1]), Math.max(ys[0], ys[1]) ];        
    }
    
    this.build = function(parent) {
        svg = createSVG("g");
        var major = createSVG("line");
        major.setAttribute("stroke", "black");
        svg.appendChild(major);
        children.major = major;
        var tick1 = createSVG("line");
        tick1.setAttribute("stroke", "black");
        svg.appendChild(tick1);
        children.tick1 = tick1;
        var tick2 = createSVG("line");
        tick2.setAttribute("stroke", "black");
        svg.appendChild(tick2);
        children.tick2 = tick2;
        var ticklab1 = createSVG("text");
	ticklab1.setAttribute("text-anchor", "middle");
	ticklab1.setAttribute("dominant-baseline", "text-before-edge");
	var textNode = document.createTextNode("");
        ticklab1.appendChild(textNode);
        svg.appendChild(ticklab1);
        children.ticklab1 = ticklab1;
        var ticklab2 = createSVG("text");
	ticklab2.setAttribute("text-anchor", "middle");
	ticklab2.setAttribute("dominant-baseline", "text-before-edge");
	var textNode = document.createTextNode("");
        ticklab2.appendChild(textNode);
        svg.appendChild(ticklab2);
        children.ticklab2 = ticklab2;

        positionChildren(parent);
    }

    // Recalculate position
    this.update = function(parent) {
        positionChildren(parent);
    }
}

