/* Class for the caveshooter ship 
 * 
 * Depends on:
 * 
 * keylistener.js
 * Vec2.js
 * Level
 * BulletPool
 * ParticlePool
 * 
 * */


function Ship()
{
	this.size = 8;
	this.lineWidth = 2;
	this.color = null;			// Color of the ship
	this.hitPointColor = null;	// Color of the hitpoint bar
	this.hitColor = null;		// Color when hit
	this.bulletShellColor = null; // Color of shell particles
	
	this.speed = 0.0;
	this.speedIncrease = 300.0;
	this.speedMax = 100.0;
	this.turnSpeed = Math.PI / 0.9;
	this.recoilForce = 30.0;
	
	this.position = new Vec2(0.0, 0.0);
	this.velocity = new Vec2(0.0, 0.0);
	this.acceleration = new Vec2(0.0, 0.0);
	
	this.angle = 0.0;
	this.direction = Vec2UnitVector(this.angle - (Math.PI /2));
	
	// Getting hit
	
	this.hitPoints = 100.0;
	this.hitPointsMax = 100.0;
	this.score = 0.0;
	this.hasBeenHit = false;
	this.hitTimeLimit = 0.25;
	this.hitCounter = 0.0;
	this.explosionParticles = 30.0;
	this.sparkParticles = 6.0;
	
	// Death and rebirth
	this.spawning = false;
	this.spawnCounter = 0.0;
	this.spawnLimit = 2.0;
	
	this.keyForward = 0;
	this.keyLeft = 0;
	this.keyRight = 0;
	this.keyFire = 0;
	
	// Bullets and Missiles
	this.bulletCounter = 0.0;
	this.bulletInterval = 0.4;
	this.missileCounter = 0.0;
	this.missileInterval = 0.6;
	
	this.bulletShellEjectSpeed = 3.0;
	this.bulletPool = null; // Set by game
	this.particlePool = null; // set by game
	this.missileTriggerTime = 500.0; // in milliseconds
	
	this.bulletLoaded = false;
	this.missileLoaded = false;
	this.modeBullet = 0;
	this.modeMissile = 1;
	this.fireMode = this.modeBullet;
	this.firePressed = false;
	
	
	// Vertices
	this.leftPoint = new Vec2(-4.0, 8.0);
	this.frontPoint = new Vec2(0.0, -6.0);
	this.rightPoint = new Vec2(4.0, 8.0);
	this.backPoint = new Vec2(0.0, 8.0);
	this.barrelPoint = new Vec2(0.0, -12.0);
	
	this.level = null;
	this.allShips = null;
	// id number
	this.id = 0;
	
}

Ship.prototype = new GameObject();

Ship.prototype.init = function(position, keyForward, keyLeft, keyRight, keyFire)
{
	this.position = position;
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

Ship.prototype.setColors = function( shipColor, hitPointColor, hitColor, bulletShellColor)
{
	
	this.color = shipColor;
	
	this.hitPointColor = hitPointColor;

	this.hitColor = hitColor;
	
	this.bulletShellColor = bulletShellColor;
	console.log("Ship colors "+ this.color + " " + this.hitPointColor + " " + this.hitColor);
}

Ship.prototype.setID = function(id, shipsArray)
{
	this.id = id;
	this.allShips = shipsArray;
}

Ship.prototype.setLevel = function(level)
{
	this.level = level;
}

Ship.prototype.setPools = function( bulletPool, particlePool, missilePool)
{
	this.bulletPool = bulletPool;
	this.particlePool = particlePool;
	this.missilePool = missilePool;
}

Ship.prototype.randomNewPlace = function()
{
	this.position.x = Math.random() * this.level.width;
	this.position.y = Math.random() * this.level.height;
	this.hitPoints = this.hitPointsMax;
}


Ship.prototype.collisionWithLevel = function(level)
{
	return this.collisionWithBounds(0,0, level.width, level.height);
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
	
	// Shooting bullets and missiles
	var d = new Date();
	var date = d.getTime();
	
	this.bulletCounter += deltaTime;
	if(this.bulletCounter >= this.bulletInterval)
	{
		this.bulletCounter = 0.0;
		this.bulletLoaded = true;
	}
	
	this.missileCounter += deltaTime;
	if(this.missileCounter >= this.missileInterval)
	{
		this.missileCounter = 0.0;
		this.missileLoaded = true;
	}
	

	
	if( KeyListener.keys[this.keyFire] > 0.0 && this.firePressed == false)
	{
		this.fireMode = this.modeBullet;
		this.firePressed = true;
		//console.log("fire Pressed at " + date);
	}
	if( (KeyListener.keys[this.keyFire] > 0.0) && (date - KeyListener.keys[this.keyFire] > this.missileTriggerTime))
	{
		//console.log("Missile launch");
		this.fireMode = this.modeMissile;
		if(this.missileLoaded)
		{
			this.shootMissile();
			this.missileCounter = 0.0;
			this.missileLoaded = false;
		}
	}
	
	if( KeyListener.keys[this.keyFire] == 0.0 && this.firePressed == true)
	{
		//console.log("fire released");
		
		if( (this.firePressed && this.fireMode == this.modeBullet) && this.bulletLoaded)
		{
			this.shootBullet();
			this.bulletCounter = 0.0;
			this.bulletLoaded = false;
		}
		this.firePressed = false;
	}
}

Ship.prototype.shootBullet = function()
{
	var bulletpos = Vec2Add( this.position, Vec2Rotate(this.barrelPoint, this.angle));
	this.bulletPool.createBullet(bulletpos, this.direction, this.velocity);
	
	
	// recoil
	this.velocity = Vec2Add(this.velocity, Vec2Multiply(this.direction, -this.recoilForce));
	
	var right = Vec2Add( this.position, Vec2Rotate(this.rightPoint, this.angle - 1.4));
	var shellSpawndirection = Vec2Minus(right, this.position);
	shellSpawndirection.normalize();
	this.particlePool.createParticle( this.position, shellSpawndirection, this.bulletShellEjectSpeed, this.bulletShellColor, 7.0, 3.0, 3.0);
}

Ship.prototype.getEnemyPosition = function()
{
	// FIXME if many players, should find best match
	
	if(this.id == 0)
	{
		return this.allShips[1].position;
	}
	else
	{
		return this.allShips[0].position;
	}
}

Ship.prototype.shootMissile = function()
{
	var bulletpos = Vec2Add( this.position, Vec2Rotate(this.barrelPoint, this.angle));
	this.missilePool.createMissile(bulletpos, this.direction, this.getEnemyPosition() );
	
}

Ship.prototype.explode = function()
{
	// Create explosion
	var point;
	var direction;
	for(var i = 0; i < this.explosionParticles; i++)
	{
		point = Vec2Add( this.position, 
						Vec2Rotate( this.frontPoint, 
									this.angle + (6.14/this.explosionParticles) * i) );
		direction = Vec2Minus(point, this.position);
		direction.normalize();
		this.particlePool.createParticle( this.position, direction, this.explosionParticles, this.color);
	}
	
	this.spawning = true;
	this.randomNewPlace();
}

Ship.prototype.createSparks = function(bullet)
{
	var hitpoint = Vec2Add(this.position, Vec2Minus(bullet.position, this.position));
	var direction;
	var randomAddAngle = Math.random();
	for(var i = 0; i < this.sparkParticles; i++)
	{
		var point = Vec2Add( hitpoint, 
							Vec2Rotate( this.rightPoint, this.angle + randomAddAngle + ((6.14/this.sparkParticles) * i)));
		direction = Vec2Minus(point, hitpoint);
		direction.normalize();
		this.particlePool.createParticle( hitpoint, direction, 10.0, this.color);
	}
}


Ship.prototype.getHit = function( bullet )
{
	// Affect movement
	this.velocity.add( Vec2Multiply(bullet.velocity, 0.3));
	
	//console.log("Ship got " + bullet.damage + " damage");
	this.hitPoints -= bullet.damage;
	this.createSparks(bullet);
	
	if( this.hitPoints <= 0.0)
	{
		this.explode();
	}
	else
	{
		this.hasBeenHit = true;
		this.hitCounter = 0.0;
	}
}

Ship.prototype.update = function(deltaTime, level)
{
	if(this.spawning)
	{
		this.spawnCounter += deltaTime;
		if(this.spawnCounter >= this.spawnLimit)
		{
			this.spawning = false;
		}
		return;
	}
	
	this.getInput(deltaTime);
	
	var prevPositionX = this.position.x;
	var prevPositionY = this.position.y;
	
	this.velocity.add( Vec2Multiply(this.level.gravity, deltaTime));
	this.velocity.add( Vec2Multiply(this.acceleration, this.speed * deltaTime));
	
	this.position.add( Vec2Multiply(this.velocity, deltaTime));
	
	if(this.collisionWithLevel(level))
	{
		this.position.x = prevPositionX;
		this.position.y = prevPositionY;
		this.velocity.x = 0.0;
		this.velocity.y = 0.0;
	}	
	
	if(this.hasBeenHit)
	{
		this.hitCounter += deltaTime;
		if(this.hitCounter >= this.hitTimeLimit)
		{
			this.hasBeenHit = false;
			this.hitCounter = 0.0;
		}
	}
	
}
