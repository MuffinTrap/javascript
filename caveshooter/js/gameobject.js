/** Base class for game objects that can move and collide 
 * 
 * Depends on :
 * 
 * Vec2
 * 
 * 
 * Base variables
 * 
 * 
 * */


function GameObject()
{
	this.position = new Vec2(0.0, 0.0);
	this.size = 0;
	
}

/* In   
 * 
 * 0--->  x 		position ----> width
 * |						|
 * |						|
 * V  y						V height
 */

GameObject.prototype.collisionWithGameObject = function(object)
{
	var left = this.position.x;
	var right = this.position.x + this.size;
	var top = this.position.y;
	var bottom = this.position.y + this.size;
	
	var oleft = object.position.x;
	var oright = object.position.x + object.size;
	var otop = object.position.y;
	var obottom = object.position.y + object.size;
	
	
	// right or left side inside object
	if( (right >= oleft && left <= oright ))
	{
		// top or bottom inside object
		if( (bottom >= otop && top <= obottom))
		{
			/*
			console.log("Collision between game objects");
			console.log("X: "+ left +"-"+ right + " | "+ oleft + "-" + oright);
			console.log("Y: "+ top +"-"+ bottom + " | "+ otop + "-" + obottom);			
			*/
			return true;
		}
	}
	return false;
}

GameObject.prototype.collisionWithBounds = function( bleft, btop, bright,  bbottom)
{
	var left = this.position.x;
	var right = this.position.x + this.size;
	var top = this.position.y;
	var bottom = this.position.y + this.size;
	
	if( left <= bleft)
	{
		return true;
	}
	else if( right >= bright)
	{
		return true;
	}
	else if( top <= btop)
	{
		return true;
	}
	else if(bottom >= bbottom)
	{
		return true;
	}
	
	return false;
}
