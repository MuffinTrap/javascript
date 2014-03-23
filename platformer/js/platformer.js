/** Trying out a little platformer games */

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

function Player()
{
	this.position = new Vec2(0,0);
	this.velocity = new Vec2(0,0);
	this.walkSpeed = 50.0;
	this.jumpSpeed = 60.0;
	this.width = 40.0;
	this.height = 80.0;
	this.color = "#ffffff";
	this.onGround = true;
	
	this.keyLeft = KeyListener.Key_LeftArrow;
	this.keyRight = KeyListener.Key_RightArrow;
	this.keyJump = KeyListener.Key_UpArrow;
	
	KeyListener.initKey(this.keyLeft);
	KeyListener.initKey(this.keyRight);
	KeyListener.initKey(this.keyJump);
}


// Vec2 	position
Player.prototype.setPosition = function(position)
{
	this.position.copy(position);
}

Player.prototype.takeInput = function()
{
	this.velocity.x = 0.0;
	if(KeyListener.isKeyDown(this.keyLeft))
	{
		this.velocity.x -= this.walkSpeed;
	}
	else if( KeyListener.isKeyDown(this.keyRight))
	{
		this.velocity.x += this.walkSpeed;
	}
	
	if(this.onGround && KeyListener.isKeyDown(this.keyJump))
	{
		this.velocity.y -= this.jumpSpeed;
		this.onGround = false;
	}
}

Player.prototype.update = function(deltaTime)
{
	
	this.takeInput();
	
	if(!this.onGround)
	{
		this.velocity.addDelta(Global.game.level.gravity, deltaTime);
	}
	
	this.position.addDelta(this.velocity, deltaTime);
	
	if(!this.onGround)
	{
		if(this.position.y > Global.game.level.groundLevel - this.height)
		{
			console.log("Player hit ground");
			this.onGround = true;
			this.position.y = Global.game.level.groundLevel - this.height;
			this.velocity.y = 0.0;
		}
	}
	
}

// Vec2 	position
// context 	c 
Player.prototype.draw = function(position, c)
{
	
	c.beginPath();
	c.fillStyle = this.color;
	c.fillRect(this.position.x, this.position.y, this.width, this.height);
}

function Camera( drawingSize, idleArea )
{
	this.position = new Vec2(0,0);
	this.drawingSize = new Vec2(drawingSize.x, drawingSize.y);
	
	this.idleArea = new Vec2(idleArea.x, idleArea.y);
}

function Level()
{
	this.gravity = new Vec2(0, 80);
	this.groundLevel = 300.0;
	
}

function Game()
{
	// Set game variables
	this.player = new Player();
	this.backgroundColor = "#111111";
	this.level = new Level();
	
}

Game.prototype.init = function()
{
	// Init all game objects
	this.player.setPosition( new Vec2( 20, 200));
	console.log("Player " + this.player.color +" "+ this.player.position.x  +" "+ this.player.position.y  +" "+ this.player.width  +" "+ this.player.height);
}

Game.prototype.update = function(deltaTime)
{
	// Take input
	// Update all objects
	this.player.update(deltaTime);
}

Game.prototype.draw = function()
{
	// Draw all objects
	Global.context.fillStyle = this.backgroundColor;
	Global.context.fillRect(0,0, Global.canvasWidth, Global.canvasHeight);
	this.player.draw( new Vec2(20, 200), Global.context);
}

////////////////////////////////////////////////////

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
