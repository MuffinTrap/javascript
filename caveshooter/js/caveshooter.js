/**
	Two player cave shooter game in javascript
	TODO > 
	Ship class : 
	Draw ship
	Enable controls
	Rotate ship
	Move ship
	Collide on screen borders
	Shoot bullets
	* bullets hit ships and walls
	* stars on the background
*/

/**
	Basic template for future javascript demos
*/


var Global = new Object();
Global.context = null;
Global.canvasHeight = 0;
Global.canvasWidth = 0;

Global.game = null;

Global.nowTime = 0;
Global.lastTime = 0;
Global.deltaTime = 0;

Global.gravity = new Vec2(0.0, 10.0);

// Key listener //////////////////////

var KeyListener = new Object();
KeyListener.Key_LeftArrow 	= 37;
KeyListener.Key_UpArrow 	= 38;
KeyListener.Key_RightArrow 	= 39;
KeyListener.Key_DownArrow 	= 40;

KeyListener.Key_I 	= 73;
KeyListener.Key_J	= 74;
KeyListener.Key_K 	= 75;
KeyListener.Key_L 	= 76;
KeyListener.Key_B 	= 66;


KeyListener.Key_W 	= 87;
KeyListener.Key_A	= 65;
KeyListener.Key_S 	= 83;
KeyListener.Key_D 	= 68;
KeyListener.Key_TAB = 9;

KeyListener.Key_Q = 81;

KeyListener.keys = [];

KeyListener.keyDownHandler = function(event)
{
	// Save the time when key was pressed
	if(KeyListener.keys[event.keyCode] == 0.0)
	{
		KeyListener.keys[event.keyCode] = new Date().getTime();
		//console.log("Key " + String.fromCharCode(event.keyCode) + " pressed");
	}
}

KeyListener.keyUpHandler = function(event)
{
	// Clear the time to 0.0 which is also false
	if(KeyListener.keys[event.keyCode] > 0.0)
	{
		KeyListener.keys[event.keyCode] = 0.0;
	}
}

document.addEventListener("keydown", KeyListener.keyDownHandler, false);
document.addEventListener("keyup", KeyListener.keyUpHandler, false);



//////////////////////////////////////

function Star()
{
	this.randomInit = function(colourAmount)
	{
		this.size = Math.round(Math.random() * 4.0);
		var value = Math.floor(Math.random() * colourAmount);
		this.color = value;
	}
	
	this.init = function(x,y)
	{
		this.position = new Vec2(x,y);
	}
}

function BackgroundStars(canvasWidth, canvasHeight)
{
	this.stars = [];
	this.starAmount = 100;
	
	this.starColors = [];
	var starColor;
	var size = 0;
	for( var s = 0.3; s < 1.0; s += 0.1)
	{
		starColor = new Color(s,s,s);
		this.starColors.push(starColor.getString());
		size++;
	}
	
	var randomY = 0;
	var interval = canvasWidth / this.starAmount;
	for(var i = 0; i < this.starAmount; i++)
	{
		this.stars.push(new Star());
		randomY = Math.random() * canvasHeight;
		this.stars[i].init(i * interval, randomY);
		this.stars[i].randomInit( size ); 
	}
}
	
	


function Bullet()
{
	this.position = new Vec2(0,0);
	this.velocity = new Vec2(0,0);
	this.acceleration = new Vec2(0,0);
	this.startSpeed = 100.0;
	this.speed = this.startSpeed;
	this.active = false;
	this.size = 8;
	this.damage = 10.0;
}

Bullet.prototype.collisionWithLevel = function(level)
{
	if(this.position.x >= level.width || this.position.x <= 0.0)
	{
		//console.log("Bullet hit wall");
		return true;
	}
	if(this.position.y >= level.height || this.position.y <= 0.0)
	{
		//console.log("Bullet hit wall");
		return true;
	}
	return false;
}

Bullet.prototype.collisionWithShip = function(ship)
{
	if(ship.position.x >= this.position.x - this.size/2)
	{
		if(ship.position.x <= this.position.x + this.size/2)
		{
			if(ship.position.y >= this.position.y - this.size/2)
			{
				if(ship.position.y <= this.position.y + this.size/2)
				{	
					//console.log("Bullet collided with ship");
					ship.getHit(this.damage);
					return true;
					
				}
			}
		}
	}
}		

Bullet.prototype.update = function(deltaTime, level)
{
	this.velocity.add( Vec2Multiply(Global.gravity,deltaTime));
	this.position.add( Vec2Multiply(this.velocity, deltaTime));
	
	if(this.collisionWithLevel(level))
	{
		this.active = false;
	}
	if(this.collisionWithShip(Global.game.shipOne))
	{
		this.active = false;
	}
	else if(this.collisionWithShip(Global.game.shipTwo))
	{
		this.active = false;
	}
}

function BulletPool(poolSize)
{
	this.poolSize = poolSize;
	this.bullets = [];
	
	for(var i = 0; i < poolSize; i++)
	{
		this.bullets.push( new Bullet);
	}
}

BulletPool.prototype.createBullet = function(barrelPosition, shipDirection, shipVelocity)
{
	for(var i = 0; i < this.poolSize; i++)
	{
		if(this.bullets[i].active == false)
		{
			var bullet = this.bullets[i];
			bullet.active = true;
			bullet.position.copy(barrelPosition);
			var ownSpeed = Vec2Multiply(shipDirection, bullet.startSpeed);
			bullet.velocity = Vec2Add( ownSpeed, shipVelocity);
			break;
		}
	}
}

BulletPool.prototype.update = function(deltaTime, level)
{
	for(var i = 0; i < this.poolSize; i++)
	{
		if(this.bullets[i].active == true)
		{	
			this.bullets[i].update(deltaTime, level);
		}
	}
}

function Level()
{
	this.width = 800;
	this.height = 800;
}

function Ship()
{
	this.size = 3;
	this.lineWidth = 2;
	this.color = null;
	this.hitPointColor = null;
	
	this.speed = 0.0;
	this.speedIncrease = 60.0;
	this.speedMax = 100.0;
	this.turnSpeed = Math.PI / 1.3;
	this.hitPoints = 100.0;
	this.hitPointsMax = 100.0;
	this.score = 0.0;
	
	this.keyForward = 0;
	this.keyLeft = 0;
	this.keyRight = 0;
	this.keyFire = 0;
	
	// Bullets
	this.bulletCounter = 0.0;
	this.bulletInterval = 1.0;
	
	// Vertices
	this.leftPoint = new Vec2(-4.0, 8.0);
	this.frontPoint = new Vec2(0.0, -8.0);
	this.rightPoint = new Vec2(4.0, 8.0);
	this.backPoint = new Vec2(0.0, 8.0);
	this.barrelPoint = new Vec2(0.0, -12.0);
	
	this.position = new Vec2(0.0, 0.0);
	
	this.velocity = new Vec2(0.0, 0.0);
	
	this.acceleration = new Vec2(0.0, 0.0);
	
	this.angle = 0.0;
	this.direction = Vec2UnitVector(this.angle - (Math.PI /2));
	
}

Ship.prototype.init = function(position, color, bulletPool, keyForward, keyLeft, keyRight, keyFire)
{
	this.position = position;
	this.color = color;
	this.bulletPool = bulletPool;
	
	// Save keys
	this.keyForward = keyForward;
	this.keyLeft = keyLeft;
	this.keyRight = keyRight;
	this.keyFire = keyFire;
	console.log("Ship key forward is "+ keyForward +" "  + String.fromCharCode(keyForward));
	console.log("Ship key left is " + String.fromCharCode(keyLeft));
	console.log("Ship key right is " + String.fromCharCode(keyRight));
	console.log("Ship key fire is " + String.fromCharCode(keyFire));
	
	// init keys
	KeyListener.keys[this.keyForward] 	= 0.0;
	KeyListener.keys[this.keyLeft]	 	= 0.0;
	KeyListener.keys[this.keyRight] 	= 0.0;
	KeyListener.keys[this.keyFire] 		= 0.0;
	
}

Ship.prototype.randomNewPlace = function()
{
	this.position.x = Math.random() * Global.game.level.width;
	this.position.y = Math.random() * Global.game.level.height;
	this.hitPoints = this.hitPointsMax;
}

Ship.prototype.draw = function()
{
	var c = Global.context;
	var left = Vec2Add( this.position, Vec2Rotate(this.leftPoint, this.angle));
	var front = Vec2Add( this.position, Vec2Rotate(this.frontPoint, this.angle));
	var right = Vec2Add( this.position, Vec2Rotate(this.rightPoint,this.angle));
	var back = Vec2Add( this.position, Vec2Rotate(this.backPoint,this.angle));
	
	c.strokeStyle = this.color;
	c.lineWidth = this.lineWidth;
	c.beginPath();
	c.moveTo(left.x, left.y);
	c.lineTo(front.x, front.y);
	c.lineTo(right.x, right.y);
	c.stroke();
	
	// Draw afterburner
	c.strokeStyle = "#ffff00";
	c.lineWidth = 6;
	c.beginPath();
	
	var behind = Vec2Rotate(this.frontPoint, this.angle + Math.PI );
	behind.mul(3.0 * (this.speed / this.speedMax));
	var behind = Vec2Add( back, behind);
	c.moveTo(back.x, back.y);
	c.lineTo(behind.x, behind.y);
	c.stroke();
}



Ship.prototype.collisionWith = function(object)
{
	if(this.position.x >= object.position.x)
	{
		if(this.position.x <= object.position.x + object.width)
		{
			if(this.position.y >= object.position.y)
			{
				if(this.position.y <= object.position.y + object.height)
				{
					return true;
				}
			}
		}
	}
	return false;
}

Ship.prototype.collisionWithLevel = function(level)
{
		if(this.position.x >= level.width || this.position.x <= 0.0)
		{
			return true;
		}
		if(this.position.y >= level.height || this.position.y <= 0.0)
		{
			return true;
		}
		return false;
}

Ship.prototype.checkCollisions = function(level)
{
	return this.collisionWithLevel(level);
	
	// Check collision with terrain
}

Ship.prototype.getInput = function(deltaTime)
{
	var turn = false;
	if( KeyListener.keys[this.keyLeft] > 0.0)
	{
		this.angle -= this.turnSpeed * deltaTime;
		turn = true;
	}
	else if( KeyListener.keys[this.keyRight] > 0.0)
	{
		this.angle += this.turnSpeed * deltaTime;
		turn = true;
		
	}
	
	if(this.angle > Math.PI * 2.0)
	{
		this.angle -= Math.PI * 2.0;
	}
	else if( this.angle < 0.0)
	{
		this.angle += Math.PI * 2.0;
	}
	
	
	if(turn)
	{
		// Turn the direction to the new angle
		this.direction = Vec2UnitVector(this.angle - (Math.PI /2));
		//console.log("Ship angle "+ this.angle + ". Direction is "+ this.direction.x + ", "+ this.direction.y);
	}
	
	
	var boost = false;
	if( KeyListener.keys[this.keyForward] > 0.0)
	{
		boost = true;
		this.speed += this.speedIncrease * deltaTime;
		if(this.speed >= this.speedMax)
		{
			this.speed = this.speedMax;
		}
		this.acceleration.copy(this.direction);
	}
	else
	{
		this.speed = 0.0;
		this.acceleration.clear();
	}
	
	if(boost)
	{
		//console.log("Ship acceleration is " + this.acceleration.x + " , "+ this.acceleration.y);
	}
	
	// Shooting
	this.bulletCounter += deltaTime;
	if( KeyListener.keys[this.keyFire] > 0.0)
	{
		if(this.bulletCounter >= this.bulletInterval)
		{
			this.shootBullet();
		}
	}
}

Ship.prototype.shootBullet = function()
{
	var bulletpos = Vec2Add( this.position, Vec2Rotate(this.barrelPoint, this.angle));
	this.bulletPool.createBullet(bulletpos, this.direction, this.velocity);
	this.bulletCounter = 0.0;
}

Ship.prototype.explode = function()
{
	// Create explosion
	this.randomNewPlace();
}

Ship.prototype.getHit = function( damage )
{
	this.hitPoints -= damage;
	if( this.hitPoints <= 0.0)
	{
		this.explode();
	}
}

Ship.prototype.update = function(deltaTime, level)
{
	this.getInput(deltaTime);
	
	var prevPositionX = this.position.x;
	var prevPositionY = this.position.y;
	
	this.velocity.add( Vec2Multiply(Global.gravity,deltaTime));
	this.velocity.add( Vec2Multiply(this.acceleration, this.speed * deltaTime));
	this.position.add( Vec2Multiply(this.velocity, deltaTime));
	
	if(this.checkCollisions(level))
	{
		this.position.x = prevPositionX;
		this.position.y = prevPositionY;
		this.velocity.x = 0.0;
		this.velocity.y = 0.0;
	}	
}

function Camera( width, height, startX, startY)
{
	this.position = new Vec2(0.0, 0.0);
	this.width = width;
	this.height = height;
	this.drawStart = new Vec2(0.0, 0.0);
	this.drawStart.x = startX;
	this.drawStart.y = startY;
	
	
}

Camera.prototype.centerOn = function(position)
{
	// Dont allow camera outside level
	this.position.x = position.x - this.width /2;
	this.position.y = position.y - this.height /2;
	if(this.position.x < 0.0)
	{
		this.position.x = 0.0;
	}
	if(this.position.y < 0.0)
	{
		this.position.y = 0.0;
	}
	
	if(this.position.x + this.width > Global.game.level.width)
	{
		this.position.x = Global.game.level.width - this.width;
	}
	if(this.position.y + this.height > Global.game.level.height)
	{
		this.position.y = Global.game.level.height - this.height;
	}
	
	
}

Camera.prototype.drawShip = function(ship)
{
	var seeShip = false;
	
	if( ship.position.x > this.position.x && 
		ship.position.x < this.position.x + this.width)
	{
		if( ship.position.y > this.position.y && 
			ship.position.y < this.position.y + this.height)
		{
			seeShip = true;
		}
	}
	if(!seeShip)
	{
		return;
	}
		
	var c = Global.context;
	//console.log("Drawing ship at : "+ ship.position.x +","+ ship.position.y);
	//console.log("Camera position at : "+ this.position.x +","+ this.position.y);
	var shipPosition = Vec2Minus(ship.position, this.position);
	shipPosition.add(this.drawStart);
	var left = Vec2Add( shipPosition, Vec2Rotate(ship.leftPoint, ship.angle));
	var front = Vec2Add( shipPosition, Vec2Rotate(ship.frontPoint, ship.angle));
	var right = Vec2Add( shipPosition, Vec2Rotate(ship.rightPoint,ship.angle));
	var back = Vec2Add( shipPosition, Vec2Rotate(ship.backPoint,ship.angle));
	
	c.strokeStyle = ship.color;
	c.lineWidth = ship.lineWidth;
	c.beginPath();
	c.moveTo(left.x, left.y);
	c.lineTo(front.x, front.y);
	c.lineTo(right.x, right.y);
	c.stroke();
	
	// Draw afterburner
	c.strokeStyle = "#ffff00";
	c.lineWidth = 6;
	c.beginPath();
	
	var behind = Vec2Rotate(ship.frontPoint, ship.angle + Math.PI );
	behind.mul(3.0 * (ship.speed / ship.speedMax));
	var behind = Vec2Add( back, behind);
	c.moveTo(back.x, back.y);
	c.lineTo(behind.x, behind.y);
	c.stroke();

}

Camera.prototype.drawHitPoints = function(ship)
{
	var c = Global.context;
	c.lineWidth = 6.0;
	c.strokeStyle = ship.hitPointColor;
	c.beginPath();
	c.moveTo(this.drawStart.x, this.drawStart.y + this.height - (c.lineWidth / 2));
	c.lineTo(this.drawStart.x + this.width * (ship.hitPoints / ship.hitPointsMax), this.drawStart.y +  this.height - (c.lineWidth/2));
	c.stroke();
}

Camera.prototype.drawBullet = function(bullet)
{
	var seeShip = false;
	
	if( bullet.position.x > this.position.x && 
		bullet.position.x < this.position.x + this.width)
	{
		if( bullet.position.y > this.position.y && 
			bullet.position.y < this.position.y + this.height)
		{
			seeShip = true;
		}
	}
	if(!seeShip)
	{
		return;
	}
	
	
	var c = Global.context;
	var bulletPosition = Vec2Minus(bullet.position, this.position);
	bulletPosition.add(this.drawStart);
	c.fillStyle = "#00ffff";
	c.beginPath();
	c.fillRect(bulletPosition.x - bullet.size/2, 
				bulletPosition.y - bullet.size/2,
				bullet.size,
				bullet.size);
}

Camera.prototype.drawBulletPool = function(bulletPool)
{
	for(var i = 0; i < bulletPool.poolSize; i++)
	{
		if( bulletPool.bullets[i].active)
		{
			
			this.drawBullet(bulletPool.bullets[i]);
			
		}
	}
	
}

Camera.prototype.drawLevel = function()
{
	var level = Global.game.level;
	var c = Global.context;
	if(this.position.x < 0.0 && this.position.y < 0.0)
	{
		c.strokeStyle = "#777777";
		c.lineWidth = 3.0;
		c.beginPath();
		
		// topleft corner
		var cornerX = this.drawStart.x + (this.position.x * -1.0);
		var cornerY = this.drawStart.y + (this.position.y * -1.0);
		c.moveTo(cornerX, cornerY);
		c.lineTo(cornerX + (this.width + this.drawStart.x + this.position.x),
				 cornerY );
		c.stroke();
		c.moveTo(cornerX, cornerY);
		c.lineTo(cornerX,
				 cornerY + (this.height + this.drawStart.y));
		c.stroke();
	}
	
}

Camera.prototype.drawViewBorders = function()
{
	var c = Global.context;
	c.strokeStyle = "#aaaaaa";
	c.lineWidth = 1.0;
	c.beginPath();
		
	// topleft corner
	var cornerX = this.drawStart.x;
	var cornerY = this.drawStart.y;
	c.strokeRect(cornerX, cornerY, this.width, this.height);
}

Camera.prototype.drawStar = function(backgroundstars, star)
{
	var seeShip = false;
	
	if( star.position.x > this.position.x && 
		star.position.x < this.position.x + this.width)
	{
		if( star.position.y > this.position.y && 
			star.position.y < this.position.y + this.height)
		{
			seeShip = true;
		}
	}
	if(!seeShip)
	{
		return;
	}
	
	var starPosition = Vec2Minus(star.position, this.position);
	starPosition.add(this.drawStart);
	
	var c = Global.context;
	c.fillStyle = backgroundstars.starColors[star.color];
	c.beginPath();
	c.fillRect(starPosition.x - star.size/2, 
				starPosition.y - star.size/2,
				star.size,
				star.size);
	
}

Camera.prototype.drawBackground = function(backgroundstars)
{
	for(var i = 0; i < backgroundstars.starAmount; i++)
	{
		this.drawStar(backgroundstars, backgroundstars.stars[i]);
	}
	
}

/* Draw what this camera sees on the canvas
 * starting from startX and startY
 * */
Camera.prototype.draw = function(backgroundstars)
{
	// Move everything so that they are related to
	// cameras position
	
	
	this.drawViewBorders();
	
	this.drawBackground(backgroundstars);
	
	// Ship One
	this.drawShip(Global.game.shipOne);

	// Ship Two
	this.drawShip(Global.game.shipTwo);
	
	// Draw bullets
	this.drawBulletPool(Global.game.bulletPool);
	
}
	
function Game()
{
	// Set game variables
	this.shipOne = new Ship();
	this.shipTwo = new Ship();
	this.shipOnePos = new Vec2(200,100);
	this.shipTwoPos = new Vec2(350,100);
	
	this.bulletPool = new BulletPool(20);
	
	this.cameraOne = new Camera(400,400, 0, 0);
	this.cameraTwo = new Camera(400,400, Global.canvasWidth/2, 0);
	
	this.backgroundColor = new Color(0.1, 0.1, 0.1, 0.7);
	this.backgroundFillStyle = this.backgroundColor.getStringRGBA();
	this.colorOne = new Color(1.0, 0.4, 0.4, 0.3);
	this.colorTwo = new Color(0.4, 1.0, 0.4, 0.3);
	
	this.level = new Level();
	this.background = new BackgroundStars(this.level.width, this.level.height);
	
	
}

Game.prototype.init = function()
{
	// Init all game objects
	
	this.shipOne.init( this.shipOnePos, this.colorOne.getString(),
				this.bulletPool,
				KeyListener.Key_W, KeyListener.Key_A, KeyListener.Key_D,
				KeyListener.Key_Q );
	this.shipOne.hitPointColor = this.colorOne.getStringRGBA();
	this.shipTwo.init( this.shipTwoPos, this.colorTwo.getString(),
				this.bulletPool,
				KeyListener.Key_I, KeyListener.Key_J, KeyListener.Key_L,
				KeyListener.Key_B);
				
	this.shipTwo.hitPointColor = this.colorTwo.getStringRGBA();
	this.cameraOne.centerOn( this.shipOnePos);
	this.cameraTwo.centerOn( this.shipTwoPos);
}



Game.prototype.update = function(deltaTime)
{
	// Take input
	// Update all objects
	this.shipOne.update(deltaTime, this.level);
	this.shipTwo.update(deltaTime, this.level);
	this.bulletPool.update(deltaTime, this.level);
	this.cameraOne.centerOn(this.shipOne.position);
	this.cameraTwo.centerOn(this.shipTwo.position);
}

Game.prototype.draw = function()
{
	Global.context.fillStyle = this.backgroundFillStyle;
	Global.context.beginPath();
	Global.context.fillRect(0,0, Global.canvasWidth, Global.canvasHeight);
	
	this.cameraOne.drawHitPoints(this.shipOne);
	this.cameraOne.draw(this.background);
	
	this.cameraTwo.drawHitPoints(this.shipTwo);
	this.cameraTwo.draw(this.background);
	
	
}

///////////////////////////////////////////////
// TEMPLATE ----------------------------------

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

	

