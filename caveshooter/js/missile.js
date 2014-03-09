/* Missile that ships can shoot at each other 
   and it homes in on target too, such fancy
   * 
   * Depends on Vec2
*/

function Missile(particlePool)
{
	this.position = new Vec2(0,0);
	this.direction = new Vec2(0,0);
	this.velocity = new Vec2(0,0);
	this.angle = 0.0;
	
	this.turnRate = 0.6;
	this.target = new Vec2(0,0);
	this.maxSpeed = 200;
	this.speedIncrease = 200.0;
	this.startSpeed = 50.0;
	this.speed = 100.0;
	
	this.size = 10.0;
	this.drawSize = 4.0;
	
	this.lifeTime = 4.0;
	this.lifeTimeCounter = 0.0;
	this.active = false;
	
	this.explosionTime = 1.0;
	this.explosionCounter = 0.0;
	
	this.explosionDistance = 9.0;
	
	this.stateDropped = 0;
	this.stateSeeking = 1;
	this.stateExplosion = 2;
	this.state = this.stateDropped;
	
	this.droppedTime = 1.0;
	this.droppedCounter = 0.0;
	this.gravityMultiplier = 5.0;
	
	this.damage = 3;
	
	this.smokeTime = 0.05;
	this.smokeCounter = 0.0;
	this.smokeColor = "#dddddd";
	
	// set by game
	this.particlePool = particlePool;
	
}

Missile.prototype = new GameObject();

Missile.prototype.checkCollisionWithShip = function(ship)
{
	if( this.collisionWithGameObject(ship))
	{
		ship.getHit(this);
		this.active = false;
	}
}

Missile.prototype.init = function(position, direction, target)
{
	this.position.copy(position);
	this.direction.copy(direction);
	this.target = target;
	this.active = true;
	this.state = this.stateDropped;
	this.speed = this.startSpeed;
}



Missile.prototype.update = function(deltaTime, gravity)
{
	if(this.state == this.stateDropped)
	{
		this.velocity.add( Vec2Multiply(gravity, deltaTime * this.gravityMultiplier));
		this.position.add( Vec2Multiply(this.velocity, deltaTime));
		
		this.droppedCounter += deltaTime;
		if(this.droppedCounter >= this.droppedTime)
		{
			this.droppedCounter = 0.0;
			this.state = this.stateSeeking;
			//console.log("Missile starts seeking");
			
		}
	}
	else if( this.state == this.stateSeeking)
	{
		
		this.lifeTimeCounter += deltaTime;
		if(this.lifeTimeCounter > this.lifeTime)
		{
			//console.log("Missile expired!");
			this.explode();
		}
		else
		{
		
			var toTarget = Vec2Minus(this.target, this.position);
			
			// Check if close enough
			if(toTarget.magnitude() <= this.explosionDistance)
			{
				//console.log("Missile exploded!");
				this.explode();
			}
			else
			{
				toTarget.normalize();
				var rate = this.turnRate * deltaTime;
				this.direction = Vec2Add( Vec2Multiply(this.direction, (1.0 - rate)),
										  Vec2Multiply(toTarget, rate));
				this.direction.normalize();
						
				var dot = Vec2Dot(this.direction, toTarget);
				if( dot > 0.0)
				{
					this.speed += this.speedIncrease * deltaTime * dot;
				}
				if(this.speed > this.maxSpeed)
				{
					this.speed = this.maxSpeed;
				}		
									
				Vec2RefMultiply(this.velocity, this.direction, this.speed * deltaTime);
				this.position.add( Vec2Multiply(this.velocity, deltaTime ));
				
				// Spawn particle
				this.smokeCounter += deltaTime;
				if(this.smokeCounter > this.smokeTime)
				{
					this.smokeCounter = 0.0;
					this.particlePool.createParticle(this.position, this.direction, 0, this.smokeColor, 0.1, 0.3, 10.0);
				}
										  
			}
		}
	}
	else if( this.state == this.stateExplosion)
	{
		this.explosionCounter += deltaTime;
		if(this.explosionCounter >= this.explosionTime)
		{
			//console.log("Missile explosion time ended");
			this.explosionCounter = 0.0;
			this.lifeTimeCounter = 0.0;
			this.state = this.stateDropped;
			this.active = false;
		}
	}
						
}

Missile.prototype.explode = function()
{
	this.velocity.clear();
	this.state = this.stateExplosion;
}


// MISSILE POOL //

function MissilePool(poolsize, particlePool)
{
	this.poolSize = poolsize;
	this.particles = [];
	
	for(var i = 0; i < this.poolSize; i++)
	{
		this.particles.push( new Missile(particlePool) );
	}
}

MissilePool.prototype.update = function(deltaTime, level)
{
	for(var i = 0; i < this.poolSize; i++)
	{
		if(this.particles[i].active == true)
		{
			this.particles[i].update(deltaTime, level.gravity);
		}
	}
	
}

MissilePool.prototype.createMissile = function(position, direction, target)
{
	for(var i = 0; i < this.poolSize; i++)
	{
		if(this.particles[i].active == false)
		{
			var particle = this.particles[i];						// size
			particle.init(position, direction, target);
			break;
		}
	}
}

// test exploding missiles against (other missiles) and ships

MissilePool.prototype.checkCollisions = function(shipsArray, amountShips)
{
	
	for(var i = 0; i < this.poolSize; i++)
	{
		if(this.particles[i].active == true && 
		   this.particles[i].state == this.particles[i].stateExplosion)
		{
			for( var s = 0; s < amountShips; s++)
			{
				this.particles[i].checkCollisionWithShip(shipsArray[s]);
			}
		}
	}
}
