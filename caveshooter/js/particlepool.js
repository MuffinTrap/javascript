/** The famed particle class and pool 
 * 
 * Depends on:
 * 
 * Vec2
 * GameObject
 * 
 * */

function Particle()
{
	this.position = new Vec2(0,0);
	this.velocity = new Vec2(0,0);
	this.size = 1;
	this.color = "#FFFFFF";
	
	this.lifeTimeLimit = 3.0;
	this.lifeTimeCounter = 0.0;
	this.gravityMultiplier = 7.0;
	
	this.active = false;
}

Particle.prototype = new GameObject();

Particle.prototype.init = function( position, velocity, size, color, gravity, lifetime)
{
	this.position.copy(position);
	this.velocity.copy(velocity);
	this.size = size;
	this.color = color;	
	this.active = true;
	this.gravityMultiplier = gravity;
	this.lifeTimeLimit = lifetime;
}

Particle.prototype.update = function(deltaTime, gravity)
{
	this.velocity.add( Vec2Multiply(gravity , deltaTime * this.gravityMultiplier ));
	this.position.add( Vec2Multiply(this.velocity, deltaTime));
	
	this.lifeTimeCounter += deltaTime;
	if(this.lifeTimeCounter >= this.lifeTimeLimit)
	{
		this.active = false;
		this.lifeTimeCounter = 0.0;
		
	}
	
}

Particle.prototype.checkCollisionWithLevel = function(level)
{
	if(this.collisionWithBounds(0,0, level.width, level.height))
	{
		this.active = false;
	}
}


function ParticlePool(poolsize, particleSize)
{
	this.poolSize = poolsize;
	this.particles = [];
	if(particleSize <= 0.0)
	{
		this.particleSize = 1.0;
	}
	else
	{
		this.particleSize = particleSize;
	}
	
	for(var i = 0; i < this.poolSize; i++)
	{
		this.particles.push( new Particle() );
	}
}

ParticlePool.prototype.update = function(deltaTime, level)
{
	for(var i = 0; i < this.poolSize; i++)
	{
		if(this.particles[i].active == true)
		{
			this.particles[i].update(deltaTime, level.gravity);
		}
	}
	
}

ParticlePool.prototype.createParticle = function(position, direction, speed, color, gravity, lifetime, size)
{
	for(var i = 0; i < this.poolSize; i++)
	{
		if(this.particles[i].active == false)
		{
			var particle = this.particles[i];						// size
			particle.init(position, Vec2Multiply(direction, speed), size, color, gravity, lifetime);
			break;
		}
	}
}
