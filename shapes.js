
xrange = function(x, xStr, numX, parent) {
    var n = x.length;
    var xmin = Infinity;
    var xmax = -Infinity;
    var xval;
    for (var i = 0; i < n; i++) {
        if (numX[i]) {
            xval = x[i];
        } else {
            xval = transXtoNative(xStr[i], parent);
        }
        if (xval > xmax) xmax = xval;
        if (xval < xmin) xmin = xval;
    }
    return [ xmin, xmax ];
}

yrange = function(y, yStr, numY, parent) {
    var n = y.length;
    var ymin = Infinity;
    var ymax = -Infinity;
    var yval;
    for (var i = 0; i < n; i++) {
        if (numY[i]) {
            yval = y[i];
        } else {
            yval = transYtoNative(yStr[i], parent);
        }
        if (yval > ymax) ymax = yval;
        if (yval < ymin) ymin = yval;
    }
    return [ ymin, ymax ];
}

function points(x, y) {
    // assume x and y same length
    var n = x.length;
    var xStr = [];
    var yStr = [];
    var numX = [];
    var numY = [];

    for (var i = 0; i < n; i++) {
        if (typeof(x[i]) == "string") {
            xStr[i] = x[i];
            numX[i] = false;
        } else {
            numX[i] = true;
        }
        if (typeof(y[i]) == "string") {
            yStr[i] = y[i];
            numY[i] = false;
        } else {
            numY[i] = true;
        }
    }

    var svg = null;
    var children = [];

    this.content = function() {
        return svg;
    }

    function position(child, i, parent) {
        if (numX[i]) {
            child.setAttribute("cx", transXtoPx(x[i], parent));
        } else {
            child.setAttribute("cx", transXtoPx(xStr[i], parent));
        }
        if (numY[i]) {
            child.setAttribute("cy", transYtoPx(y[i], parent));
        } else {
            child.setAttribute("cy", transYtoPx(yStr[i], parent));
        }
    }
    
    this.xrange = function(parent) {
        return xrange(x, xStr, numX, parent);
    }
    
    this.yrange = function(parent) {
        return yrange(y, yStr, numY, parent);
    }
    
    this.build = function(parent) {
        svg = createSVG("g");
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
    var n = x.length;
    var xStr = [];
    var yStr = [];
    var numX = [];
    var numY = [];
    var svg = null;
    var children = [];

    for (var i = 0; i < n; i++) {
        if (typeof(x[i]) == "string") {
            xStr[i] = x[i];
            numX[i] = false;
        } else {
            numX[i] = true;
        }
        if (typeof(y[i]) == "string") {
            yStr[i] = y[i];
            numY[i] = false;
        } else {
            numY[i] = true;
        }
    }

    this.content = function() {
        return svg;
    }

    function position(child, i, parent) {
        child.setAttribute("x", transXtoPx(x[i], parent));
        child.setAttribute("y", transYtoPx(y[i], parent));
    }
    
    this.xrange = function(parent) {
        return xrange(x, xStr, numX, parent);
    }
    
    this.yrange = function(parent) {
        return yrange(y, yStr, numY, parent);
    }
    
    this.build = function(parent) {
        svg = createSVG("g");
        var n = x.length;
        for (var i = 0; i < n; i++) {
            var t = createSVG("text");
            position(t, i, parent);
	    t.setAttribute("text-anchor", "middle");
	    t.setAttribute("dominant-baseline", "middle");
            t.setAttribute("font-family", "sans");
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
        var xs = parent.xscaleData();
        var ys = parent.yscale();
        var ymax = Math.max(ys[0], ys[1]);
        var leftTick = Math.min(xs[0], xs[1]);
        var rightTick = Math.max(xs[0], xs[1]);
        var ltx = transXtoPx(leftTick, parent);
        var rtx = transXtoPx(rightTick, parent);
        var top = transYtoPx(ymax, parent);
        var bot = transYtoPx(ymax + " + 10px", parent);
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
        var xs = parent.xscaleData();
        return [ Math.min(xs[0], xs[1]), Math.max(xs[0], xs[1]) ];
    }
    
    this.yrange = function(parent) {
        var ys = parent.yscale();
        var ymax = Math.max(ys[0], ys[1]);
        return [ ymax, ymax ];
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
        ticklab1.setAttribute("font-family", "sans");
	var textNode = document.createTextNode("");
        ticklab1.appendChild(textNode);
        svg.appendChild(ticklab1);
        children.ticklab1 = ticklab1;
        var ticklab2 = createSVG("text");
	ticklab2.setAttribute("text-anchor", "middle");
	ticklab2.setAttribute("dominant-baseline", "text-before-edge");
        ticklab2.setAttribute("font-family", "sans");
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

function yaxis() {
    // assume lab, x and y same length
    var svg = null;
    var children = {};

    this.content = function() {
        return svg;
    }

    function positionChildren(parent) {
        var ys = parent.yscaleData();
        var xs = parent.xscale();
        var xmax = Math.max(xs[0], xs[1]);
        var bottomTick = Math.min(ys[0], ys[1]);
        var topTick = Math.max(ys[0], ys[1]);
        var bty = transYtoPx(bottomTick, parent);
        var tty = transYtoPx(topTick, parent);
        var right = transXtoPx(xmax, parent);
        var left = transXtoPx(xmax + " - 10px", parent);
        children.major.setAttribute("x1", right);
        children.major.setAttribute("x2", right);
        children.major.setAttribute("y1", bty);
        children.major.setAttribute("y2", tty);
        children.tick1.setAttribute("x1", right);
        children.tick1.setAttribute("x2", left);
        children.tick1.setAttribute("y1", bty);
        children.tick1.setAttribute("y2", bty);
        children.tick2.setAttribute("x1", right);
        children.tick2.setAttribute("x2", left);
        children.tick2.setAttribute("y1", tty);
        children.tick2.setAttribute("y2", tty);
        children.ticklab1.setAttribute("x", left);
        children.ticklab1.setAttribute("y", bty);
	var textNode = document.createTextNode(bottomTick);
        children.ticklab1.removeChild(children.ticklab1.childNodes[0]);
        children.ticklab1.appendChild(textNode);
        children.ticklab2.setAttribute("x", left);
        children.ticklab2.setAttribute("y", tty);
	textNode = document.createTextNode(topTick);
        children.ticklab2.removeChild(children.ticklab2.childNodes[0]);
        children.ticklab2.appendChild(textNode);
    }
    
    this.xrange = function(parent) {
        var xs = parent.xscale();
        var xmax = Math.min(xs[0], xs[1]);
        return [ xmax, xmax ];        
    }
    
    this.yrange = function(parent) {
        var ys = parent.yscaleData();
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
	ticklab1.setAttribute("text-anchor", "end");
	ticklab1.setAttribute("dominant-baseline", "middle");
        ticklab1.setAttribute("font-family", "sans");
	var textNode = document.createTextNode("");
        ticklab1.appendChild(textNode);
        svg.appendChild(ticklab1);
        children.ticklab1 = ticklab1;
        var ticklab2 = createSVG("text");
	ticklab2.setAttribute("text-anchor", "end");
	ticklab2.setAttribute("dominant-baseline", "middle");
        ticklab2.setAttribute("font-family", "sans");
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

