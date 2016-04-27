
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
    var synced = [];

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
        if (nearlyEqual(scale[0], scale[1])) {
	    return 0;
	} else if (scale[0] < scale[1]) {
            return (newscale[0] - scale[0])/(scale[1] - scale[0])*width;
        } else {
            return (scale[0] - newscale[0])/(scale[0] - scale[1])*width;
        }
    }

    function adjustRight(width, scale, newscale) {
        if (nearlyEqual(scale[0], scale[1])) {
	    return width;
        } else if (scale[0] < scale[1]) {
            return (newscale[1] - scale[0])/(scale[1] - scale[0])*width;
        } else {
            return (scale[0] - newscale[1])/(scale[0] - scale[1])*width;
        }
    }

    function adjustTop(height, scale, newscale) {
        if (nearlyEqual(scale[0], scale[1])) {
	    return 0;
        } else if (scale[0] < scale[1]) {
            return (newscale[0] - scale[0])/(scale[1] - scale[0])*height;
        } else {
            return (scale[0] - newscale[0])/(scale[0] - scale[1])*height;
        }
    }

    function adjustBottom(height, scale, newscale) {
        if (nearlyEqual(scale[0], scale[1])) {
	    return height;
        } else if (scale[0] < scale[1]) {
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
    
    function setWidth(width, padding) {
        w = width;
        paddingLeft = padding.left;
        paddingRight = padding.right;
        wStr = w + "px";
        svg.setAttribute("width", wStr);
        outersvg.setAttribute("width", w + paddingLeft + paddingRight);
        foreignObject.setAttribute("width", w + paddingLeft + paddingRight);
    }

    function setHeight(height, padding) {
        h = height;
        paddingTop = padding.top;
        paddingBottom = padding.bottom;
        hStr = h + "px";
        svg.setAttribute("height", hStr);
        outersvg.setAttribute("height", h + paddingTop + paddingBottom);
        foreignObject.setAttribute("height", h + paddingTop + paddingBottom);
    }

    function setPadding() {
        var pleft = "padding-left:" + paddingLeft + ";";
        var pright = "padding-right:" + paddingRight + ";";
        var ptop = "padding-top:" + paddingTop + ";";
        var pbottom = "padding-bottom:" + paddingBottom + ";";
        svg.setAttribute("style", 
                         pleft + pright + ptop + pbottom);
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

        setWidth(newWidth, newPadding);
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

        setHeight(newHeight, newPadding);
        yscale = newYscale;
    }

    function resizeX(parent, bbox) {
        var crange = childrenXrange(parent);
        var newXscale = adjustScale(xscale, crange);
        var newLeft = adjustLeft(w, xscale, newXscale);
        var newRight = adjustRight(w, xscale, newXscale);
        var newPadding = adjustXPadding(newLeft, newRight, bbox);
        var newWidth = newRight - newLeft;

        setWidth(newWidth, newPadding);
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

        setHeight(newHeight, newPadding);
        yscale = newYscale;
    }

    function reflowX(parent, bbox, reflowx) {
        var update = false;
	switch (reflowx) {
	case "static":
	    // Do NOT change size or scale on viewport
	    break;
	case "rescale":
	    // Change scale based on content, but NOT size
	    // AND reduce scale if necessary
            rescaleX(parent, bbox);
            update = true;
	    break;
	case "zoom":
	    // Change scale based on content, but NOT size
	    // BUT only expand scale (do not reduce)
            if (bbox.x < -paddingLeft || 
                (bbox.x + bbox.width) > (w + paddingRight)) {
	        rescaleX(parent, bbox);
                update = true;
	    }
	    break;
	case "resize":
	    // Change scale AND size based on content
	    // AND shrink if necessary
            resizeX(parent, bbox);
            update = true;
	    break;
	case "grow":
	    // Change scale AND size based on content
	    // BUT only grow (do not shrink)
            if (bbox.x < -paddingLeft || 
                (bbox.x + bbox.width) > (w + paddingRight)) {
                resizeX(parent, bbox);
                update = true;
	    }
	    break;
	}
        return update;
    }
    
    function reflowY(parent, bbox, reflowy) {
        var update = false;
	switch (reflowy) {	    
	case "static":
	    // Do NOT change size or scale on viewport
	    break;
	case "rescale":
	    // Change scale based on content, but NOT size
	    // AND reduce scale if necessary
            rescaleY(parent, bbox);
            update = true;
	    break;
	case "zoom":
	    // Change scale based on content, but NOT size
	    // BUT only expand scale (do not reduce)
            if (bbox.y < -paddingTop || 
                (bbox.y + bbox.height) > (h + paddingBottom)) {
                rescaleY(parent, bbox);
                update = true;
	    }
	    break;
	case "resize":
	    // Change scale AND size based on content
	    // AND shrink if necessary
            resizeY(parent, bbox);
            update = true;
	    break;
	case "grow":
	    // Change scale AND size based on content
	    // BUT only grow (do not shrink)
            if (bbox.y < -paddingTop || 
                (bbox.y + bbox.height) > (h + paddingBottom)) {
                resizeY(parent, bbox);
                update = true;
	    }
	    break;
	}
        return update;
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
    
    this.padding = function() {
        return { left: paddingLeft, right: paddingRight,
                 top: paddingTop, bottom: paddingBottom };
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
		               "border: solid 1px #DDD");
    
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
        var updateX = reflowX(this, bbox, reflowx);
        var updateY = reflowY(this, bbox, reflowy);

        if (updateX || updateY) {
            // Update padding on inner SVG
            setPadding();
            // Update all child positions
            for (var i = 0; i < children.length; i++) {
                children[i].update(this);
            }

            // Allow for child update requiring further reflow
            var bbox = svg.getBBox();
            var updateX = reflowX(this, bbox, reflowx);
            var updateY = reflowY(this, bbox, reflowy);            
            if (updateX || updateY) {
                // Update padding on inner SVG
                setPadding();
            }

            // Synchronise
            for (var i = 0; i < synced.length; i++) {
                synced[i].viewport.syncFrom(this, 
                                            synced[i].type,
                                            synced[i].reflowx,
                                            synced[i].reflowy);
            }
        }
    }

    this.syncTo = function(vp, type, reflowx="static", reflowy=reflowx) {
        // FIXME:  check for valid combination of 'type' and 'reflow'
        //         e.g., "all" must pair with "static", but 
        //               "x" can pair with "static" or "static"+"resize"
        var newSync = { viewport: vp, type: type, 
                        reflowx: reflowx, reflowy: reflowy };
        synced.push(newSync);
        vp.syncFrom(this, type, reflowx, reflowy);
    }

    this.syncFrom = function(vp, type, reflowx, reflowy) {
        var width = vp.width();
        var height = vp.height();
        var padding = vp.padding();
        var xs = vp.xscale();
        var ys = vp.yscale();
        var update = false;

        switch (type) {
        case "all":
            if (w != width || h != height ||
                paddingLeft != padding.left ||
                paddingRight != padding.right ||
                paddingTop != padding.top ||
                paddingBottom != padding.bottom ||
                xscale[0] != xs[0] || xscale[1] != xs[1] ||
                yscale[0] != ys[0] || yscale[1] != ys[1]) {                
                setWidth(width, padding);
                setHeight(height, padding);
                xscale = xs;
                yscale = ys;
                update = true;
            }
            break;
        case "x":
            if (w != width || 
                paddingLeft != padding.left ||
                paddingRight != padding.right ||
                xscale[0] != xs[0] || xscale[1] != xs[1]) { 
                setWidth(width, padding);
                xscale = xs;
                update = true;
            }
            break;
        case "y":
            if (h != height ||
                paddingTop != padding.top ||
                paddingBottom != padding.bottom ||
                yscale[0] != ys[0] || yscale[1] != ys[1]) {                
                setHeight(height, padding);
                yscale = ys;
                update = true;
            }
            break;
        case "scale":
            if (xscale[0] != xs[0] || xscale[1] != xs[1] ||
                yscale[0] != ys[0] || yscale[1] != ys[1]) {                
                xscale = xs;
                yscale = ys;
                update = true;
            }
            break;
        case "xscale":
            if (xscale[0] != xs[0] || xscale[1] != xs[1]) {                
                xscale = xs;
                update = true;
            }
            break;
        case "yscale":
            if (yscale[0] != ys[0] || yscale[1] != ys[1]) {                
                yscale = ys;
                update = true;
            }
            break;
        }

        if (update) {
            // Update padding on inner SVG
            setPadding();
            // Update all child positions
            for (var i = 0; i < children.length; i++) {
                children[i].update(this);
            }
            
            // Allow for child update requiring further reflow
            var bbox = svg.getBBox();
            var updateX = reflowX(this, bbox, reflowx);
            var updateY = reflowY(this, bbox, reflowy);            
            if (updateX || updateY) {
                // Update padding on inner SVG
                setPadding();
            }

            // Synchronise
            for (var i = 0; i < synced.length; i++) {
                synced[i].viewport.syncFrom(this, 
                                            synced[i].type,
                                            synced[i].reflowx,
                                            synced[i].reflowy);
            }
        }
    }
}

