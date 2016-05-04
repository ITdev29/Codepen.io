var c = document.getElementById("canv"),
$ = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight;

function arcs(x, y, r) {
  $.beginPath();
  $.arc(x, y, r, 0, Math.PI*2, false);
  $.fill();
  $.strokeStyle = "transparent"; 
  $.stroke();
}

function cmul(w, z) {
  return [
    w[0] * z[0] - w[1] * z[1],
    w[0] * z[1] + w[1] * z[0]
  ];
}

function modulus(p) {
  return Math.sqrt(p[0] * p[0] + p[1] * p[1]);
}

function crecip(z) {
  var d = z[0] * z[0] + z[1] * z[1];
  return [z[0] / d, -z[1] / d];
}

function spiral(r, st, delta, opts) {
  var rd = crecip(delta),
    md = modulus(delta),
    mrd = 1 / md,
    colidx = opts.i,
    cols = opts.fill,
    min_d = opts.min_d,
    max_d = opts.max_d;

  for (var q = st, mod_q = modulus(q); mod_q < max_d; 
     q = cmul(q, delta), mod_q *= md) {
    $.fillStyle = cols[colidx];
    arcs(q[0], q[1], mod_q * r);
    colidx = (colidx + 1) % cols.length;
  }
  colidx = ((opts ? opts.i : 0) + cols.length - 1) % cols.length;
  for (var q = cmul(st, rd), mod_q = modulus(q); mod_q > min_d; 
    q = cmul(q, rd), mod_q *= mrd) {
    $.fillStyle = cols[colidx];
    arcs(q[0], q[1], mod_q * r);
    colidx = (colidx+ cols.length - 1) % cols.length;
  }
}

var p = 15,
    q = 27;
var root = doyle(p, q);
var rep = 800;

function anim(t) {
  $.setTransform(1, 0, 0, 1, 0, 0);
  $.clearRect(0, 0, c.width, c.height);
  $.translate(Math.round(c.width / 2),Math.round(c.height / 2));
  var sc = Math.pow(root.mod_a, t);
  $.scale(sc, sc);
  $.rotate(root.arg_a * t);
  var min_d = 1 / sc,
      max_d = c.width * 2;
  var beg = root.a;
  for (var i = 0; i < q; i++) {
    spiral(root.r, beg, root.a, {
      fill: ["#F4E18E", "#D03029","#61A291"],
      i: i % 3,
      min_d: min_d,
      max_d: max_d
    });
    beg = cmul(beg, root.b);
  }
}
var fst;
function run(ts) {
  if (!fst) fst = ts;
  anim(((ts - fst) % (rep * 3)) / rep);
  window.requestAnimationFrame(run);
}
run();