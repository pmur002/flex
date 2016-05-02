
function viewport(x, y, w, h, xscale=[0, 1], yscale=[0, 1], clip=true) {
    var parentObj = null;

    var xStr = String(x);
    var yStr = String(y);
    var wStr = String(w);
    var hStr = String(h);
    var numX = (typeof(x) == "string");
    var numY = (typeof(y) == "string");
    var numW = (typeof(w) == "string");
    var numH = (typeof(h) == "string");

    // Maintain inner and outer size and scales
    // These sizes should ALWAYS be numeric
    var widthInner;
    var heightInner;
    var widthOuter;
    var heightOuter;
    var paddingLeft = 0;
    var paddingRight = 0;
    var paddingTop = 0;
    var paddingBottom = 0;

    var xscaleInner = xscale;
    var yscaleInner = yscale;
    var xscaleOuter = xscale;
    var yscaleOuter = yscale;

    // The SVG generated for this viewport
    var svg = null;

    // Links to child objects
    var children = [];

    // Links to synchronised viewports
    var synced = [];

    // Calculate range of LOCATIONS of children
    // (does not include bounding box of children)
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
    
    function setWidth() {
        svg.setAttribute("width", widthOuter);
    }

    function setHeight() {
        svg.setAttribute("height", heightOuter);
    }

    function rescaleX(parent, bbox) {
        // Calculate new scale and new size and new padding
        var crange = childrenXrange(parent);
        var newXscaleInner = newScale(xscaleInner, crange);
        var newXpixels = newPixels(xscaleOuter, crange, widthOuter);
        var newLR = newLRmargins(newXpixels, bbox);
        var newWidthInner = widthOuter - newLR[0] - newLR[1];
        var newXscaleOuter = newOuterScale(newLR, newWidthInner, 
                                           newXscaleInner);
        // Update object
        widthInner = newWidthInner;
        paddingLeft = newLR[0];
        paddingRight = newLR[1];
        xscaleInner = newXscaleInner;
        xscaleOuter = newXscaleOuter;
        // Update SVG
        setWidth();
    }

    function rescaleY(parent, bbox) {
        // Calculate new scale and new size and new padding
        var crange = childrenYrange(parent);
        var newYscaleInner = newScale(yscaleInner, crange);
        var newYpixels = newPixels(yscaleOuter, crange, heightOuter);
        var newTB = newTBmargins(newYpixels, bbox);
        var newHeightInner = heightOuter - newTB[0] - newTB[1];
        var newYscaleOuter = newOuterScale(newTB, newHeightInner, 
                                           newYscaleInner);
        // Update object
        heightInner = newHeightInner;
        paddingTop = newTB[0];
        paddingBottom = newTB[1];
        yscaleInner = newYscaleInner;
        yscaleOuter = newYscaleOuter;
        // Update SVG
        setHeight();
    }

    function resizeX(parent, bbox) {
        var crange = childrenXrange(parent);
        var newXscaleInner = newScale(xscaleInner, crange);
        var newXpixels = newPixels(xscaleOuter, crange, widthOuter);
        var newLR = newLRmargins(newXpixels, bbox);
        var newWidthInner = newXpixels[1] - newXpixels[0];
        var newWidthOuter = newWidthInner + newLR[0] + newLR[1];
        var newXscaleOuter = newOuterScale(newLR, newWidthInner, 
                                           newXscaleInner);
        // Update object
        widthInner = newWidthInner;
        widthOuter = newWidthOuter;
        paddingLeft = newLR[0];
        paddingRight = newLR[1];
        xscaleInner = newXscaleInner;
        xscaleOuter = newXscaleOuter;
        // Update SVG
        setWidth();
    }
    
    function resizeY(parent, bbox) {
        var crange = childrenYrange(parent);
        var newYscaleInner = newScale(yscaleInner, crange);
        var newYpixels = newPixels(yscaleOuter, crange, heightOuter);
        var newTB = newTBmargins(newYpixels, bbox);
        var newHeightInner = newYpixels[1] - newYpixels[0];
        var newHeightOuter = newHeightInner + newTB[0] + newTB[1];
        var newYscaleOuter = newOuterScale(newTB, newHeightInner, 
                                           newYscaleInner);
        // Update object
        heightInner = newHeightInner;
        heightOuter = newHeightOuter;
        paddingTop = newTB[0];
        paddingBottom = newTB[1];
        yscaleInner = newYscaleInner;
        yscaleOuter = newYscaleOuter;
        // Update SVG
        setHeight();
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
            if (bbox.x < 0 || 
                (bbox.x + bbox.width) > widthOuter) {
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
            if (bbox.x < 0 || 
                (bbox.x + bbox.width) > widthOuter) {
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
            if (bbox.y < 0 || 
                (bbox.y + bbox.height) > heightOuter) {
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
            if (bbox.y < 0 || 
                (bbox.y + bbox.height) > heightOuter) {
                resizeY(parent, bbox);
                update = true;
	    }
	    break;
	}
        return update;
    }
    
    this.content = function() {
        return svg;
    }

    this.xscale = function() {
        return xscaleOuter;
    }

    this.yscale = function() {
        return yscaleOuter;
    }

    this.width = function() {
        return widthOuter;
    }

    this.height = function() {
        return heightOuter;
    }
    
    this.build = function(parent) {
        x = transXtoPx(xStr, parent);
        y = transYtoPx(yStr, parent);
        widthOuter = transformW(wStr, parent);
        widthInner = widthOuter;
        heightOuter = transformH(hStr, parent);
        heightInner = heightOuter;

        svg = createSVG("svg");
        svg.setAttribute("x", x);
        svg.setAttribute("y", y);
        svg.setAttribute("width", widthOuter);
        svg.setAttribute("height", heightOuter);
        // FIXME: this  SVG overflow does not work on Firefox
        //        (but does work on Chrome)
        if (clip) {
            svg.setAttribute("overflow", "hidden");
        } else {
            svg.setAttribute("overflow", "visible");
        }
        svg.setAttribute("style",
		         "border: solid 1px #DDD");
    
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
            // Update all child positions
            for (var i = 0; i < children.length; i++) {
                children[i].update(this);
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

