/* Vector3 javascript */

function Vec3(x,y,z)
{
	this.x = x || 0.0;
	this.y = y || 0.0;
	this.z = z || 0.0;
	
	this.magnitude = function()
	{
		return Math.sqrt( ( this.x * this.x ) + (this.y * this.y) + this.z * this.z);
	}
	
	this.normalized = function()
	{
		var mag = Math.sqrt( ( this.x * this.x ) + (this.y * this.y) + this.z * this.z);
		if(mag > 0)
		{
			return new Vec3( this.x/mag, this.y/mag, this.z/mag);
		}
		else
		{
			return new Vec3(0,0,0);
		}
	}
	
	this.normalize = function()
	{
		var mag = Math.sqrt( ( this.x * this.x ) + (this.y * this.y) + this.z * this.z);
		if(mag > 0)
		{
			this.x /= mag; 
			this.y /= mag; 
			this.z /= mag;
		}
	}
}

function Vec3Dot(a,b)
{
	return a.x * b.x + a.y * b.y + a.z * b.z;
	
}

function Vec3Minus(a,b)
{
	return new Vec3( a.x - b.x, a.y - b.y, a.z - b.z);
	
}
