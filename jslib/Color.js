/* Color js. */

function Color(r, g, b)
{
	
	this.r = r;	
	this.g = g;
	this.b = b;
	
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
	
	this.getString = function()
	{
		return "rgb(" + this.r * 255.0 + "," + this.g * 255.0 + "," + this.b * 255.0 + ")";
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
}
