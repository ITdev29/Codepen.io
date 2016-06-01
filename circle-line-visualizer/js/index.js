/*=============================================
Variables
=============================================*/

var c,
	ctx,
	w,
	h,
	lines,
	tick,
	tau,
	scale,
	base,
	gui,
	config;

/*=============================================
Utility
=============================================*/

function rand( min, max ) {
	return Math.random() * ( max - min ) + min;
}

function normalizeFromCenter( val, max ) {
	return ( max / 2 - Math.abs( ( max / 2 ) - val ) ) / max * 2;
}

/*=============================================
Configuration
=============================================*/

base = [
	{
		name: 'radius',
		default: 150,
		min: 3,
		max: 300,
		step: 1,
		randomize: 1
	},
	{
		name: 'lineCount',
		default: 100,
		min: 3,
		max: 200,
		step: 1,
		randomize: 1
	},
	{
		name: 'lineWidth',
		default: 3,
		min: 1,
		max: 6,
		step: 1,
		randomize: 1
	},
	{
		name: 'length',
		default: 10,
		min: 1,
		max: 100,
		step: 1,
		randomize: 1
	},
	{
		name: 'lengthMove',
		default: 10,
		min: 0,
		max: 100,
		step: 1,
		randomize: 1
	},
	{
		name: 'offset',
		default: 1,
		min: 0,
		max: 100,
		step: 1,
		randomize: 1
	},
	{
		name: 'speed',
		default: 0.005,
		min: 0.001,
		max: 0.015,
		step: 0.001,
		randomize: 1
	},
	{
		name: 'spin',
		default: 0.005,
		min: -0.02,
		max: 0.02,
		step: 0.001,
		randomize: 1
	},
	{
		name: 'pulse',
		default: 0.1,
		min: 0,
		max: 0.2,
		step: 0.001,
		randomize: 1
	},
	{
		name: 'hueBase',
		default: 30,
		min: 0,
		max: 360,
		step: 1,
		randomize: 1
	},
	{
		name: 'hueRange',
		default: 30,
		min: 0,
		max: 90,
		step: 1,
		randomize: 1
	}
];
gui = new dat.GUI();
config = {};

base.forEach( function( opt ) {
	config[ opt.name ] = opt.default;
	var controller = gui.add( config, opt.name ).min( opt.min ).max( opt.max ).step( opt.step ).listen();
	controller.onChange( reset );
});

config.randomize = function() {
	base.forEach( function( opt ) {
		if( opt.randomize ) {
			config[ opt.name ] = Math.ceil( rand( opt.min, opt.max ) / opt.step ) * opt.step;
		}
	});
	reset();
}

gui.add( config, 'randomize' );

/*=============================================
Lines
=============================================*/

function Line( opt ) {
	this.angle = opt.angle;
	this.cos = Math.cos( this.angle );
	this.sin = Math.sin( this.angle );
	this.length = opt.length;
	this.lengthMove = opt.lengthMove;
	this.baseRadius = opt.radius;
	this.radius = this.baseRadius;
	this.offset = opt.offset;
	this.hue = opt.hue;
	this.p1x = null;
	this.p1y = null;
	this.p2x = null;
	this.p2y = null;
}

Line.prototype.step = function() {
	this.radius = this.baseRadius + Math.sin( ( Date.now() + this.offset ) * config.speed ) * this.lengthMove;
	this.p1x = this.cos * ( this.radius - this.length / 2 );
	this.p1y = this.sin * ( this.radius - this.length / 2 );
	this.p2x = this.cos * ( this.radius + this.length / 2 );
	this.p2y = this.sin * ( this.radius + this.length / 2 );
};

Line.prototype.draw = function() {
	ctx.beginPath();
	ctx.moveTo( this.p1x, this.p1y );
	ctx.lineTo( this.p2x, this.p2y );
	ctx.strokeStyle = 'hsla(' + this.hue + ', 70%, 50%, 1)';
	ctx.stroke();
};

/*=============================================
Scene
=============================================*/

function init() {
	c = document.querySelector( 'canvas' );
	ctx = c.getContext( '2d' );
	lines = [];
	tick = 0;
	tau = Math.PI * 2;
	config.randomize();
	reset();
	loop();
}

function reset() {
	w = innerWidth;
	h = innerHeight;
	lines.length = 0;
	for( var i = 0; i < config.lineCount; i++ ) {
		lines.push( new Line({
			angle: i / config.lineCount * tau - Math.PI / 2,
			length: config.length,
			lengthMove: config.lengthMove,
			radius: config.radius,
			offset: ( normalizeFromCenter( i, config.lineCount ) * config.offset ) / config.speed,
			hue: config.hueBase + rand( -config.hueRange / 2, config.hueRange / 2 )
		}));
	}
	c.width = w;
	c.height = h;
	ctx.lineWidth = config.lineWidth;
	ctx.globalCompositeOperation = 'lighter';
}

function step() {
	var i = lines.length;
	while( i-- ) { lines[ i ].step() }
	tick++;
}

function draw() {
	ctx.clearRect( 0, 0, w, h );
	ctx.save();
		ctx.translate( w / 2, h / 2 );
		scale = 0.9 + Math.sin( tick * config.pulse ) * 0.1;	
		ctx.scale( scale, scale );
		ctx.fillStyle = 'hsla(' + config.hueBase + ', 70%, 50%, 0.1)';
		ctx.beginPath();
		ctx.arc( 0, 0, config.radius / 3, 0, tau );
		ctx.fill();
		ctx.beginPath();
		ctx.arc( 0, 0, config.radius / 3 * 2, 0, tau );
		ctx.fill();
		ctx.beginPath();
		ctx.arc( 0, 0, config.radius - config.lineWidth / 2, 0, tau );
		ctx.fill();
		ctx.beginPath();
		ctx.arc( 0, 0, config.radius, 0, tau );
		ctx.strokeStyle = 'hsla(' + config.hueBase + ', 70%, 50%, 0.5)';
		ctx.stroke();
		ctx.rotate( tick * config.spin );
		var i = lines.length;
		while( i-- ) { lines[ i ].draw() }
	ctx.restore();
}

function loop() {
	requestAnimationFrame( loop );
	step();
	draw();
}

addEventListener( 'resize', reset );

init();