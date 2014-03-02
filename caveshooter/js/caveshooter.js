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
	* more classes
	* flash ship white when hit
*/

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
	
function NoiseLine( y )
{
	this.y = y;
	this.direction = 10.0 - Math.random() * 20.0;
	
	this.newDir = function()
	{
		this.direction = 10.0 - Math.random() * 20.0;
	}
	
	this.update = function(deltaTime, bottom)
	{
		this.y += this.direction;
		if( this.y < 0.0)
		{
			this.y = bottom;
		}
		else if( this.y > bottom)
		{
			this.y = 0.0;
		}
	}
}



function Camera( width, height, startX, startY)
{
	this.position = new Vec2(0.0, 0.0);
	this.targetPosition = new Vec2(0.0, 0.0);
	this.shakenPosition = new Vec2(0.0, 0.0);
	this.width = width;
	this.height = height;
	this.drawStart = new Vec2(0.0, 0.0);
	this.drawStart.x = startX;
	this.drawStart.y = startY;	
	
	this.shaken = false;
	this.myShip = null;
	this.shakenCounter = 0.0;
	this.shakeInterval = 0.01;
	
	this.amountNoiseLines = 10.0;
	this.noiseLines = [];
	
	for( var n = 0; n < this.amountNoiseLines; n++)
	{
		this.noiseLines.push(new NoiseLine( Math.random() * this.height));
	}
	
	this.noiseColors = [];
	var noiseColor;
	var size = 0;
	for( var s = 0.3; s < 1.0; s += 0.1)
	{
		noiseColor = new Color(s,s,s);
		this.noiseColors.push(noiseColor.getString());
		size++;
	}
	this.noiseColorAmount = size;
}

Camera.prototype.followShip = function(ship)
{
	console.log("Camera following ship " + ship.color);
	this.myShip = ship;
}

Camera.prototype.drawNoise = function()
{
	// Draw lines accross screen
	c = Global.context;
	
	for(var i = 0; i < this.amountNoiseLines; i++)
	{
		c.strokeStyle = this.noiseColors[Math.floor(Math.random() * this.noiseColorAmount)];
		c.lineWidth = Math.random() * 3.0;
		c.beginPath();
		c.moveTo( this.drawStart.x, this.drawStart.y + this.noiseLines[i].y);
		c.lineTo( this.drawStart.x + this.width, this.drawStart.y + this.noiseLines[i].y);
		c.stroke();
	}
}

Camera.prototype.updateNoise = function(deltaTime)
{
	for(var i = 0; i < this.amountNoiseLines; i++)
	{
		this.noiseLines[i].update(deltaTime, this.height);
	}
}

Camera.prototype.update = function(deltaTime)
{
	if(!this.myShip.spawning)
	{
		this.centerOn(this.myShip.position);
	}
	else
	{
		this.updateNoise(deltaTime);
	}
	
	if( this.shaken )
	{
		var shakeForce =  1.0 - (this.myShip.hitCounter / this.myShip.hitTimeLimit);
		this.position.add(Vec2Multiply(this.shakenDirection, shakeForce * 3.0 ));
		this.shakenCounter += deltaTime;
		if(this.shakenCounter > this.shakeInterval)
		{
			var rX = 1.0 - Math.random() * 2.0;
			var rY = 1.0 - Math.random() * 2.0;
			this.shakenDirection =  new Vec2(rX, rY );
			this.shakenDirection.normalize();
			this.shakenCounter = 0.0;
		}
		
		if(!this.myShip.hasBeenHit)
		{
			this.shaken = false;
		}
		this.updateNoise(deltaTime);
		
	}
	else if( !this.shaken && this.myShip.hasBeenHit)
	{
		// Shake camera
		this.shaken = true;
		// Randomize a direction
		var rX = 1.0 - Math.random() * 2.0;
		var rY = 1.0 - Math.random() * 2.0;
		this.shakenDirection =  new Vec2(rX, rY );
		this.shakenDirection.normalize();
		this.shakenCounter = 0.0;							
	}
		
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
	if(!seeShip || ship.spawning)
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
	
	if(!ship.hasBeenHit)
	{
		c.strokeStyle = ship.color;
		c.lineWidth = ship.lineWidth;
	}
	else
	{
		c.strokeStyle = ship.hitColor;
		c.lineWidth = ship.lineWidth + 2;
	}
	c.beginPath();
	c.moveTo(left.x, left.y);
	c.lineTo(front.x, front.y);
	c.lineTo(right.x, right.y);
	c.stroke();
	
	// Draw afterburner
	c.strokeStyle = "#ff9922";
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
	
	
	
	
	//console.log("Drawing bullet");
	var c = Global.context;
	var bulletPosition = Vec2Minus(bullet.position, this.position);
	bulletPosition.add(this.drawStart);
	c.strokeStyle = "#ffff00";
	c.lineWidth = bullet.size * 0.8;
	c.beginPath();
	var direction = bullet.velocity.getNormalized();
		//direction.print();
	direction.mul(bullet.size );
	c.moveTo( bulletPosition.x + direction.x, bulletPosition.y + direction.y);
	c.lineTo( bulletPosition.x - direction.x, bulletPosition.y - direction.y);
	c.stroke();
	
	
		//bullet.velocity.print();
		//direction.print();
	//bullet.active = false;
	
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

Camera.prototype.drawParticle = function(particle)
{
	var seeShip = false;
	
	if( particle.position.x > this.position.x && 
		particle.position.x < this.position.x + this.width)
	{
		if( particle.position.y > this.position.y && 
			particle.position.y < this.position.y + this.height)
		{
			seeShip = true;
		}
	}
	if(!seeShip)
	{
		return;
	}
	
	
	var c = Global.context;
	var particlePosition = Vec2Minus(particle.position, this.position);
	particlePosition.add(this.drawStart);
	c.fillStyle = particle.color;
	c.beginPath();
	c.fillRect(particlePosition.x - particle.size/2, 
				particlePosition.y - particle.size/2,
				particle.size,
				particle.size);
	
}

Camera.prototype.drawParticlePool = function(particlePool)
{
	for(var i = 0; i < particlePool.poolSize; i++)
	{
		if( particlePool.particles[i].active)
		{
			this.drawParticle(particlePool.particles[i]);		
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
	
	
	
	if( this.shaken || this.myShip.spawning )
	{
		this.drawNoise();	
	}
	
}
	
function Game()
{
	// Set game variables
	this.shipOne = new Ship();
	this.shipTwo = new Ship();
	this.shipOnePos = new Vec2(200,100);
	this.shipTwoPos = new Vec2(350,100);
	
	this.bulletPool = new BulletPool(20);
	this.particlePool = new ParticlePool(40);
	
	this.cameraOne = new Camera(400,400, 0, 0);
	this.cameraTwo = new Camera(400,400, Global.canvasWidth/2, 0);
	
	this.backgroundColor = new Color(0.1, 0.1, 0.1, 0.7);
	this.backgroundFillStyle = this.backgroundColor.getStringRGBA();
	this.colorOne = new Color(1.0, 0.4, 0.4, 0.3);
	this.colorTwo = new Color(0.4, 1.0, 0.4, 0.3);
	this.shipHitColor = "#ffffff"; // white
	this.bulletShellColor = "#ddcc22"
	
	this.level = new Level();
	this.background = new BackgroundStars(this.level.width, this.level.height);
	
	
}

Game.prototype.init = function()
{
	// Init all game objects
	
	this.shipOne.init( this.shipOnePos,
						KeyListener.Key_W, KeyListener.Key_A, KeyListener.Key_D,
						KeyListener.Key_Q );

	this.shipOne.setColors( this.colorOne.getString(), 
							this.colorOne.getStringRGBA(), 
							this.shipHitColor,
							this.bulletShellColor);
	
	this.shipOne.setPools(this.bulletPool, this.particlePool);
	
	this.shipOne.setLevel(this.level);
	
	
	this.shipTwo.init( this.shipTwoPos, 
						KeyListener.Key_I, KeyListener.Key_J, KeyListener.Key_L,
						KeyListener.Key_B);
	this.shipTwo.setLevel(this.level);
				
	this.shipTwo.setColors( this.colorTwo.getString(), 
							this.colorTwo.getStringRGBA(), 
							this.shipHitColor,
							this.bulletShellColor);
							
	this.shipTwo.setPools(this.bulletPool, this.particlePool);
	
	
	this.cameraOne.followShip(this.shipOne);
	this.cameraTwo.followShip(this.shipTwo);
	
	KeyListener.setCanvas(Global.canvas);
}



Game.prototype.update = function(deltaTime)
{
	// Take input
	// Update all objects
	this.shipOne.update(deltaTime, this.level);
	this.shipTwo.update(deltaTime, this.level);
	this.bulletPool.update(deltaTime, this.level);
	this.particlePool.update(deltaTime, this.level);
	
	this.bulletPool.checkCollisionWithLevel(this.level);
	this.bulletPool.checkCollisionWithShip(this.shipOne);
	this.bulletPool.checkCollisionWithShip(this.shipTwo);
	
	
	this.cameraOne.update(deltaTime);
	this.cameraTwo.update(deltaTime);
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
	
	this.cameraOne.drawBulletPool(this.bulletPool);
	this.cameraTwo.drawBulletPool(this.bulletPool);
	
	this.cameraOne.drawParticlePool(this.particlePool);
	this.cameraTwo.drawParticlePool(this.particlePool);
	
	
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

	

