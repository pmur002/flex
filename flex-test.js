
r = new root("50%", "100px", "body");

vp = new viewport(0, 0, "100px", "100px", [0, 1], [1, 0]);
r.setContent(vp);

p = new points([.1, .2, .3], [.2, .1, .3]);
vp.add(p);

document.body.appendChild(document.createElement("p"));

r = new root("50%", "100px", "body");

vp = new viewport(0, 0, "50%", "100px", [0, 1], [1, 0]);
r.setContent(vp);

p = new points([.1, .2, .3], [.2, .1, .3]);
vp.add(p);

document.body.appendChild(document.createElement("p"));



// vp = new viewport(0, 0, 100, 100, [0, 1], [1, 0]);
// vp.init();
// 
// vp = new viewport(0, 0, 100, 100, [0,1], [1,0]);
// vp.init();
// 
// vp = new viewport(0, 0, 100, 100, [0,1], [1,0]);
// vp.init();
// 
// vp = new viewport(0, 0, 100, 100, [0,1], [1,0]);
// vp.init();
// 
// vp = new viewport(0, 0, 100, 100, [0,1], [1,0]);
// vp.init();
// 
// vp = new viewport(0, 0, 100, 1, [0, 1], [1, 0], false);
// vp.init();
// 
// document.body.appendChild(document.createElement("p"));
// 
// vp = new viewport(0, 0, 100, 100, [0, 1], [1, 0]);
// vp.init();
// p = new points([.1, .2, .3], [.2, .1, .3]);
// vp.add(p);
// 
// vp = new viewport(0, 0, 100, 100, [0,1], [1,0]);
// vp.init();
// p = new points([.1, .2, .3], [.2, .1, .3]);
// vp.add(p, "resize");
// 
// vp = new viewport(0, 0, 100, 100, [0,1], [1,0]);
// vp.init();
// p = new points([.1, .2, .3], [.2, .1, .3]);
// vp.add(p, "rescale");
// 
// vp = new viewport(0, 0, 100, 100, [0,1], [1,0]);
// vp.init();
// p = new points([.1, .2, .3], [.2, .1, .3]);
// vp.add(p, "grow");
// 
// vp = new viewport(0, 0, 100, 100, [0,1], [1,0]);
// vp.init();
// p = new points([.1, .2, .3], [.2, .1, .3]);
// vp.add(p, "zoom");
// 
// vp = new viewport(0, 0, 100, 1, [0, 1], [1, 0], false);
// vp.init();
// xa = new xaxis();
// vp.add(xa, "static", "resize");
// 
// document.body.appendChild(document.createElement("p"));
// 
// vp = new viewport(0, 0, 100, 100, [0, 1], [1, 0]);
// vp.init();
// p = new points([.1, .2, .3], [.2, .1, .3]);
// vp.add(p);
// p = new points([1.5], [1.5]);
// vp.add(p);
// 
// vp = new viewport(0, 0, 100, 100, [0,1], [1,0]);
// vp.init();
// p = new points([.1, .2, .3], [.2, .1, .3]);
// vp.add(p, "resize");
// p = new points([1.5], [1.5]);
// vp.add(p, "resize");
// 
// vp = new viewport(0, 0, 100, 100, [0,1], [1,0]);
// vp.init();
// p = new points([.1, .2, .3], [.2, .1, .3]);
// vp.add(p, "rescale");
// p = new points([1.5], [1.5]);
// vp.add(p, "rescale");
// 
// vp = new viewport(0, 0, 100, 100, [0,1], [1,0]);
// vp.init();
// p = new points([.1, .2, .3], [.2, .1, .3]);
// vp.add(p, "grow");
// p = new points([1.5], [1.5]);
// vp.add(p, "grow");
// 
// vp = new viewport(0, 0, 100, 100, [0,1], [1,0]);
// vp.init();
// p = new points([.1, .2, .3], [.2, .1, .3]);
// vp.add(p, "zoom");
// p = new points([1.5], [1.5]);
// vp.add(p, "zoom");
// 
// document.body.appendChild(document.createElement("p"));
// 
// vp = new viewport(0, 0, 100, 100, [0, 1], [1, 0]);
// vp.init();
// p = new points([.1, .2, .3], [.2, .1, .3]);
// vp.add(p);
// p = new points([1.5], [1.5]);
// vp.add(p);
// t = new text(["static"], [0], [0]);
// vp.add(t);
// 
// vp = new viewport(0, 0, 100, 100, [0,1], [1,0]);
// vp.init();
// p = new points([.1, .2, .3], [.2, .1, .3]);
// vp.add(p, "resize");
// p = new points([1.5], [1.5]);
// vp.add(p, "resize");
// t = new text(["resize"], [0], [0]);
// vp.add(t, "resize");
// 
// vp = new viewport(0, 0, 100, 100, [0,1], [1,0]);
// vp.init();
// p = new points([.1, .2, .3], [.2, .1, .3]);
// vp.add(p, "rescale");
// p = new points([1.5], [1.5]);
// vp.add(p, "rescale");
// t = new text(["rescale"], [0], [0]);
// vp.add(t, "rescale");
// 
// vp = new viewport(0, 0, 100, 100, [0,1], [1,0]);
// vp.init();
// p = new points([.1, .2, .3], [.2, .1, .3]);
// vp.add(p, "grow");
// p = new points([1.5], [1.5]);
// vp.add(p, "grow");
// t = new text(["grow"], [0], [0]);
// vp.add(t, "grow");
// 
// vp = new viewport(0, 0, 100, 100, [0,1], [1,0]);
// vp.init();
// p = new points([.1, .2, .3], [.2, .1, .3]);
// vp.add(p, "zoom");
// p = new points([1.5], [1.5]);
// vp.add(p, "zoom");
// t = new text(["zoom"], [0], [0]);
// vp.add(t, "zoom");
// 
// 
