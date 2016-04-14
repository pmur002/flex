
clearTest = function() {
    var div = document.getElementById("test");
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

syncTest = function() {

    clearTest();

    var testdiv = document.getElementById("test");

    r = new root("50%", "auto", "div#test");
    f = new flexbox("column");
    r.setContent(f);
    vp1 = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    f.add(vp1);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp1.add(p);
    vp2 = new viewport("0px", "0px", "100px", "1px", [0, 1], [1, 0], false);
    f.add(vp2);
    xa = new xaxis();
    vp2.add(xa, "static", "resize");
    vp1.syncTo(vp2, "x");
    
    testdiv.appendChild(document.createElement("p"));
    
    r = new root("50%", "auto", "div#test");
    f = new flexbox("column");
    r.setContent(f);
    vp1 = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    f.add(vp1);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp1.add(p);
    vp2 = new viewport("0px", "0px", "100px", "1px", [0, 1], [1, 0], false);
    f.add(vp2);
    xa = new xaxis();
    vp2.add(xa, "static", "resize");
    vp1.syncTo(vp2, "x");
    p = new points([1.5], [1.5]);
    vp1.add(p, "resize");
    
    testdiv.appendChild(document.createElement("p"));
    
    r = new root("50%", "auto", "div#test");
    f = new flexbox("column");
    r.setContent(f);
    vp1 = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    f.add(vp1);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp1.add(p);
    vp2 = new viewport("0px", "0px", "100px", "1px", [0, 1], [1, 0], false);
    f.add(vp2);
    xa = new xaxis();
    vp2.add(xa, "static", "resize");
    vp1.syncTo(vp2, "x");
    p = new points([1.5], [1.5]);
    vp1.add(p, "rescale");

    testdiv.appendChild(document.createElement("p"));
    
    r = new root("50%", "auto", "div#test");
    f = new flexbox("row");
    r.setContent(f);
    vp1 = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    f.add(vp1);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp1.add(p);
    vp2 = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    f.add(vp2);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp2.add(p);
    vp1.syncTo(vp2, "all");
    vp2.syncTo(vp1, "all");
    p = new points([1.5], [1.5]);
    vp1.add(p, "resize");

    testdiv.appendChild(document.createElement("p"));
    
    r = new root("50%", "auto", "div#test");
    f = new flexbox("row");
    r.setContent(f);
    vp1 = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    f.add(vp1);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp1.add(p);
    vp2 = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    f.add(vp2);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp2.add(p);
    vp1.syncTo(vp2, "all");
    vp2.syncTo(vp1, "all");
    p = new points([1.5], [1.5]);
    vp1.add(p, "resize");
    t = new text(["rescale"], [0], [0]);
    vp2.add(t, "rescale");

    testdiv.appendChild(document.createElement("p"));
    
    r = new root("50%", "auto", "div#test");
    f = new flexbox("row");
    r.setContent(f);
    g = new grid(["auto", "100px"], ["100px", "auto"]);
    f.add(g);
    vp1 = new viewport("0px", "0px", "1px", "100px", [0, 1], [1, 0], false);
    g.add(vp1);
    ya = new yaxis();
    vp1.add(ya, "resize", "static");
    vp2 = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    g.add(vp2);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp2.add(p);
    // placeholder to fill bottom-left corner of grid
    vp3 = new viewport("0px", "0px", "1px", "1px");
    g.add(vp3);
    vp4 = new viewport("0px", "0px", "100px", "1px", [0, 1], [1, 0], false);
    g.add(vp4);
    xa = new xaxis();
    vp4.add(xa, "static", "resize");
    vp2.syncTo(vp4, "x");
    vp2.syncTo(vp1, "y");
    // second "frame"
    g = new grid(["auto", "auto"], ["auto", "auto"]);
    f.add(g);
    vp1 = new viewport("0px", "0px", "1px", "100px", [0, 1], [1, 0], false);
    g.add(vp1);
    ya = new yaxis();
    vp1.add(ya, "resize", "static");
    vp2 = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    g.add(vp2);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp2.add(p);
    // placeholder to fill bottom-left corner of grid
    vp3 = new viewport("0px", "0px", "1px", "1px");
    g.add(vp3);
    vp4 = new viewport("0px", "0px", "100px", "1px", [0, 1], [1, 0], false);
    g.add(vp4);
    xa = new xaxis();
    vp4.add(xa, "static", "resize");
    vp2.syncTo(vp4, "x");
    vp2.syncTo(vp1, "y");
    p = new points([1.5], [1.5]);
    vp2.add(p, "resize");
}

basicTest = function() {

    clearTest();

    var testdiv = document.getElementById("test");

    r = new root("50%", "100px", "div#test");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p);
    t = new text(["test"], ["100% - 20px"], ["100% - 10px"]);
    vp.add(t);
    
    testdiv.appendChild(document.createElement("p"));
    
    r = new root("50%", "100px", "div#test");
    vp = new viewport("0px", "0px", "50%", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p);
    
    testdiv.appendChild(document.createElement("p"));
    div = document.createElement("div")
    div.setAttribute("style", "display: flex; flex-direction: row");
    div.setAttribute("id", "row1");
    testdiv.appendChild(div);
    
    r = new root("auto", "auto", "div#row1");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    
    r = new root("auto", "auto", "div#row1");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    
    r = new root("auto", "auto", "div#row1");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    
    r = new root("auto", "auto", "div#row1");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    
    r = new root("auto", "auto", "div#row1");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    
    r = new root("auto", "auto", "div#row1");
    vp = new viewport("0px", "0px", "100px", "1px", [0, 1], [1, 0], false);
    r.setContent(vp);
    
    testdiv.appendChild(document.createElement("p"));
    div = document.createElement("div")
    div.setAttribute("style", "display: flex; flex-direction: row");
    div.setAttribute("id", "row2");
    testdiv.appendChild(div);
    
    r = new root("auto", "auto", "div#row2");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p);
    
    r = new root("auto", "auto", "div#row2");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p, "resize");
    
    r = new root("auto", "auto", "div#row2");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p, "rescale");
    
    r = new root("auto", "auto", "div#row2");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p, "grow");
    
    r = new root("auto", "auto", "div#row2");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p, "zoom");
    
    r = new root("auto", "auto", "div#row2");
    vp = new viewport("0px", "0px", "100px", "1px", [0, 1], [1, 0], false);
    r.setContent(vp);
    xa = new xaxis();
    vp.add(xa, "static", "resize");
    
    testdiv.appendChild(document.createElement("p"));
    div = document.createElement("div")
    div.setAttribute("style", "display: flex; flex-direction: row");
    div.setAttribute("id", "row3");
    testdiv.appendChild(div);
    
    r = new root("auto", "auto", "div#row3");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p);
    p = new points([1.5], [1.5]);
    vp.add(p);
    
    r = new root("auto", "auto", "div#row3");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p, "resize");
    p = new points([1.5], [1.5]);
    vp.add(p, "resize");
    
    r = new root("auto", "auto", "div#row3");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p, "rescale");
    p = new points([1.5], [1.5]);
    vp.add(p, "rescale");
    
    r = new root("auto", "auto", "div#row3");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p, "grow");
    p = new points([1.5], [1.5]);
    vp.add(p, "grow");
    
    r = new root("auto", "auto", "div#row3");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p, "zoom");
    p = new points([1.5], [1.5]);
    vp.add(p, "zoom");
    
    testdiv.appendChild(document.createElement("p"));
    div = document.createElement("div")
    div.setAttribute("style", "display: flex; flex-direction: row");
    div.setAttribute("id", "row4");
    testdiv.appendChild(div);
    
    r = new root("auto", "auto", "div#row4");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p);
    p = new points([1.5], [1.5]);
    vp.add(p);
    t = new text(["static"], [0], [0]);
    vp.add(t);
    
    r = new root("auto", "auto", "div#row4");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p, "resize");
    p = new points([1.5], [1.5]);
    vp.add(p, "resize");
    t = new text(["resize"], [0], [0]);
    vp.add(t, "resize");
    
    r = new root("auto", "auto", "div#row4");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p, "rescale");
    p = new points([1.5], [1.5]);
    vp.add(p, "rescale");
    t = new text(["rescale"], [0], [0]);
    vp.add(t, "rescale");
    
    r = new root("auto", "auto", "div#row4");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p, "grow");
    p = new points([1.5], [1.5]);
    vp.add(p, "grow");
    t = new text(["grow"], [0], [0]);
    vp.add(t, "grow");
    
    r = new root("auto", "auto", "div#row4");
    vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
    r.setContent(vp);
    p = new points([.1, .2, .3], [.2, .1, .3]);
    vp.add(p, "zoom");
    p = new points([1.5], [1.5]);
    vp.add(p, "zoom");
    t = new text(["zoom"], [0], [0]);
    vp.add(t, "zoom");   
}
