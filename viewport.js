
// xflip means xscale goes right to left
// yflip means yscale goes bottom to top
function viewport(x, y, w, h, xscale=[0, 1], yscale=[0, 1], 
                  xflip=false, yflip=true, clip=true) {

    if (!((xscale[0] != xscale[1]) && yscale[0] != yscale[1])) {
        throw new Error("Invalid viewport settings");
    }

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
        var newXpixels = newPixels(xscaleOuter, xflip, crange, widthOuter);
        var newLR = newLRmargins(newXpixels, bbox);
        var newWidthInner = safeDim(widthOuter - newLR[0] - newLR[1]);
        var newXscaleOuter = newOuterScale(newLR, newWidthInner, 
                                           newXscaleInner, xflip);
        if (slightlyDifferent(widthInner, newWidthInner) ||
            slightlyDifferent(paddingLeft, newLR[0]) ||
            slightlyDifferent(paddingRight, newLR[1]) ||
            slightlyDifferent(xscaleInner[0], newXscaleInner[0]) ||
            slightlyDifferent(xscaleInner[1], newXscaleInner[1]) ||
            slightlyDifferent(xscaleOuter[0], newXscaleOuter[0]) ||
            slightlyDifferent(xscaleOuter[1], newXscaleOuter[1])) {            

            // Update object
            widthInner = safeDim(newWidthInner);
            paddingLeft = newLR[0];
            paddingRight = newLR[1];
            xscaleInner = newXscaleInner;
            xscaleOuter = newXscaleOuter;
            // Update SVG
            setWidth();
            return true;
        } else {
            return false;
        }
    }

    function rescaleY(parent, bbox) {
        // Calculate new scale and new size and new padding
        var crange = childrenYrange(parent);
        var newYscaleInner = newScale(yscaleInner, crange);
        var newYpixels = newPixels(yscaleOuter, yflip, crange, heightOuter);
        var newTB = newTBmargins(newYpixels, bbox);
        var newHeightInner = safeDim(heightOuter - newTB[0] - newTB[1]);
        var newYscaleOuter = newOuterScale(newTB, newHeightInner, 
                                           newYscaleInner, yflip);
        if (slightlyDifferent(heightInner, newHeightInner) ||
            slightlyDifferent(paddingTop, newTB[0]) ||
            slightlyDifferent(paddingBottom, newTB[1]) ||
            slightlyDifferent(yscaleInner[0], newYscaleInner[0]) ||
            slightlyDifferent(yscaleInner[1], newYscaleInner[1]) ||
            slightlyDifferent(yscaleOuter[0], newYscaleOuter[0]) ||
            slightlyDifferent(yscaleOuter[1], newYscaleOuter[1])) {            

            // Update object
            heightInner = safeDim(newHeightInner);
            paddingTop = newTB[0];
            paddingBottom = newTB[1];
            yscaleInner = newYscaleInner;
            yscaleOuter = newYscaleOuter;
            // Update SVG
            setHeight();
            return true;
        } else {
            return false;
        }
    }

    function resizeX(parent, bbox) {
        var crange = childrenXrange(parent);
        var newXscaleInner = newScale(xscaleInner, crange);
        var newXpixels = newPixels(xscaleOuter, xflip, crange, widthOuter);
        var newLR = newLRmargins(newXpixels, bbox);
        var newWidthInner = safeDim(newXpixels[1] - newXpixels[0]);
        var newWidthOuter = newWidthInner + newLR[0] + newLR[1];
        var newXscaleOuter = newOuterScale(newLR, newWidthInner, 
                                           newXscaleInner, xflip);
        if (slightlyDifferent(widthInner, newWidthInner) ||
            slightlyDifferent(widthOuter, newWidthOuter) ||
            slightlyDifferent(paddingLeft, newLR[0]) ||
            slightlyDifferent(paddingRight, newLR[1]) ||
            slightlyDifferent(xscaleInner[0], newXscaleInner[0]) ||
            slightlyDifferent(xscaleInner[1], newXscaleInner[1]) ||
            slightlyDifferent(xscaleOuter[0], newXscaleOuter[0]) ||
            slightlyDifferent(xscaleOuter[1], newXscaleOuter[1])) {            
            
            // Update object
            widthInner = safeDim(newWidthInner);
            widthOuter = newWidthOuter;
            paddingLeft = newLR[0];
            paddingRight = newLR[1];
            xscaleInner = newXscaleInner;
            xscaleOuter = newXscaleOuter;
            // Update SVG
            setWidth();
            return true;
        } else {
            return false;
        }
    }
    
    function resizeY(parent, bbox) {
        var crange = childrenYrange(parent);
        var newYscaleInner = newScale(yscaleInner, crange);
        var newYpixels = newPixels(yscaleOuter, yflip, crange, heightOuter);
        var newTB = newTBmargins(newYpixels, bbox);
        var newHeightInner = safeDim(newYpixels[1] - newYpixels[0]);
        var newHeightOuter = newHeightInner + newTB[0] + newTB[1];
        var newYscaleOuter = newOuterScale(newTB, newHeightInner, 
                                           newYscaleInner, yflip);
        if (slightlyDifferent(heightInner, newHeightInner) ||
            slightlyDifferent(heightOuter, newHeightOuter) ||
            slightlyDifferent(paddingTop, newTB[0]) ||
            slightlyDifferent(paddingBottom, newTB[1]) ||
            slightlyDifferent(yscaleInner[0], newYscaleInner[0]) ||
            slightlyDifferent(yscaleInner[1], newYscaleInner[1]) ||
            slightlyDifferent(yscaleOuter[0], newYscaleOuter[0]) ||
            slightlyDifferent(yscaleOuter[1], newYscaleOuter[1])) {            
            
            // Update object
            heightInner = safeDim(newHeightInner);
            heightOuter = newHeightOuter;
            paddingTop = newTB[0];
            paddingBottom = newTB[1];
            yscaleInner = newYscaleInner;
            yscaleOuter = newYscaleOuter;
            // Update SVG
            setHeight();
            return true;
        } else {
            return false;
        }
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
            update = rescaleX(parent, bbox);
	    break;
	case "zoom":
	    // Change scale based on content, but NOT size
	    // BUT only expand scale (do not reduce)
            if (bbox.x < 0 || 
                (bbox.x + bbox.width) > widthOuter) {
	        update = rescaleX(parent, bbox);
	    }
	    break;
	case "resize":
	    // Change scale AND size based on content
	    // AND shrink if necessary
            update = resizeX(parent, bbox);
	    break;
	case "grow":
	    // Change scale AND size based on content
	    // BUT only grow (do not shrink)
            if (bbox.x < 0 || 
                (bbox.x + bbox.width) > widthOuter) {
                update = resizeX(parent, bbox);
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
            update = rescaleY(parent, bbox);
	    break;
	case "zoom":
	    // Change scale based on content, but NOT size
	    // BUT only expand scale (do not reduce)
            if (bbox.y < 0 || 
                (bbox.y + bbox.height) > heightOuter) {
                update = rescaleY(parent, bbox);
	    }
	    break;
	case "resize":
	    // Change scale AND size based on content
	    // AND shrink if necessary
            update = resizeY(parent, bbox);
	    break;
	case "grow":
	    // Change scale AND size based on content
	    // BUT only grow (do not shrink)
            if (bbox.y < 0 || 
                (bbox.y + bbox.height) > heightOuter) {
                update = resizeY(parent, bbox);
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

    this.xscaleData = function() {
        return xscaleInner;
    }

    this.yscaleData = function() {
        return yscaleInner;
    }

    this.xflip = function() {
        return xflip;
    }
    
    this.yflip = function() {
        return yflip;
    }
    
    this.width = function() {
        return widthOuter;
    }

    this.height = function() {
        return heightOuter;
    }

    this.padding = function() {
        return { left: paddingLeft, right: paddingRight,
                 top: paddingTop, bottom: paddingBottom }
    }

    function position(parent) {
        var svgx, svgy, svgw, svgh;
        if (numX) {
            svgx = transXtoPx(x, parent);
        } else {
            svgx = transXtoPx(xStr, parent);
        }
        if (numY) {
            svgy = transYtoPx(y, parent);
        } else {
            svgy = transYtoPx(yStr, parent);
        }
        if (numW) {
            widthOuter = safeDim(transWtoPx(w, parent));
        } else {
            widthOuter = safeDim(transWtoPx(wStr, parent));
        }
        widthInner = widthOuter - paddingLeft - paddingRight;
        if (numH) {
            heightOuter = safeDim(transHtoPx(h, parent));
        } else {
            heightOuter = safeDim(transHtoPx(hStr, parent));
        }
        heightInner = heightOuter - paddingTop - paddingBottom;

        svg.setAttribute("x", x);
        svg.setAttribute("y", y);
        svg.setAttribute("width", widthOuter);
        svg.setAttribute("height", heightOuter);
    }
    
    this.build = function(parent) {
        svg = createSVG("svg");
        position(parent);
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

            // Repositioning may involve structural changes to
            // a child (e.g., labels on an axis if rescaled viewport)
            // SO do another round of reflow (and repositioning)
            // (repeat for up to 10 reflows 
            //  [arbitrary limit to avoid infinite loops])
            var counter = 0;
            while ((updateX || updateY) && counter < 10) {
                bbox = svg.getBBox();
                updateX = reflowX(this, bbox, reflowx);
                updateY = reflowY(this, bbox, reflowy);
            
                if (updateX || updateY) {
                    for (var i = 0; i < children.length; i++) {
                        children[i].update(this);
                    }
                    counter = counter + 1;
                }
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

    this.update = function(parent) {
        // Set new widthOuter and calc widthInner from that and 
        // existing padding
        position(parent);
        // Calc new scaleOuter from new widthInner and existing scaleInner
        xscaleOuter = newOuterScale([ paddingLeft, paddingRight ], 
                                    widthInner, xscaleInner, xflip);
        yscaleOuter = newOuterScale([ paddingTop, paddingBottom ], 
                                    heightInner, yscaleInner, yflip);

        // Update all child positions
        for (var i = 0; i < children.length; i++) {
            children[i].update(this);
        }

        // Do NOT reflow

        // Synchronise
        for (var i = 0; i < synced.length; i++) {
            synced[i].viewport.syncFrom(this, 
                                        synced[i].type,
                                        synced[i].reflowx,
                                        synced[i].reflowy);
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
        var xsData = vp.xscaleData();
        var ysData= vp.yscaleData();
        var update = false;

        switch (type) {
        case "all":
            if (widthOuter != width || heightOuter != height ||
                paddingLeft != padding.left ||
                paddingRight != padding.right ||
                paddingTop != padding.top ||
                paddingBottom != padding.bottom ||
                xscaleOuter[0] != xs[0] || xscaleOuter[1] != xs[1] ||
                yscaleOuter[0] != ys[0] || yscaleOuter[1] != ys[1]) {
                widthOuter = width;
                heightOuter = height;
                paddingLeft = padding.left;
                paddingRight = padding.right;
                paddingTop = padding.top;
                paddingBottom = padding.bottom;
                widthInner = widthOuter - paddingLeft - paddingRight;
                heightInner = heightOuter - paddingTop - paddingBottom;
                setWidth();
                setHeight();
                xscaleOuter = xs;
                yscaleOuter = ys;
                xscaleInner = newInnerScale([ paddingLeft, paddingRight ],
                                            widthOuter, xscaleOuter, xflip);
                yscaleInner = newInnerScale([ paddingTop, paddingBottom ],
                                            heightOuter, yscaleOuter, yflip);
                update = true;
            }
            break;
        case "x":
            if (widthOuter != width || 
                paddingLeft != padding.left ||
                paddingRight != padding.right ||
                xscaleOuter[0] != xs[0] || xscaleOuter[1] != xs[1]) {
                widthOuter = width;
                paddingLeft = padding.left;
                paddingRight = padding.right;
                widthInner = widthOuter - paddingLeft - paddingRight;
                setWidth();
                xscaleOuter = xs;
                xscaleInner = newInnerScale([ paddingLeft, paddingRight ],
                                            widthOuter, xscaleOuter, xflip);
                update = true;
            }
            break;
        case "y":
            if (heightOuter != height ||
                paddingTop != padding.top ||
                paddingBottom != padding.bottom ||
                yscaleOuter[0] != ys[0] || yscaleOuter[1] != ys[1]) {
                heightOuter = height;
                paddingTop = padding.top;
                paddingBottom = padding.bottom;
                heightInner = heightOuter - paddingTop - paddingBottom;
                setHeight();
                yscaleOuter = ys;
                yscaleInner = newInnerScale([ paddingTop, paddingBottom ],
                                            heightOuter, yscaleOuter, yflip);
                update = true;
            }
            break;
        case "scale":
            if (xscaleOuter[0] != xs[0] || xscaleOuter[1] != xs[1] ||
                yscaleOuter[0] != ys[0] || yscaleOuter[1] != ys[1]) {
                xscaleOuter = xs;
                yscaleOuter = ys;
                xscaleInner = newInnerScale([ paddingLeft, paddingRight ],
                                            widthOuter, xscaleOuter, xflip);
                yscaleInner = newInnerScale([ paddingTop, paddingBottom ],
                                            heightOuter, yscaleOuter, yflip);
                update = true;
            }
            break;
        case "xscale":
            if (xscaleOuter[0] != xs[0] || xscaleOuter[1] != xs[1]) {
                xscaleOuter = xs;
                xscaleInner = newInnerScale([ paddingLeft, paddingRight ],
                                            widthOuter, xscaleOuter, xflip);
                update = true;
            }
            break;
        case "yscale":
            if (yscaleOuter[0] != ys[0] || yscaleOuter[1] != ys[1]) {
                yscaleOuter = ys;
                yscaleInner = newInnerScale([ paddingTop, paddingBottom ],
                                            heightOuter, yscaleOuter, yflip);
                update = true;
            }
            break;
        // "Data" versions sync scaleInner then recalc scaleOuter
        // (previous versions synced scaleOuter then recalced scaleInner)
        case "allData":
            if (widthOuter != width || heightOuter != height ||
                paddingLeft != padding.left ||
                paddingRight != padding.right ||
                paddingTop != padding.top ||
                paddingBottom != padding.bottom ||
                xscaleOuter[0] != xs[0] || xscaleOuter[1] != xs[1] ||
                yscaleOuter[0] != ys[0] || yscaleOuter[1] != ys[1]) {
                widthOuter = width;
                heightOuter = height;
                paddingLeft = padding.left;
                paddingRight = padding.right;
                paddingTop = padding.top;
                paddingBottom = padding.bottom;
                widthInner = widthOuter - paddingLeft - paddingRight;
                heightInner = heightOuter - paddingTop - paddingBottom;
                setWidth();
                setHeight();
                xscaleInner = xsData;
                yscaleInner = ysData;
                xscaleOuter = newOuterScale([ paddingLeft, paddingRight ],
                                            widthInner, xscaleInner, xflip);
                yscaleOuter = newOuterScale([ paddingTop, paddingBottom ],
                                            heightInner, yscaleInner, yflip);
                update = true;
            }
            break;
        case "xData":
            if (widthOuter != width || 
                paddingLeft != padding.left ||
                paddingRight != padding.right ||
                xscaleOuter[0] != xs[0] || xscaleOuter[1] != xs[1]) {
                widthOuter = width;
                paddingLeft = padding.left;
                paddingRight = padding.right;
                widthInner = widthOuter - paddingLeft - paddingRight;
                setWidth();
                xscaleInner = xsData;
                xscaleOuter = newOuterScale([ paddingLeft, paddingRight ],
                                            widthInner, xscaleInner, xflip);
                update = true;
            }
            break;
        case "yData":
            if (heightOuter != height ||
                paddingTop != padding.top ||
                paddingBottom != padding.bottom ||
                yscaleOuter[0] != ys[0] || yscaleOuter[1] != ys[1]) {
                heightOuter = height;
                paddingTop = padding.top;
                paddingBottom = padding.bottom;
                heightInner = heightOuter - paddingTop - paddingBottom;
                setHeight();
                yscaleInner = ysData;
                yscaleOuter = newOuterScale([ paddingTop, paddingBottom ],
                                            heightInner, yscaleInner, yflip);
                update = true;
            }
            break;
        case "scaleData":
            if (xscaleOuter[0] != xs[0] || xscaleOuter[1] != xs[1] ||
                yscaleOuter[0] != ys[0] || yscaleOuter[1] != ys[1]) {
                xscaleInner = xsData;
                yscaleInner = ysData;
                xscaleOuter = newOuterScale([ paddingLeft, paddingRight ],
                                            widthInner, xscaleInner, xflip);
                yscaleOuter = newOuterScale([ paddingTop, paddingBottom ],
                                            heightInner, yscaleInner, yflip);
                update = true;
            }
            break;
        case "xscaleData":
            if (xscaleOuter[0] != xs[0] || xscaleOuter[1] != xs[1]) {
                xscaleInner = xsData;
                xscaleOuter = newOuterScale([ paddingLeft, paddingRight ],
                                            widthInner, xscaleInner, xflip);
                update = true;
            }
            break;
        case "yscaleData":
            if (yscaleOuter[0] != ys[0] || yscaleOuter[1] != ys[1]) {
                yscaleInner = ysData;
                yscaleOuter = newOuterScale([ paddingTop, paddingBottom ],
                                            heightInner, yscaleInner, yflip);
                update = true;
            }
            break;
        }

        if (update) {
            // Position all children relative to new size/scales
            // (analogous to adding a new child in this.add())
            for (var i = 0; i < children.length; i++) {
                children[i].update(this);
            }
            
            var bbox;
            var updateX = true;
            var updateY = true;
            // Repositioning may involve structural changes to
            // a child (e.g., labels on an axis if rescaled viewport)
            // SO do another round of reflow (and repositioning)
            // (repeat for up to 10 reflows 
            //  [arbitrary limit to avoid infinite loops])
            var counter = 0;
            while ((updateX || updateY) && counter < 10) {
                bbox = svg.getBBox();
                updateX = reflowX(this, bbox, reflowx);
                updateY = reflowY(this, bbox, reflowy);
            
                if (updateX || updateY) {
                    for (var i = 0; i < children.length; i++) {
                        children[i].update(this);
                    }
                    counter = counter + 1;
                }
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

