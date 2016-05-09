var c = document.getElementById('canv');
var $ = c.getContext("2d");
w = c.width = window.innerWidth;
h = c.height = window.innerHeight;
var num = 550;
var pov = 80;
var diff = 20;

var cols = ["#F74545", "#FFAC78", "#FFE2A8", "#6A9C92", "#9FC299", "#C2E0CA", "#A5A9AC", "#A07C88", "#D6D4BD", "#FDCA49"];

var _diff = diff * diff;
var _pov = pov * pov;
var area = new A($, c.width, c.height);

var anim = function() {
  window.requestAnimationFrame(anim);
  area.group();
  area.draw();
};

function A($, w, h) {
  var _this = this;
  _this.msp = null;
  
  var arr = [];

  _this.rndCol = function() {
    return cols[Math.random() * cols.length | 0];
  };

  _this.group = function() {
    var msp = _this.msp;

    for (var i = 0; i < arr.length; i++) {
      arr[i].reset();
    }

    for (var i = 0; i < arr.length - 1; i++) {
      var p1 = arr[i];
      for (var j = i + 1; j < arr.length; j++) {
        var p2 = arr[j];
        var d = (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);

        if (d < _diff) {
          p1.addDiff(p2);
          p2.addDiff(p1);
        }
        if (d < _pov) {
          p1.incPOV(p2);
          p2.incPOV(p1);
        }
      }
    }

    for (var i = 0; i < arr.length; i++) {
      var p = arr[i];
      p.lineup();
      p.apart(msp);
      p.togeth();
    }

    for (var i = 0; i < arr.length; i++) {
      var p = arr[i];
      p.mv();
      p.x = move(p.x, 0, w);
      p.y = move(p.y, 0, h);
    }
  };

  _this.draw = function() {
    $.fillStyle = ' #25242B';
    $.fillRect(0, 0, c.width, c.height);
     t = "LEGIONS".split("").join(String.fromCharCode(0x2004));
  $.font = "4.5em Philosopher";
  $.fillStyle = '#504F55';
  $.fillText(t, (c.width - $.measureText(t).width) * 0.5, c.height * 0.5);
    for (var i = 0; i < arr.length; i++) {
      arr[i].draw($);
    }
  };

  for (var i = 0; i < num; i++) {
    var x = Math.random() * w;
    var y = Math.random() * h;
    var col = _this.rndCol();
    arr.push(new Part(x, y, col));
  }
}

function Part(x, y, col) {
  var _this = this;
  _this.x = x;
  _this.y = y;
  _this.vx = 0.0;
  _this.vy = 0.0;
  _this.ax = 0.0;
  _this.ay = 0.0;
  var povArr = [];
  var diffArr = [];

  _this.incPOV = function(p) {
    povArr.push(p);
  };

  _this.addDiff = function(p) {
    diffArr.push(p);
  };

  _this.reset = function() {
    diffArr.length = 0;
    povArr.length = 0;
  };

  _this.lineup = function() {
    for (var i = 0; i < povArr.length; i++) {
      var p = povArr[i];
      _this.ax += (p.vx - _this.vx) * 0.01;
      _this.ay += (p.vy - _this.vy) * 0.01;
    }
  };

  _this.apart = function(msp) {
    for (var i = 0; i < diffArr.length; i++) {
      var p = diffArr[i];
      var d = (_this.x - p.x) * (_this.x - p.x) + (_this.y - p.y) * (_this.y - p.y);
      _this.ax -= (p.x - _this.x) * (_diff - d) * 0.0001;
      _this.ay -= (p.y - _this.y) * (_diff - d) * 0.0001;
    }

    if (msp !== null) {
      var d = (_this.x - msp.x) * (_this.x - msp.x) + (_this.y - msp.y) * (_this.y - msp.y);
      if (d < _pov) {
        _this.ax -= (msp.x - _this.x) * (_pov - d) * 0.00005;
        _this.ay -= (msp.y - _this.y) * (_pov - d) * 0.00005;
      }
    }
  };

  _this.togeth = function() {
    if (povArr.length > 0) {
      var bx = 0;
      var by = 0;
      for (var i = 0; i < povArr.length; i++) {
        var p = povArr[i];
        bx += p.x;
        by += p.y;
      }

      bx /= povArr.length;
      by /= povArr.length;

      _this.ax += (bx - _this.x) * 0.002;
      _this.ay += (by - _this.y) * 0.002;
    }
  };

  _this.mv = function() {
    _this.ax *= 0.6;
    _this.ay *= 0.6;
    var vmax = 5.0;
    _this.vx = max(_this.vx + _this.ax, -vmax, vmax);
    _this.vy = max(_this.vy + _this.ay, -vmax, vmax);
    _this.x = _this.x + _this.vx;
    _this.y = _this.y + _this.vy;
  };

  _this.draw = function($) {
    var sz = 9 + (Math.abs(_this.vx) + Math.abs(_this.vy)) * 0.5;
    var g = $.createRadialGradient(_this.x,_this.y,0,_this.x,_this.y,sz);
    g.addColorStop(1, col);
    g.addColorStop(0.7, col);
    g.addColorStop(0.6, '#25242B');
    g.addColorStop(0.4, '#25242B');
    g.addColorStop(0.3, '#EFF2EB');
    g.addColorStop(0, '#EFF2EB');
    $.fillStyle = g;
    $.beginPath();
    $.arc(_this.x, _this.y, sz, 0, Math.PI * 2, true);
    $.fill();
  };
}

var max = function(v, min, max) {
  var calc = v;
  if (v < min) {
    calc = min;
  } else if (max < v) {
    calc = max;
  }
  return calc;
};

var move = function(v, min, max) {
  var calc = v;
  if (v < min) {
    calc += (max - min);
  } else if (max < v) {
    calc -= (max - min);
  }
  return calc;
};
window.addEventListener('mousedown',function(e) {
    area.msp = {
      x: e.clientX,
      y: e.clientY
    };
});

window.addEventListener('mouseup',function(e) {
    area.msp = null;
});
window.addEventListener('touchstart',function(e){
  e.preventDefault();
  area.msp = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
});
window.addEventListener('touchend',function(e) {
    area.msp = null;
});
anim();