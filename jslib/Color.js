/* Color js. */

function Color(r, g, b, a)
{
	
	this.r = r;	
	this.g = g;
	this.b = b;
	this.a = a;
	
	if( this.r > 1.0)
	{
		this.r = 1.0;
	}
	if( this.g > 1.0)
	{
		this.g = 1.0;
	}
	if( this.b > 1.0)
	{
		this.b = 1.0;
	}
	if((this.a > 1.0 || this.a <= 0.0) || typeof a == 'undefined')
	{
		this.a = 1.0;
	}
	
	this.getString = function()
	{
		return "rgb(" + Math.floor(this.r * 255.0) + "," + Math.floor(this.g * 255.0) + "," + Math.floor(this.b * 255.0) + ")";
	}
	
	this.getStringRGBA = function()
	{
		return "rgba(" + Math.floor(this.r * 255.0) + "," + Math.floor(this.g * 255.0) + "," + Math.floor(this.b * 255.0) + "," + this.a + ")";
	}
	
	this.add = function(color)
	{
		this.r += color.r;
		this.g += color.g;
		this.b += color.b;
		
		if( this.r > 1.0)
		{
			this.r = 1.0;
		}
		if( this.g > 1.0)
		{
			this.g = 1.0;
		}
		if( this.b > 1.0)
		{
			this.b = 1.0;
		}
	}
	
	this.print = function()
	{
		console.log(this.r +", "+ this.g + ", "+ this.b + ", " + this.a);
	}
}

Color.prototype.add = function(otherColor)
{
	this.r += otherColor.r;
	this.g += otherColor.g;
	this.b += otherColor.b;
	
	if( this.r > 1.0)
	{
		this.r = 1.0;
	}
	if( this.g > 1.0)
	{
		this.g = 1.0;
	}
	if( this.b > 1.0)
	{
		this.b = 1.0;
	}
	
}

Color.prototype.copy = function(otherColor)
{
	this.r = otherColor.r;
	this.g = otherColor.g;
	this.b = otherColor.b;
	this.a = otherColor.a;
}
