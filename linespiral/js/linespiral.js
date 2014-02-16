/** JavaScript demo that draws spiralling lines */

var Global = new Object();
Global.context = null;
Global.canvasWidth = 0;
Global.canvasHeight = 0;
Global.canvasRimLength = 0;
Global.game = null;

Global.nowTime = 0;
Global.prevTime = 0;
Global.deltaTime = 0;




/** A point that travels around the edges of the
 * canvas area 
 * position  : Position clockwise from upper left corner
 * movespeed : > 0 clockwise, < 0 anti-clockwise
 * 
 * */
 
 
function Linepoint(position, movespeed)
{
	this.position = position;
	this.movespeed = movespeed;
	this.x = 0;
	this.y = 0;
	
	this.calculatePosition = function()
	{
		
		
		// Calculate position
		/*
		if(this.position < 0.0)
		{
			this.position += Global.canvasRimLength;
		}
		*/
		
		
		
		if(this.position >= 1600)
		{
			console.log("Position reached limit " + this.position);
			this.position -= Global.canvasRimLength;
			console.log("new position is " + this.position);
		}
		
		
		// On top
		if(this.position <= Global.canvasWidth)
		{
			this.x = this.position;
			this.y = 0;
		}
		// on right side
		else if(this.position > Global.canvasWidth 
				&& this.position <= Global.canvasWidth + Global.canvasHeight)
		{
			this.x = Global.canvasWidth;
			this.y = this.position - Global.canvasWidth;
		}
		// Bottom
		else if(this.position > Global.canvasWidth + Global.canvasHeight
				&& this.position < Global.canvasWidth * 2 + Global.canvasHeight)
		{
			this.x = Global.canvasWidth - (this.position - (Global.canvasWidth + Global.canvasHeight));
			this.y = Global.canvasHeight;
		}
		
		// left side
		else
		{
			this.x = 0;
			this.y = Global.canvasHeight - (this.position - ((Global.canvasWidth * 2) + Global.canvasHeight));
		}
		
	}
	
	this.update = function(deltaTime)
	{
		
		this.position += this.movespeed * deltaTime;
		this.calculatePosition();
	}
	
	this.calculatePosition();
	console.log("Linepoint is at position " + this.position + " X: " + this.x + " Y: " + this.y);
}


function Game()
{
	this.amountPoints = 5;
	this.targetOffset = 2;
	this.lineColorStart = new Color(0.1, 0.1, 1.0, 0.9);
	this.lineColorMiddle = new Color(0.7, 0.1, 0.7, 0.1);
	
	this.lineGradient = Global.context.createLinearGradient(0, 0, 600, 0);
	this.lineGradient.addColorStop(0, this.lineColorStart.getStringRGBA());
	this.lineGradient.addColorStop(1, this.lineColorMiddle.getStringRGBA());
	
	
	this.clearColor = new Color(0.0, 0.0, 0.0, 0.09);
	this.lineColorStr =  this.lineColorStart.getStringRGBA();
	this.runUpdate = true;
	
	Global.context.fillStyle = this.clearColor.getStringRGBA();
	
	//console.log("StrokeColor is " + this.lineColor.getStringRGBA());
	
	
	this.linePoints = [];
	Global.canvasRimLength = Global.canvasWidth * 2 
							 + Global.canvasHeight * 2;
	
	console.log("RimLength is " + Global.canvasRimLength);
	
}

Game.prototype.init = function()
{
	// Create points
	var distanceBetween = Global.canvasRimLength / this.amountPoints;
	var firstpoint = distanceBetween / 2;
	var moveSpeed = 30.0;
	
	for(var i = 0; i < this.amountPoints; i++)
	{
		this.linePoints.push( new Linepoint( firstpoint + (i * distanceBetween), 
							 moveSpeed));
	}
	
}

Game.prototype.movePoints = function(deltaTime)
{
	if(!this.runUpdate)
	{
		return;
	}
	
	for(var i = 0; i < this.amountPoints; i++)
	{
		this.linePoints[i].update(deltaTime);
	}
	
	// DEBUGH
}

// Draw line from each point to another point
Game.prototype.draw = function()
{
	
	
	var targetPoint = 0;
	
	var c = Global.context;
	
	c.fillRect(0, 0, Global.canvasWidth, Global.canvasHeight);
	
	c.strokeStyle = this.lineColorStr;
	
	for(var i = 0; i < this.amountPoints; i++)
	{
		targetPoint = i + this.targetOffset;
		if(targetPoint >= this.amountPoints)
		{
			targetPoint -= this.amountPoints;
		}
		
		// This also resets the path
		c.beginPath();
		c.moveTo( this.linePoints[i].x, this.linePoints[i].y);
		c.lineTo( this.linePoints[targetPoint].x, 
					this.linePoints[targetPoint].y);
		c.stroke();
	}
		
}

Game.prototype.update = function(deltaTime)
{
	this.movePoints(deltaTime);
	this.draw();
}




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
    
    Global.lastTime = Global.nowTime;
    
    requestAnimFrame(Global.runGame);
}
///// TEMPLATE STUFF //////////////////

function Init()
{
  var canvas = document.getElementById("canvas");
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


