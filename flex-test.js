
r = new root("50%", "100px", "body");
vp = new viewport("0px", "0px", "100px", "100px", [0, 1], [1, 0]);
r.setContent(vp);
p = new points([.1, .2, .3], [.2, .1, .3]);
vp.add(p);
t = new text(["test"], ["100% - 20px"], ["100% - 10px"]);
vp.add(t);

document.body.appendChild(document.createElement("p"));

r = new root("50%", "100px", "body");
vp = new viewport("0px", "0px", "50%", "100px", [0, 1], [1, 0]);
r.setContent(vp);
p = new points([.1, .2, .3], [.2, .1, .3]);
vp.add(p);

document.body.appendChild(document.createElement("p"));
div = document.createElement("div")
div.setAttribute("style", "display: flex; flex-direction: row");
div.setAttribute("id", "row1");
document.body.appendChild(div);

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

document.body.appendChild(document.createElement("p"));
div = document.createElement("div")
div.setAttribute("style", "display: flex; flex-direction: row");
div.setAttribute("id", "row2");
document.body.appendChild(div);

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

document.body.appendChild(document.createElement("p"));
div = document.createElement("div")
div.setAttribute("style", "display: flex; flex-direction: row");
div.setAttribute("id", "row3");
document.body.appendChild(div);

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

document.body.appendChild(document.createElement("p"));
div = document.createElement("div")
div.setAttribute("style", "display: flex; flex-direction: row");
div.setAttribute("id", "row4");
document.body.appendChild(div);

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


