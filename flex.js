
createHTML = function(elt) {
    return document.createElement(elt);
}

createSVG = function(elt) {
    return document.createElementNS("http://www.w3.org/2000/svg", elt);
}

// A 'scale' can be [min,max] OR [max.min]
// A 'range' is [min,max]

// A 'scale' can never be truly zero-extent
// (so that can always keep scale "direction", e.g., left-to-right)

// A viewport 'widthInner' can never be truly zero
// (so that can always calc scaleOuter from scaleInner)
safeDim = function(dim) {
    if (dim < 0) {
        throw new Error("Invalid dimension");
    } else if (dim === 0) {
        return 0.001;
    } else {
        return dim;
    }
}

// Modify a scale to match a range
newScale = function(scale, range) {
    var newscale = [];
    if (range[0] === range[1]) {
        var eps = Math.max(0.0001, range[0]/10000)
        if (scale[0] < scale[1]) {
            newscale[0] = range[0];
            newscale[1] = scale[0] + eps;
        } else {
            newscale[1] = range[0];
            newscale[0] = scale[0] + eps;
        }
    } else {
        if (scale[0] < scale[1]) {
            newscale[0] = range[0]
            newscale[1] = range[1]
        } else {
            newscale[1] = range[0]
            newscale[0] = range[1]
        }
    }
    return newscale;
}

// Calculate left and right pixels for range based on scale and width
// (or top and bottom pixels for range based on scale and height)
newPixels = function(scale, range, dim) {
    if (scale[0] < scale[1]) {
        return [ (range[0] - scale[0])/(scale[1] - scale[0])*dim,
                 (range[1] - scale[0])/(scale[1] - scale[0])*dim ];
    } else {
        return [ (scale[0] - range[1])/(scale[0] - scale[1])*dim,
                 (scale[0] - range[0])/(scale[0] - scale[1])*dim ];
    }
}

// Calculate left and right margins based on left and right pixels and bbox
newLRmargins = function(lrPixels, bbox) {
    return [ lrPixels[0] - bbox.x, bbox.x + bbox.width - lrPixels[1] ];    
}

// Calculate top and bottom margins based on top and bottom pixels and bbox
newTBmargins = function(tbPixels, bbox) {
    return [ tbPixels[0] - bbox.y, bbox.y + bbox.height - tbPixels[1] ];    
}

// Calculate outer scale 
// based on left and right margins, innerWidth, and inner scale
newOuterScale = function(margins, innerDim, innerScale) {
    if (innerScale[0] < innerScale[1]) {
        return [ innerScale[0] - 
                 margins[0]/innerDim*(innerScale[1] - innerScale[0]),
                 innerScale[1] + 
                 margins[1]/innerDim*(innerScale[1] - innerScale[0]) ];
    } else {
        return [ innerScale[0] + 
                 margins[0]/innerDim*(innerScale[0] - innerScale[1]),
                 innerScale[1] -
                 margins[1]/innerDim*(innerScale[0] - innerScale[1]) ];
    }    
}

// Calculate inner scale
// based on left and right margins, outerWidth, and outer scale
// (used in vp.syncFrom())
newInnerScale = function(margins, outerDim, outerScale) {
    if (outerScale[0] < outerScale[1]) {
        return [ outerScale[0] +
                 margins[0]/outerDim*(outerScale[1] - outerScale[0]),
                 outerScale[1] - 
                 margins[1]/outerDim*(outerScale[1] - outerScale[0]) ];
    } else {
        return [ outerScale[0] -
                 margins[0]/outerDim*(outerScale[0] - outerScale[1]),
                 outerScale[1] + 
                 margins[1]/outerDim*(outerScale[0] - outerScale[1]) ];
    }
}

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
        // FIXME: special case for "auto" ?
        // (propagate to other trans*() functions)
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
            return xs[0] + x/parent.width()*(xs[1] - xs[0]);
        } else {
            return xs[0] - x/parent.width()*(xs[0] - xs[1]);
        }
    }
    
    var transform = function(x) {
        if (x.includes("px")) {
            return toNative(x.replace(/px/, ""));
        } else if (x.includes("%")) {
            var percent = Number(x.replace(/%/, ""));
            return toNative(parent.width()*percent/100, parent);
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
            return ys[0] + y/parent.height()*(ys[1] - ys[0]);
        } else {
            return ys[0] - y/parent.height()*(ys[0] - ys[1]);
        }
    }
    
    var transform = function(x) {
        if (x.includes("px")) {
            return toNative(x.replace(/px/, ""));
        } else if (x.includes("%")) {
            var percent = Number(x.replace(/%/, ""));
            return toNative(parent.height()*percent/100, parent);
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

