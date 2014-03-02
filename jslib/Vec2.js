/** Vector2 class for javascript */

var Vec2Debug = false;

function Vec2(x,y)
{
	this.x = x;
	this.y = y;
	if(Vec2Debug)
	{
		console.log("New Vec2: "+ this.x +","+ this.y);
	}
}

Vec2.prototype.add = function( b )
{
	this.x += b.x;
	this.y += b.y;
}

function Vec2Add( a, b)
{
	if(Vec2Debug)
	{
		//console.log("Vec2Add: "+ a.x +" + "+ b.y); 
	}
	return new Vec2(a.x + b.x, a.y + b.y);
}

function Vec2RefAdd(ref, a, b)
{
	ref.x = a.x + b.x;
	ref.y = a.y + b.y;
}

Vec2.prototype.min = function(  b)
{
	this.x -= b.x;
	this.y -= b.y;
}

function Vec2Minus( a, b )
{
	return new Vec2(a.x - b.x, a.y - b.y);
}

function Vec2RefMinus(ref, a, b )
{
	ref.x = a.x - b.x;
	ref.y = a.y - b.y;
}

Vec2.prototype.mul = function( scalar)
{
	this.x *= scalar;
	this.y *= scalar;
}

function Vec2Multiply( a, scalar)
{
	return new Vec2(a.x * scalar, a.y * scalar);
}

function Vec2RefMultiply(ref, a, scalar)
{
	ref.x = a.x * scalar;
	ref.y = a.y * scalar;
}

Vec2.prototype.div = function(scalar)
{
	this.x /= scalar;
	this.y /= scalar;
}

function Vec2Divide( a, scalar)
{
	if( !isNaN(scalar) && scalar != 0.0)
	{
		return new Vec2(a.x / scalar, a.y / scalar);
	}
	else
	{
		console.log("Tried to divide Vec2 with a zero or Nan");
		return new Vec2(0.0, 0.0);
	}
}

function Vec2RefDivide(ref, a, scalar)
{
	if( !isNaN(scalar) && scalar != 0.0)
	{
		ref.x = a.x / scalar;
		ref.y = a.y / scalar;
	}
	else
	{
		console.log("Tried to divide Vec2 with a zero or Nan");
		ref.x = 0.0;
		ref.y = 0.0;
	}
}

Vec2.prototype.magnitude = function()
{
	return Math.sqrt( ( this.x * this.x ) + (this.y * this.y) );
}

Vec2.prototype.normalize = function()
{
	var mag = this.magnitude;
	if( mag > 0.0)
	{
		this.x /= mag;
		this.y /= mag;
	}
}

Vec2.prototype.getNormalized = function()
{
	var mag = this.magnitude();
	var nx = 0.0;
	var ny = 0.0;
	if( mag > 0.0)
	{
		nx = this.x / mag;
		ny = this.y / mag;
	}
	return new Vec2(nx, ny);
}


Vec2.prototype.print = function()
{
	console.log("x: " + this.x + " y: " + this.y);
}

Vec2.prototype.copy = function( b )
{
	this.x = b.x;
	this.y = b.y;
}

Vec2.prototype.clear = function()
{
	this.x = 0.0;
	this.y = 0.0;
}


Vec2.prototype.rotate = function(angle)
{
	var cs = Math.cos(angle);
	var sn = Math.sin(angle);
	
	var nx = this.x * cs - this.y * sn;
	var ny = this.x * sn + this.y * cs;
	
	this.x = nx;
	this.y = ny;
}

Vec2Rotate = function( vector, angle)
{
	var cs = Math.cos(angle);
	var sn = Math.sin(angle);
	
	var nx = vector.x * cs - vector.y * sn;
	var ny = vector.x * sn + vector.y * cs;
	
	return new Vec2(nx, ny);
}

Vec2.prototype.scaleTo = function(scalar)
{
	this.normalize();
	this.mul(scalar);
}
	
Vec2UnitVector = function(angle)
{
	var cs = Math.cos(angle);
	var sn = Math.sin(angle);
	return new Vec2(cs, sn);
}
