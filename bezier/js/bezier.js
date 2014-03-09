
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

/////////////////////////////
// TEMPLATE
/////////////////////////////


function Game()
{
	// Set game variables
	this.clearColor = "#220022";
	this.strokeColor = "#00aa22";
	
	this.start = new Vec2(Global.canvasWidth/2, Global.canvasHeight/2);
	this.end = new Vec2(200,20);
	
	
	this.points = [];
	this.pointAmount = 100;
	
	this.controlPoints = [];
	this.movedPoints = [];
	this.movedStartPoints = [];
	this.controlPointAmount = 100;
	
	this.moveAngle = 2*Math.PI / this.pointAmount;
	this.moveStartAngle = 2*Math.PI / this.pointAmount;
}

Game.prototype.init = function()
{
	// Init all game objects
	
	var x = 0.0;
	var y = 0.0;
	var angle = 2*Math.PI / this.pointAmount;
	var pointVector = new Vec2(200, 0);
	var controlPointVector = new Vec2(450,0);
	
	for(var i = 0; i < this.pointAmount; i++)
	{
		
		this.points.push(new Vec2(pointVector.x, pointVector.y));
		this.movedStartPoints.push(new Vec2(pointVector.x, pointVector.y));
		
		this.controlPoints.push(new Vec2(controlPointVector.x, controlPointVector.y));
		this.movedPoints.push(new Vec2(controlPointVector.x, controlPointVector.y));
		pointVector.rotate(angle);
		controlPointVector.rotate(angle + angle /2);
	}
}

Game.prototype.update = function(deltaTime)
{
	// Take input
	// Update all objects
	
	// control points
	var rotated = new Vec2(0,0);
	for(var i = 0; i < this.controlPointAmount; i++)
	{
		rotated = Vec2Rotate(this.controlPoints[i], this.moveAngle);
		this.movedPoints[i].copy(rotated);
	
	}
	this.moveAngle += 1.0 * deltaTime;
	if(this.moveAngle > 2 * Math.PI)
	{
		this.moveAngle = 0.0;
	}
	
	// start points
	for(var i = 0; i < this.controlPointAmount; i++)
	{
		rotated = Vec2Rotate(this.points[i], this.moveStartAngle);
		this.movedStartPoints[i].copy(rotated);
	
	}
	this.moveStartAngle -= 3.0 * deltaTime;
	if(this.moveAngle < 0.0)
	{
		this.moveAngle = 2 * Math.PI;
	}
	
	
}

Game.prototype.draw = function()
{
	// Draw all objects
	// lets draw a bezier curve
	c = Global.context;
	c.beginPath();
	c.fillStyle = this.clearColor;
	c.fillRect(0,0, Global.canvasWidth, Global.canvasHeight);
	
	for(var i = 0; i < this.pointAmount; i++)
	{
		c.beginPath();
		c.strokeStyle = this.strokeColor;
		c.moveTo(this.start.x, this.start.y);
		//c.moveTo(this.start.x + this.points[i].x,
		//		this.start.y + this.points[i].y);
		//c.lineTo(this.start.x + this.points[i].x, this.start.y + this.points[i].y);
		c.quadraticCurveTo(this.start.x + this.movedPoints[i].x, 
						   this.start.y + this.movedPoints[i].y,
							this.start.x + this.movedStartPoints[i].x, 
						   this.start.y + this.movedStartPoints[i].y);
						   
		c.stroke();
		
	}
	
	/*
	c.beginPath();
	c.strokeStyle = this.strokeColor;
	c.moveTo(this.start.x, this.start.y);
	c.quadraticCurveTo(this.controlPoint.x, this.controlPoint.y, 
						this.end.x, this.end.y);
	c.stroke();
	c.beginPath();
	c.moveTo(this.start.x, this.start.y);
	c.lineTo(this.controlPoint.x, this.controlPoint.y);
	c.stroke();
	*/
}


/////////////////////////
// Template
/////////////////////////

Global.initGame = function()
{
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
  Global.context = canvas.getContext("2d");
  if(Global.context != null)
  {
	  console.log("Got context from Canvas");
  }
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


