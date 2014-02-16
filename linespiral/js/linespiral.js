/** JavaScript demo that draws spiralling lines */

/**
 * next up. multiple targetpoints
 * moving targetpoints
 * inner ring??
*/
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
	this.targetOffset = new Vec3(0,0,0);
	
	this.calculatePosition = function()
	{
		// Calculate position
		
		if(this.position < 0.0)
		{
			this.position += Global.canvasRimLength;
		}
		
		
		
		
		if(this.position >= Global.canvasRimLength)
		{
			this.position -= Global.canvasRimLength;
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
	//console.log("Linepoint is at position " + this.position + " X: " + this.x + " Y: " + this.y);
}

Global.getPositionAt = function(position, refOffset)
{
	var x = 0;
	var y = 0;
	
		// Calculate position
		
		if(position < 0.0)
		{
			position += Global.canvasRimLength;
		}
		
		if(position >= Global.canvasRimLength)
		{
			position -= Global.canvasRimLength;
		}
		
		
		// On top
		if(position <= Global.canvasWidth)
		{
			x = position;
			y = 0;
		}
		// on right side
		else if(position > Global.canvasWidth 
				&& position <= Global.canvasWidth + Global.canvasHeight)
		{
			x = Global.canvasWidth;
			y = position - Global.canvasWidth;
		}
		// Bottom
		else if(position > Global.canvasWidth + Global.canvasHeight
				&& position < Global.canvasWidth * 2 + Global.canvasHeight)
		{
			x = Global.canvasWidth - (position - (Global.canvasWidth + Global.canvasHeight));
			y = Global.canvasHeight;
		}
		
		// left side
		else
		{
			x = 0;
			y = Global.canvasHeight - (position - ((Global.canvasWidth * 2) + Global.canvasHeight));
		}
		
	refOffset.x = x;
	refOffset.y = y;
}


// A collection of linepoints that are drawn together
function LineGroup(amountPoints, targetOffset, amountTargets, moveSpeed, color)
{
	this.amountPoints = amountPoints;
	this.targetOffset = targetOffset;
	
	this.targetPositionOffset = 0.0;
	this.positionOffsetMin = 0.0;
	this.positionOffsetMax = 0.0;
	this.positionOffsetSpeed = 0;
	this.offsetOscillating = false;
	
	if(this.targetOffset >= this.amountPoints)
	{
		this.targetOffset = this.amountPoints -1;
		console.log("ERROR: targetOffset >= than amount of points:" + amountPoints);
	}
	this.amountTargets = amountTargets;
	if(this.amountTargets < 0 || this.amountTargets >= amountPoints)
	{
		this.amountTargets = 1;
		console.log("ERROR: amountTargets has a silly value:" + amountTargets);
	}
	this.moveSpeed = moveSpeed;
	this.lineColorStart = color;
	
	/*
	this.lineGradient = Global.context.createLinearGradient(0, 0, 600, 0);
	this.lineGradient.addColorStop(0, this.lineColorStart.getStringRGBA());
	this.lineGradient.addColorStop(1, this.lineColorMiddle.getStringRGBA());
	*/
	
	
	this.lineColorStr =  this.lineColorStart.getStringRGBA();
	
	this.linePoints = [];
	
	this.createPoints();
	
}

LineGroup.prototype.setOffsets = function( startingOffset, offsetSpeed, oscillating, offsetMin, offsetMax)
{
	this.targetPositionOffset = startingOffset;
	this.positionOffsetSpeed = offsetSpeed;
	this.offsetOscillating = oscillating;
	if( this.offsetOscillating)
	{
		this.positionOffsetMin = offsetMin;
		this.positionOffsetMax = offsetMax;
	}
	console.log(this.positionOffsetMin + " " + this.positionOffsetMax);
	
}

LineGroup.prototype.createPoints = function()
{
	// Create points
	var distanceBetween = Global.canvasRimLength / this.amountPoints;
	var firstpoint = distanceBetween / 2;
	
	for(var i = 0; i < this.amountPoints; i++)
	{
		this.linePoints.push( new Linepoint( firstpoint + (i * distanceBetween), 
							 this.moveSpeed));
	}
}

LineGroup.prototype.draw = function()
{
	var targetPoint = 0;
	var c = Global.context;
	var targetX = 0;
	var targetY = 0;
	
	c.strokeStyle = this.lineColorStr;
	
	for(var i = 0; i < this.amountPoints; i++)
	{
		for( var t = 0; t < this.amountTargets; t++)
		{
			targetPoint = i + t + this.targetOffset;
			while(targetPoint >= this.amountPoints)
			{
				targetPoint -= this.amountPoints;
			}
			
			
			Global.getPositionAt(this.linePoints[targetPoint].position + this.targetPositionOffset, 
								 this.linePoints[i].targetOffset );
			targetX = this.linePoints[i].targetOffset.x;
			targetY = this.linePoints[i].targetOffset.y;
			
			// This also resets the path
			c.beginPath();
			c.moveTo( this.linePoints[i].x, this.linePoints[i].y);
			c.lineTo(  targetX, targetY);
			c.stroke();
		}
	}
	
}

LineGroup.prototype.update = function(deltaTime)
{
	for(var i = 0; i < this.amountPoints; i++)
	{
		this.linePoints[i].update(deltaTime);
	}
	
	
	// slow down on oscillation ends
	if( this.offsetOscillating)
	{
		var speed = this.positionOffsetSpeed;
		if( speed > 0)
		{
			var diff = this.positionOffsetMax - this.targetPositionOffset;
			speed = diff * 0.5;
			speed += diff * 0.1;
		}
		if( speed < 0)
		{
			var diff = this.positionOffsetMin - this.targetPositionOffset;
			speed = diff * 0.5;
			speed += diff * 0.1;
		}
	}
	
	this.targetPositionOffset += speed  * deltaTime;
	
	//console.log(this.targetPositionOffset);
	
	if(this.offsetOscillating)
	{
		
		if( this.targetPositionOffset < this.positionOffsetMin + 0.1)
		{
			console.log("oscillation!" + this.targetPositionOffset + " < " + this.positionOffsetMin);
			this.positionOffsetSpeed *= -1.0;
		}
		else if( this.targetPositionOffset > this.positionOffsetMax - 0.1)
		{
			console.log("oscillation!" + this.targetPositionOffset + " > " + this.positionOffsetMax);
			this.positionOffsetSpeed *= -1.0;
		}
	}
	else 
	{
		if( this.targetPositionOffset > Global.canvasRimLength)
		{
			this.targetPositionOffset -= Global.canvasRimLength;
		}
		else if( this.targetPositionOffset < 0.0)
		{
			this.targetPositionOffset += Global.canvasRimLength;
		}
	}
}

// amountPoints = 5
// targetOffset = 2  makes a pentagram

function Game()
{

	this.clearColor = new Color(0.0, 0.0, 0.0, 0.9);
	
	
	Global.context.fillStyle = this.clearColor.getStringRGBA();
	Global.context.lineWidth = 2.0;
	Global.canvasRimLength = Global.canvasWidth * 2 
							 + Global.canvasHeight * 2;
	
	console.log("RimLength is " + Global.canvasRimLength);
	this.lineGroups = [];
	this.amountGroups = 0;
}

Game.prototype.randomLineGroup = function()
{
	// 2 to the power of at least 2 
	var points = Math.ceil( Math.random()* 64 );
	if( points < 3)
	{
		points = 3;
	}
	var pointSkip = Math.floor( Math.random() * points); // just to be sure
	if( pointSkip < 1)
	{
		pointSkip = 1;
	}
	var amountTargets = Math.ceil( Math.random() * 5); // just to be sure
	if( amountTargets < 3)
	{
		amountTargets = 2;
	}
	var movespeed = 100.0 - Math.random() * 200;
	var color = new Color( Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.5);
	
	console.debug("Randomised new LineGroup with " + points + " points. " + pointSkip + " skip " + amountTargets +
	" targets " + movespeed + " moveSpeed and Color: " + color.getStringRGBA() );
	
	var lineGroup = new LineGroup(points, pointSkip, amountTargets, movespeed, color);
	
	var startingOffset = 10 - Math.random() * 20;
	var offsetSpeed = 100 - Math.random() * 200;
	var oscillating = Math.random();
	var offsetMin = 0;
	var offsetMax = 0;
	if( oscillating < 0.5)
	{
		oscillating = false;
	}
	else
	{
		oscillating = true;
	}
	if( oscillating )
	{
		offsetMin = Math.random() * -Global.canvasRimLength;
		
		offsetMax = Math.random() * Global.canvasRimLength 
		
	}
	lineGroup.setOffsets( startingOffset, offsetSpeed, oscillating, offsetMin, offsetMax);
	console.debug("Randomised new LineGroup with " + startingOffset + " start offset. " + offsetSpeed + " speed " + oscillating +
	" oscillation between " + offsetMin + " - " + offsetMax );
	return lineGroup;
	
	
}

Game.prototype.init = function()
{
	// Create groups
	var blueColor = new Color(0.1, 0.1, 0.7, 0.9);
	var purpleColor = new Color(0.9, 0.1, 0.6, 0.9);
	var pinkColor = new Color(0.7, 0.5, 0.9, 0.5);
	
	// Setting the jump to  lineamount / 2 means it goes straight accross
	
	
	
	//this.lineGroups.push( new LineGroup(16, 4, 3, 30, blueColor)); // Whee
	//this.lineGroups[0].setOffsets( 0, 100, true, -100, 100);
	//this.lineGroups.push( new LineGroup(24, 10, -60, purpleColor));
	//this.lineGroups.push( new LineGroup(24, 13, -90, pinkColor));
	
	this.lineGroups.push( this.randomLineGroup());
	this.lineGroups.push( this.randomLineGroup());
	this.lineGroups.push( this.randomLineGroup());
	this.lineGroups.push( this.randomLineGroup());
	this.lineGroups.push( this.randomLineGroup());
	this.lineGroups.push( this.randomLineGroup());
	
	this.amountGroups = this.lineGroups.length;
	
}

Game.prototype.movePoints = function(deltaTime)
{
	
	for(var i = 0; i < this.amountGroups; i++)
	{
		this.lineGroups[i].update(deltaTime);
	}
	
}

// Draw line from each point to another point
Game.prototype.draw = function()
{
	var c = Global.context;
	
	c.fillRect(0, 0, Global.canvasWidth, Global.canvasHeight);
	
	for(var i = 0; i < this.amountGroups; i++)
	{
		this.lineGroups[i].draw();
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


