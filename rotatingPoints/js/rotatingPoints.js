/**
	Basic template for future javascript demos
*/


var Global = new Object();
Global.canvas = null;
Global.context = null;
Global.canvasHeight = 0;
Global.canvasWidth = 0;

Global.game = null;

Global.nowTime = 0;
Global.lastTime = 0;
Global.deltaTime = 0;

var GLcontext = new Object();

// NOTA BENE must be gl_Position.w == 1.0 , otherwise nothing is visible!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 
GLcontext.VSHADER_SOURCE = 
"attribute vec4 attribPosition; 	\n" +
"attribute float attribPointSize; 	\n" +
"attribute vec3 attribColor;		\n" +
"uniform vec4 unifTranslation;		\n" +
"uniform float unifCosAngle;		\n" +
"uniform float unifSinAngle;		\n" +
"varying vec4 varyColor;			\n" +
"void main() 		\n" + 
"{					\n" +
"					\n" + 
"	gl_Position.x = attribPosition.x * unifCosAngle - attribPosition.y * unifSinAngle; \n" +
"	gl_Position.y = attribPosition.x * unifSinAngle + attribPosition.y * unifCosAngle; \n" +
"   gl_Position.z = attribPosition.z;	\n" +
"	gl_Position.w = 1.0;	\n" +
"	gl_Position = gl_Position + unifTranslation; 	\n" +
"	gl_PointSize = attribPointSize; \n" +
"	varyColor = vec4(attribColor, 1.0); \n" +
"}									\n";
 
GLcontext.FSHADER_SOURCE = 
"precision mediump float;		\n" +
"varying vec4 varyColor;		\n" +
"void main()		\n" +
"{ 				\n" +
"	gl_FragColor = varyColor; \n" +
"}					\n";
 
GLcontext.attribPosition = -1;
GLcontext.attribPointSize = -1;
GLcontext.attribColor = -1;
GLcontext.unifTranslation = -1;

GLcontext.points = new Float32Array([0.0, 0.0, 0.0,		// pos 
										1.0, 				// size
										1.0, 1.0, 1.0		// color
										]);
							
GLcontext.floatSize = GLcontext.points.BYTES_PER_ELEMENT;
GLcontext.vertexSize =  7 * GLcontext.floatSize;
GLcontext.positionOffset = 0 * GLcontext.floatSize;
GLcontext.sizeOffset =  3 * GLcontext.floatSize;
GLcontext.colorOffset = 4 * GLcontext.floatSize;

GLcontext.initGL = function()
{
	gl = Global.context;
	// init shaders // Connect power to the shader systems!
	if(!initShaders(gl, GLcontext.VSHADER_SOURCE, GLcontext.FSHADER_SOURCE))
	{
		console.error("Failed to init shaders, captain");
		return;
	}

	// Get addresses of attribs
	GLcontext.attribPosition = gl.getAttribLocation(gl.program, "attribPosition");
	if( GLcontext.attribPosition < 0) 
	{
		console.error("Failed to get the position of attribPosition from WebGL");
		return;
	}
	GLcontext.attribPointSize = gl.getAttribLocation(gl.program, "attribPointSize");
	if( GLcontext.attribPointSize < 0)
	{
		console.error("Failed to get the position of attribPointSize from WebGL");
		return;
	}
	GLcontext.attribColor = gl.getAttribLocation(gl.program, "attribColor");
	if( GLcontext.attribColor < 0)
	{
		console.error("Failed to get the position of attribColor from WebGL");
	}
	
	// Get addresses of uniforms
	GLcontext.unifTranslation = gl.getUniformLocation(gl.program, "unifTranslation");
	if( GLcontext.unifTranslation < 0)
	{
		console.error("Failed to get the position of unifTranslation from WebGL");
	}
	
	GLcontext.unifCosAngle = gl.getUniformLocation(gl.program, "unifCosAngle");
	if( GLcontext.unifCosAngle < 0)
	{
		console.error("Failed to get the position of unifCosAngle from WebGL");
	}
	
	GLcontext.unifSinAngle = gl.getUniformLocation(gl.program, "unifSinAngle");
	if( GLcontext.unifSinAngle < 0)
	{
		console.error("Failed to get the position of unifSinAngle from WebGL");
	}
		
}

function PointSphere()
{
	this.mesh = new Mesh();
	
	var pos = new Vec3(0.2, 0.2, 0.0);
	var size = 20.0;
	var color = new Color(0.2, 0.1, 0.0);
	
	// Generate points
	var verticesAmount = 10;
	var angleAdd = (Math.PI * 2.0) / verticesAmount;
	console.log(angleAdd);
	var angle =  0.0;
	var x = 0.3;
	var y = 0.0;
	var cos = 0.0;
	var sin = 0.0;
	for( var i = 0; i < verticesAmount; i++)
	{
	
		cos = Math.cos(angle);
		sin = Math.sin(angle);
		
		pos.x = (x * cos - y * sin);
		pos.y = (x * sin + y * cos);
		
		//console.log("cos: " + cos + " sin: " + sin + " X: "  + pos.x + " Y: " + pos.y);
		
		color.g += 0.9 / verticesAmount;
		size += 30.0 / verticesAmount;
		
		this.mesh.vertices.push( new Vertex( pos, size, color));
		angle += angleAdd;
	}
	
	this.mesh.fillBuffer(Global.context);
}


function Game()
{
	// Set game variables
	this.backgroundColor = new Color(0.2, 0.2, 0.2, 1.0);
	this.rotateAngle = 0.0;
	
}

Game.prototype.init = function()
{
	// Init all game objects
	this.sphere = new PointSphere();
	
	console.log("input to shader : Angle " +  this.sphere.mesh.angle );
	console.log("input to shader : cosAngle and sinAngle " +  Math.cos(this.sphere.mesh.angle) + " " +  Math.sin(this.sphere.mesh.angle));
	
	var cos = Math.cos(this.sphere.mesh.angle);
	var sin = Math.sin(this.sphere.mesh.angle);
	var x = this.sphere.mesh.vertices[0].position.x;
	var y = this.sphere.mesh.vertices[0].position.y;
	console.log("X: " + (x * cos - y * sin));
	console.log("Y: " + (x * sin + y * cos));
	
	
}

Game.prototype.update = function(deltaTime)
{
	// Take input
	// Update all objects
	this.sphere.mesh.angle += 0.9 * deltaTime;
	if( this.sphere.mesh.angle > 2 * Math.PI)
	{
		this.sphere.mesh.angle = 0.0;
	}
	
	this.rotateAngle += 0.2 * deltaTime;
	if( this.rotateAngle > 2 * Math.PI)
	{
		this.rotateAngle = 0.0;
	}
}

Game.prototype.drawMesh = function(mesh)
{
	gl = Global.context;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
	
	gl.vertexAttribPointer(GLcontext.attribPosition, 3, gl.FLOAT, false, 
								GLcontext.vertexSize, GLcontext.positionOffset);
	gl.enableVertexAttribArray(GLcontext.attribPosition);

	gl.vertexAttribPointer(GLcontext.attribPointSize, 1, gl.FLOAT, false, 
									GLcontext.vertexSize, GLcontext.sizeOffset);
	gl.enableVertexAttribArray(GLcontext.attribPointSize);

	gl.vertexAttribPointer(GLcontext.attribColor, 3, gl.FLOAT, false, 
									GLcontext.vertexSize, GLcontext.colorOffset);
	gl.enableVertexAttribArray(GLcontext.attribColor);
	
	// uniforms
	var cos = Math.cos(this.rotateAngle);
	var sin = Math.sin(this.rotateAngle);
	var x = this.sphere.mesh.translation.x;
	var y = this.sphere.mesh.translation.y;
	var nx =  (x * cos - y * sin);
	var ny =  (x * sin + y * cos);
	
	gl.uniform4f(GLcontext.unifTranslation, nx, ny, mesh.translation.z, 0.0);
	gl.uniform1f(GLcontext.unifCosAngle, Math.cos(mesh.angle) );
	gl.uniform1f(GLcontext.unifSinAngle, Math.sin(mesh.angle) );
	
	//
	gl.drawArrays(gl.POINTS, 0, mesh.amountVertices);
	//
	
	gl.disableVertexAttribArray(GLcontext.attribPosition);
	gl.disableVertexAttribArray(GLcontext.attribPointSize);
	gl.disableVertexAttribArray(GLcontext.attribColor);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

Game.prototype.draw = function()
{
	// Draw all objects
	gl = Global.context;
	gl.clearColor(this.backgroundColor.r, 
				  this.backgroundColor.g,
				  this.backgroundColor.b,
				  this.backgroundColor.a);
	gl.clear(gl.COLOR_BUFFER_BIT);
	this.drawMesh(this.sphere.mesh);
}

/////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////

Global.initGame = function()
{
	
	GLcontext.initGL();
	Global.game.init();
}

Global.runGame = function()
{
	Global.nowTime = new Date().getTime();
    Global.deltaTime = Global.nowTime - Global.lastTime;
    Global.deltaTime = Global.deltaTime / 1000.0;

	// loop de loop
    Global.game.update(Global.deltaTime);
    Global.game.draw();
    
    Global.lastTime = Global.nowTime;
    
    requestAnimFrame(Global.runGame);
}

function Init()
{
	Global.canvas = document.getElementById("canvas");
	var gl = getWebGLContext(canvas);
	if(!gl)
	{
		console.log("Failed to get WebGL context");
		return;
	}
	Global.context = gl;
	Global.canvasHeight = canvas.height;
	Global.canvasWidth = canvas.width;
	Global.game = new Game();
	Global.initGame();
	Global.lastTime = new Date().getTime();
	Global.runGame();
}

window.onload = function()
{
  Init();
} 

window.requestAnimFrame = (function()
{
  return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( callback, element) {
          window.setTimeout(callback, 1000/60);
          };
})();

console.log("Javascript running"); 
