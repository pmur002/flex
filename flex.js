
createHTML = function(elt) {
    return document.createElement(elt);
}

createSVG = function(elt) {
    return document.createElementNS("http://www.w3.org/2000/svg", elt);
}

// A 'scale' can be [min,max] OR [max.min]
// A 'range' is [min,max]

transXtoPx = function(x, parent) {

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

transXtoNative = function(x, parent) {

    var toNative = function(x, parent) {
        var xs = parent.xscale();
        if (xs[0] < xs[1]) {
            return x[0] + x/parent.width()*(xs[1] - xs[0]);
        } else {
            return x[0] - x/parent.width()*(xs[0] - xs[1]);
        }
    }
    
    var transform = function(x) {
        if (x.includes("px")) {
            return toNative(x.replace(/px/, ""));
        } else if (x.includes("%")) {
            var percent = Number(x.replace(/%/, ""));
            return toNative(parent.width()*percent/100);
        } else {
            // Better be a number!!
            return Number(x);
        }
    }
    
    if (typeof(x) === "string") {
        return eval(x.replace(/[0-9]*[.]?[0-9]+(px|%)?/g, transform));
    } else {
        return x;
    }
}

transYtoPx = function(y, parent) {

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

transYtoNative = function(y, parent) {

    var toNative = function(y, parent) {
        var ys = parent.yscale();
        if (ys[0] < ys[1]) {
            return y[0] + y/parent.height()*(ys[1] - ys[0]);
        } else {
            return y[0] - y/parent.height()*(ys[0] - ys[1]);
        }
    }
    
    var transform = function(x) {
        if (x.includes("px")) {
            return toNative(x.replace(/px/, ""));
        } else if (x.includes("%")) {
            var percent = Number(x.replace(/%/, ""));
            return toNative(parent.width()*percent/100);
        } else {
            // Better be a number!!
            return Number(x);
        }
    }
    
    if (typeof(y) === "string") {
        return eval(y.replace(/[0-9]*[.]?[0-9]+(px|%)?/g, transform));
    } else {
        return y;
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

function viewport(x, y, w, h, xscale=[0, 1], yscale=[0, 1], clip=true) {
    var parentObj = null;
    var xStr = String(x);
    var yStr = String(y);
    var wStr = String(w);
    var hStr = String(h);
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

    function childrenXrange(parent) {
        var crange;
        var range = children[0].xrange(parent);
	for (var i = 1; i < children.length; i++) {
	    crange = children[i].xrange(parent);
	    range = [ Math.min(range[0], crange[0]),
		       Math.max(range[1], crange[1]) ];
	}
	return range;
    }
    
    function childrenYrange(parent) {
        var crange;
        var range = children[0].yrange(parent);
	for (var i = 1; i < children.length; i++) {
	    crange = children[i].yrange(parent);
	    range = [ Math.min(range[0], crange[0]),
		      Math.max(range[1], crange[1]) ];
	}
	return range;
    }
    
    function adjustScale(oldscale, range) {
        var newscale = [];
        if (oldscale[0] < oldscale[1]) {
            newscale[0] = range[0]
            newscale[1] = range[1]
        } else {
            newscale[1] = range[0]
            newscale[0] = range[1]
        }
        return newscale;
    }

    function adjustLeft(width, scale, newscale) {
        if (scale[0] < scale[1]) {
            return (newscale[0] - scale[0])/(scale[1] - scale[0])*width;
        } else {
            return (scale[0] - newscale[0])/(scale[0] - scale[1])*width;
        }
    }

    function adjustRight(width, scale, newscale) {
        if (scale[0] < scale[1]) {
            return (newscale[1] - scale[0])/(scale[1] - scale[0])*width;
        } else {
            return (scale[0] - newscale[1])/(scale[0] - scale[1])*width;
        }
    }

    function adjustTop(height, scale, newscale) {
        if (scale[0] < scale[1]) {
            return (newscale[0] - scale[0])/(scale[1] - scale[0])*height;
        } else {
            return (scale[0] - newscale[0])/(scale[0] - scale[1])*height;
        }
    }

    function adjustBottom(height, scale, newscale) {
        if (scale[0] < scale[1]) {
            return (newscale[1] - scale[0])/(scale[1] - scale[0])*height;
        } else {
            return (scale[0] - newscale[1])/(scale[0] - scale[1])*height;
        }
    }

    function adjustXPadding(left, right, bbox) {
        return { left: left - bbox.x, right: bbox.x + bbox.width - right };
    }
    
    function adjustYPadding(top, bottom, bbox) {
        return { top: top - bbox.y, bottom: bbox.y + bbox.height - bottom };
    }
    
    function adjustWidth(width, padding) {
        w = width;
        paddingLeft = padding.left;
        paddingRight = padding.right;
        wStr = w + "px";
        svg.setAttribute("width", wStr);
        outersvg.setAttribute("width", w + paddingLeft + paddingRight);
        foreignObject.setAttribute("width", w + paddingLeft + paddingRight);
    }

    function adjustHeight(height, padding) {
        h = height;
        paddingTop = padding.top;
        paddingBottom = padding.bottom;
        hStr = h + "px";
        svg.setAttribute("height", hStr);
        outersvg.setAttribute("height", h + paddingTop + paddingBottom);
        foreignObject.setAttribute("height", h + paddingTop + paddingBottom);
    }

    function rescaleX(parent, bbox) {
        // Calculate new scale and new size and new padding
        var crange = childrenXrange(parent);
        var newXscale = adjustScale(xscale, crange);
        var newLeft = adjustLeft(w, xscale, newXscale);
        var newRight = adjustRight(w, xscale, newXscale);
        var newPadding = adjustXPadding(newLeft, newRight, bbox);
        var newWidth = (w + paddingLeft + paddingRight) - 
                       (newPadding.left + newPadding.right);
        adjustWidth(newWidth, newPadding);
        xscale = newXscale;
    }

    function rescaleY(parent, bbox) {
        // Calculate new scale and new size and new padding
        var crange = childrenYrange(parent);
        var newYscale = adjustScale(yscale, crange);
        var newTop = adjustTop(h, yscale, newYscale);
        var newBottom = adjustBottom(h, yscale, newYscale);
        var newPadding = adjustYPadding(newTop, newBottom, bbox);
        var newHeight = (h + paddingTop + paddingBottom) - 
                        (newPadding.top + newPadding.bottom);
        adjustHeight(newHeight, newPadding);
        yscale = newYscale;
    }

    function resizeX(parent, bbox) {
        var crange = childrenXrange(parent);
        var newXscale = adjustScale(xscale, crange);
        var newLeft = adjustLeft(w, xscale, newXscale);
        var newRight = adjustRight(w, xscale, newXscale);
        var newPadding = adjustXPadding(newLeft, newRight, bbox);
        var newWidth = newRight - newLeft;
        adjustWidth(newWidth, newPadding);
        xscale = newXscale;
    }
    
    function resizeY(parent, bbox) {
        // Calculate new scale and new size and new padding
        var crange = childrenYrange(parent);
        var newYscale = adjustScale(yscale, crange);
        var newTop = adjustTop(h, yscale, newYscale);
        var newBottom = adjustBottom(h, yscale, newYscale);
        var newPadding = adjustYPadding(newTop, newBottom, bbox);
        var newHeight = newBottom - newTop;
        adjustHeight(newHeight, newPadding);
        yscale = newYscale;
    }

    function adjustPadding() {
        var pleft = "padding-left:" + paddingLeft + ";";
        var pright = "padding-right:" + paddingRight + ";";
        var ptop = "padding-top:" + paddingTop + ";";
        var pbottom = "padding-bottom:" + paddingBottom + ";";
        svg.setAttribute("style", 
                         pleft + pright + ptop + pbottom);
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
        return transformW(wStr, parentObj);
    }

    this.height = function() {
        return transformH(hStr, parentObj);
    }

    this.build = function(parent) {
        x = transXtoPx(xStr, parent);
        y = transYtoPx(yStr, parent);
        w = transformW(wStr, parent);
        h = transformH(hStr, parent);

        outersvg = createSVG("svg");
        outersvg.setAttribute("x", x);
        outersvg.setAttribute("y", y);
        outersvg.setAttribute("width", w);
        outersvg.setAttribute("height", h);
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
        foreignObject.setAttribute("x", x);
        foreignObject.setAttribute("y", y);
        foreignObject.setAttribute("width", w);
        foreignObject.setAttribute("height", h);
        outersvg.appendChild(foreignObject);

        var html = createHTML("html");
        foreignObject.appendChild(html);

        var body = createHTML("body");
        body.setAttribute("style", "margin: 0");
        html.appendChild(body);

        svg = createSVG("svg");
        svg.setAttribute("x", x);
        svg.setAttribute("y", y);
        svg.setAttribute("width", w);
        svg.setAttribute("height", h);
        svg.setAttribute("overflow", "visible");
        body.appendChild(svg);

        parentObj = parent;
    }

    this.add = function(child, reflowx="static", reflowy=reflowx) {
	// Build and add new child (to existing scale and size)
        child.build(this);
        svg.appendChild(child.content());
        children.push(child);

        var bbox = svg.getBBox();
        var update = false;

	switch (reflowx) {
	case "static":
	    // Do NOT change size or scale on viewport
	    break;
	case "rescale":
	    // Change scale based on content, but NOT size
	    // AND reduce scale if necessary
            rescaleX(this, bbox);
            update = true;
	    break;
	case "zoom":
	    // Change scale based on content, but NOT size
	    // BUT only expand scale (do not reduce)
            if (bbox.x < -paddingLeft || 
                (bbox.x + bbox.width) > (w + paddingRight)) {
	        rescaleX(this, bbox);
                update = true;
	    }
	    break;
	case "resize":
	    // Change scale AND size based on content
	    // AND shrink if necessary
            resizeX(this, bbox);
            update = true;
	    break;
	case "grow":
	    // Change scale AND size based on content
	    // BUT only grow (do not shrink)
            if (bbox.x < -paddingLeft || 
                (bbox.x + bbox.width) > (w + paddingRight)) {
                resizeX(this, bbox);
                update = true;
	    }
	    break;
	}

	switch (reflowy) {	    
	case "static":
	    // Do NOT change size or scale on viewport
	    break;
	case "rescale":
	    // Change scale based on content, but NOT size
	    // AND reduce scale if necessary
            rescaleY(this, bbox);
            update = true;
	    break;
	case "zoom":
	    // Change scale based on content, but NOT size
	    // BUT only expand scale (do not reduce)
            if (bbox.y < -paddingTop || 
                (bbox.y + bbox.height) > (h + paddingBottom)) {
                rescaleY(this, bbox);
                update = true;
	    }
	    break;
	case "resize":
	    // Change scale AND size based on content
	    // AND shrink if necessary
            resizeY(this, bbox);
            update = true;
	    break;
	case "grow":
	    // Change scale AND size based on content
	    // BUT only grow (do not shrink)
            if (bbox.y < -paddingTop || 
                (bbox.y + bbox.height) > (h + paddingBottom)) {
                resizeY(this, bbox);
                update = true;
	    }
	    break;
	}

        if (update) {
            // Update all child positions
            for (var i = 0; i < children.length; i++) {
                children[i].update(this);
            }
            // Update padding on inner SVG
            adjustPadding();
        }
    }
}

