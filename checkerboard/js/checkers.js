
/** Javascript that shows a moving checkers pattern */

var Global = new Object();
Global.context = null;
Global.canvasHeight = 0;
Global.canvasWidth = 0;
Global.game = null;
Global.nowTime = 0;
Global.lastTime = 0;
Global.deltaTime = 0;
Global.squareSize = 40;
Global.squareHalf = Global.squareSize / 2.0;

function Square(x, y)
{
  this.posX = x + Global.squareHalf;
  this.posY = y + Global.squareHalf;
  this.startx = this.posX - Global.squareHalf;
  this.starty = this.posY - Global.squareHalf;
  this.color = "#ffffff";
  this.colorOne = true;
  
  //console.log("Created square at " + this.startx + " " + this.starty );
}
  
Square.prototype.startX = function()
{
	return this.startx;
}
Square.prototype.startY = function()
{
	return this.starty;
}


Square.prototype.setColor = function(color)
{
	this.color = color;
}


function Game()
{
  
  this.colorOne = new Color(250/255, 181/255, 255/255);
  this.firstColor = this.colorOne.getString();
  this.colorTwo = new Color(58/255, 113/255, 160/255);
  this.secondColor = this.colorTwo.getString();
  //console.debug("Colors are" + this.firstColor + " " + this.secondColor);
  this.squares = [];
  this.amountSquares = 0;
  
  this.squareNormal = new Vec3(0.0, 1.0, 0.0);

  // Area borders
  this.drawingStartX = 0.0;
  this.drawingStartY = 0.0;
  this.drawingEndX = 0.0;
  this.drawingEndY = 0.0;
  this.drawingWidth = 0.0;
  this.drawingHeight = 0.0;
  
  // Checkers drawing start point
  this.checkerStartX = 0.0;
  this.checkerStartY = 0.0;
  
  // Moving checkers
  this.moveSpeedX = 0;//Global.squareSize;
  this.moveSpeedY = 0;
  this.moveSpeedTargetX = 0;
  this.moveSpeedTargetY = 0;
  this.moveSpeedMax = Global.squareSize;
  this.changeSpeedCounter = 2.0;
  this.changeSpeedInterval = 2.0;
  this.moveCX = 0.0;
  this.moveCY = 0.0;
}

Game.prototype.calculateColors = function()
{
	// Dot products everywhere
	/* For both colors in the game
	 * Fill the array with new colors calculated by
	 * lightPos = Vec3(0,1,0)
	 * move tilepos and calculate dots
	 *  ! just calculate with dots 0.1 ... 1.0
	 */
	
	 var dot = 0.0;
	 var r,g,b;
	 
	 //console.log("Light color " + this.light.color.getString());
	 
	 for( var i = 0; i < 10.0; i++)
	 {
		 r = (this.colorOne.r  + (this.colorOne.r * (this.light.color.r * dot)));
		 g = (this.colorOne.g  + (this.colorOne.g * (this.light.color.g * dot)));
		 b = (this.colorOne.b  + (this.colorOne.b * (this.light.color.b * dot)));
		 //console.log("ColorOne at dot " + dot + " : " + r + "," + g + "," + b);
		 Global.colorOneArray.push( (new Color(r,g,b)).getString() );
		 
		 r = (this.colorTwo.r + (this.colorTwo.r * this.light.color.r * dot));
		 g = (this.colorTwo.g + (this.colorTwo.g * this.light.color.g * dot));
		 b = (this.colorTwo.b + (this.colorTwo.b * this.light.color.b * dot));
		 //console.log("ColorTwo at dot " + dot + " : " + r + "," + g + "," + b);
		 Global.colorTwoArray.push( (new Color(r,g,b)).getString());
		 
		 dot += 0.1;
	 }
	 for( var i = 0; i < 10.0; i++)
	 {
		// console.log("1:" + i + " " + Global.colorOneArray[i]);
		// console.log("2:" + i + " " + Global.colorTwoArray[i]);
	 }
	 
}

Game.prototype.init = function()
{
	console.log("Game.init()");
	console.log("Canvas is " + Global.canvasWidth + " " + Global.canvasHeight);
	
	this.drawingEndX = Global.canvasWidth - this.drawingStartX;
	this.drawingEndY = Global.canvasWidth - this.drawingStartY;
	this.drawingWidth = this.drawingEndX - this.drawingStartX;
	this.drawingHeight = this.drawingEndY - this.drawingStartY;
	
    var squaresPerWidth = this.drawingWidth / Global.squareSize;
    var squaresPerHeight = this.drawingHeight / Global.squareSize;
	
	squaresPerWidth = Math.ceil(squaresPerWidth);
	squaresPerHeight = Math.ceil(squaresPerHeight);
	
	// add extra for panning
	squaresPerWidth = squaresPerWidth + 2;
	squaresPerHeight = squaresPerHeight + 2;


    // The drawing starting point !
    this.checkerStartX = this.drawingStartX - Global.squareSize;
    this.checkerStartY = this.drawingStartY - Global.squareSize;
    
    console.log("Drawing area" + this.drawingStartX + "," + this.drawingStartY);
    console.log("Drawing area" + this.drawingWidth + "," + this.drawingHeight);
    console.log("Drawing area" + this.drawingEndX + "," + this.drawingEndY);
    
    
    var runningX = 0;
    var runningY = 0;
    
    var useColorOne = true;
    var lineStartColor = useColorOne;
    // Create squares in the array
    this.amountSquares = squaresPerWidth * squaresPerHeight;
	console.log("Amount squares is " + this.amountSquares);

    for(var i = 0; i < this.amountSquares; i++)
    {
      
      this.squares[i] =  new Square( runningX, runningY);
      if(useColorOne)
      {
        this.squares[i].setColor(this.firstColor);
      } 
      else 
      {
        this.squares[i].setColor(this.secondColor);
      }
      this.squares[i].colorOne = useColorOne;
      
      useColorOne = !useColorOne;
      
      
      if(runningX + Global.squareSize >= (squaresPerWidth * Global.squareSize))
      {
        runningX = 0.0;
        runningY += Global.squareSize;
        useColorOne = !lineStartColor;
        lineStartColor = !lineStartColor;
      }
      else
      {
		 runningX += Global.squareSize;
	  }
      
    }
    
 }

 

Game.prototype.update = function(deltaTime)
{
	if( deltaTime > 0.5)
	{
		return 0;
	}
	
	this.checkerStartX = this.checkerStartX + this.moveSpeedX * deltaTime;
	this.checkerStartY = this.checkerStartY + this.moveSpeedY * deltaTime;
	
	
	if(this.checkerStartX >= this.drawingStartX)
	{
		this.checkerStartX = this.drawingStartX - (Global.squareSize * 2);
		
	}
	
	else if(this.checkerStartX <= this.drawingStartX - (Global.squareSize * 2))
	{
		this.checkerStartX = this.drawingStartX;
		
	}
	
	
	if(this.checkerStartY >= this.drawingStartY)
	{
		this.checkerStartY = this.drawingStartY - (Global.squareSize * 2);
		
	}
	else if(this.checkerStartY <= this.drawingStartY - (Global.squareSize *2))
	{
		this.checkerStartY = this.drawingStartY;
		
	}
	
	//Global.context.translate( this.drawingWidth/2, this.drawingHeight/2);
	
	//Global.context.translate( 0, 0);

	this.changeSpeedCounter += deltaTime;
	if(this.changeSpeedCounter >= this.changeSpeedInterval)
	{
		this.changeSpeedCounter = 0.0;
		var which = Math.random();
		if(which < 0.5)
		{
			do{
				this.moveSpeedX +=  10 - (Math.random() * 20);
			}
			while( Math.abs(this.moveSpeedX) < 5.0);
		}
		else
		{
			do{
				this.moveSpeedY +=  10 - (Math.random() * 20);
				}
			while( Math.abs(this.moveSpeedY) < 5.0);
		}
		//console.log("new targets " + this.moveSpeedTargetX + " " +  this.moveSpeedTargetY);
		
	}
}

Game.prototype.lightSquares = function()
{
	 //dot = Dot(normal, pointToLight.normalized) -> dot = 0.0 ... 1.0
	 // dot *= 10.0  -> dot = 0.x .... 10.x
	 // Math.floor(dot);
	
	
	var s = null;
	var l = this.light.pos;
	var dot = 0.0;
	var squarePos = new Vec3(0,0,0);
	var toLight = null;
	var r,g,b;
	
	for(var i = 0; i < this.amountSquares; i++)
    {
		s = this.squares[i];
		squarePos.x = this.checkerStartX + 10 + s.posX;
		squarePos.z = this.checkerStartY + 10 + s.posY;
		
		toLight = Vec3Minus(this.light.pos, squarePos);
		toLight.normalize();
		dot = Vec3Dot(this.squareNormal, toLight);
		
		/* wild test 
		
		
		
		if(s.colorOne)
		{
			r = (this.colorOne.r + (this.colorOne.r * (this.light.color.r *20 * dot)));
			g = (this.colorOne.g + (this.colorOne.g * (this.light.color.g  *20 * dot)));
			b = (this.colorOne.b + (this.colorOne.b * (this.light.color.b  *20 * dot)));
			 
			s.color = (new Color(r,g,b)).getString();
			//console.log(s.color);
		}
		else
		{
			s.color = Global.colorTwoArray[dot];
			//console.log("Got Color " + this.secondColor);
		}
		*/
		

		dot *= 1000.0;
		if( dot > 9.0)
		{ 
			dot = 9.0;
		}
		dot = Math.floor(dot);
		console.log("Square at " + s.posX + " " + s.posY + " dot" + dot + " color " + s.colorOne);
		
		if(dot >= 0.0 && dot < 10)
		{
			if(s.colorOne)
			{
				s.color = Global.colorOneArray[dot];
				console.log("Got array Color " + Global.colorOneArray[dot]);
			}
			else
			{
				s.color = Global.colorTwoArray[dot];
				console.log("Got Color " + this.secondColor);
			}
		}
		else
		{
			console.log("Dot out of bounds");
		}
		
		
	}
}

Game.prototype.drawArea = function()
{
	var c = Global.context;
	c.beginPath();
	
	c.strokeStyle = "rgba(0,0,0, 0.3)";
	c.lineWidth = 10.0;
	c.strokeRect(0,0,400,400);
	c.closePath();
	/*
	c.moveTo(this.drawingStartX, this.drawingStartY);
	c.lineTo(this.drawingEndX, this.drawingStartY);
	c.lineTo(this.drawingEndX, this.drawingEndY);
	c.lineTo(this.drawingStartX, this. drawingEndY);
	c.lineTo(this.drawingStartX, this.drawingStartY);
	c.strokeStyle = "white";
	c.stroke();
	c.closePath();
	*/
}

Game.prototype.drawColors = function()
{
	var c = Global.context;
	for(var i = 0; i < 10; i++)
	{
		c.fillStyle = Global.colorOneArray[i];
		c.beginPath();
		c.rect(i * 10,0, 10, 10);
		c.fill();
		c.closePath();
		
	}
	for(var i = 0; i < 10; i++)
	{
		
		c.fillStyle = Global.colorTwoArray[i];
		c.beginPath();
		c.fillRect( i * 10,10, 10, 10);
		c.closePath();
	}
}

Game.prototype.drawCheckers = function()
{
	var c = Global.context;
	
	// Clear
	c.fillStyle = "black";
	c.fillRect(0, 0, Global.canvasWidth, Global.canvasHeight);
	
	var s = null;
	for(var i = 0; i < this.amountSquares; i++)
    {
		s = this.squares[i];
		
		c.beginPath();
		c.fillStyle = s.color;
		c.rect( this.checkerStartX + s.startX(), this.checkerStartY + s.startY(), Global.squareSize, Global.squareSize);
		c.fill();
		c.closePath();
	
	}
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
    Global.game.drawCheckers();
    Global.game.drawArea();
    
    Global.lastTime = Global.nowTime;
    
    requestAnimFrame(Global.runGame);
}

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
