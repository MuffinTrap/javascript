/*	Class for BulletPool and Bullet 
 * 
 * Depends on:
 * 
 * Vec2.js
 * Level
 * Ship
 * 
 * */

function Bullet()
{
	this.position = new Vec2(0,0);
	this.velocity = new Vec2(0,0);
	this.acceleration = new Vec2(0,0);
	this.startSpeed = 180.0;
	this.speed = this.startSpeed;
	this.active = false;
	this.size = 6;
	this.damage = 10.0;
}

Bullet.prototype = new GameObject();

Bullet.prototype.checkCollisionWithLevel = function(level)
{
	if(this.collisionWithBounds(0,0, level.width, level.height))
	{
		this.active = false;
	}
}

Bullet.prototype.checkCollisionWithShip = function(ship)
{
	if( this.collisionWithGameObject(ship))
	{
		//console.log("Bullet collided with ship");
		ship.getHit(this);
		this.active = false;
	}
}		


Bullet.prototype.update = function(deltaTime, gravity)
{
	this.velocity.add( Vec2Multiply(gravity, deltaTime));
	this.position.add( Vec2Multiply(this.velocity, deltaTime));
}

////////////////////////////////////////////

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
			this.bullets[i].update(deltaTime, level.gravity);
		}
	}
}

BulletPool.prototype.checkCollisionWithLevel = function(level)
{
	for(var i = 0; i < this.poolSize; i++)
	{
		if(this.bullets[i].active == true)
		{	
			this.bullets[i].checkCollisionWithLevel(level);
		}
	}
	
}

BulletPool.prototype.checkCollisionWithShip = function(ship)
{
	for(var i = 0; i < this.poolSize; i++)
	{
		if(this.bullets[i].active == true)
		{	
			this.bullets[i].checkCollisionWithShip(ship);
		}
	}
}


