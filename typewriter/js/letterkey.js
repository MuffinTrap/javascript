/* 
 * A single key on the keyboard. Has a character, keycode and flies around
 */


function LetterKey( keyCode, keyCodeShift, position, dimensions, font, letterKeyRatio, letterWidth, targetGrid)
{
	
	// the grid from keyboard
	this.grid = targetGrid;
	
	this.keyCode = keyCode;
	this.keyCodeShift = keyCodeShift;
	
	this.dimensions = new Vec2(dimensions.x, dimensions.y);
	this.startDimensions = new Vec2(0,0);
	this.startDimensions.copy(this.dimensions);
	this.targetDimensions = new Vec2(0,0);
	this.originalDimensions = new Vec2(dimensions.x, dimensions.y);
	this.scaleSpeed = 8.0;
	this.scaleProgress = 1.0;
	this.isScaling = false;
	
	
	this.position = new Vec2(position.x + this.dimensions.x/2, position.y + this.dimensions.y/2);
	//console.log("Key " + keyCode.key +" got position "+ this.position.x + ","+ this.position.y);
	this.startPosition = new Vec2(0,0);
	this.startPosition.copy(this.position);
	this.targetPosition = new Vec2(0,0);
	this.originalPosition = new Vec2(this.position.x, this.position.y);
	this.moveSpeed = 2.0;
	this.moveProgress = 0.0;
	this.isMoving = false;
	
	this.targetBox = new Vec2(0,0);
	// what about multiple targets ???
	
	this.font = font;
	var letterHeight = ((this.dimensions.y * letterKeyRatio) / 2.0);
	var xstart = (this.dimensions.x/4) 
	var ystart = (this.dimensions.y/2) + letterHeight /2;
	
	this.letterStart = new Vec2(  xstart, ystart);
	//console.log("Letterwidth " + letterWidth +" height "+ letterHeight);
	
	this.stateIdle = 0;
	this.stateFlyingToGrid = 1;
	this.stateGoingDown = 2;
	this.stateGoingUp = 3;
	this.stateFlyingToNext = 4
	this.stateFlyingToHome = 5;
	
	this.currentState = this.stateIdle;
	this.nextState = this.stateIdle;
	
	this.myKeyPressed = false;
	
	this.color = "#2266aa";
	this.letterColor = "#88eeff";
}

LetterKey.prototype.write = function(  )
{
	if(this.currentState == this.stateIdle)
	{
		this.flyTo(this.grid.getCaretPos());
		/*
		console.log("Key " + this.keyCode.key + " writes to "+ this.targetPosition.x + ","+
					this.targetPosition.y);
					*/
		this.targetBox = this.grid.getCaretCoordinate();
					
		this.currentState = this.stateFlyingToGrid;
		return true;
	}
	else
	{
		return false;
	}
}

LetterKey.prototype.flyTo = function(target) 
{
	this.targetPosition.copy(target);
	this.startPosition.copy(this.originalPosition);
	/*
	console.log("Key " + this.keyCode.key + " flying to "+ this.targetPosition.x + ","+
				this.targetPosition.y);
				*/
}

LetterKey.prototype.changeSize = function(target)
{
	this.targetDimensions.copy(target);
}

LetterKey.prototype.update = function(deltaTime)
{
	// state machine.
	switch( this.currentState)
	{
		case this.stateIdle:
		{
			this.updateIdle(deltaTime);
		}
		break;
		case this.stateFlyingToGrid:
		{
			this.updateFlyToGrid(deltaTime);
		}
		break;
		case this.stateGoingDown:
		{
			this.updateGoDown(deltaTime);
		}
		break;
		case this.stateGoingUp:
		{
			this.updateGoUp(deltaTime);
		}
		break;
		case this.stateFlyingToNext:
		{
			
		}
		break;
		case this.stateFlyingToHome:
		{
			this.updateFlyHome(deltaTime);
		}
		break;
		default:
		{
			
		}
		break;
	}
	
}

LetterKey.prototype.updateIdle = function(deltaTime)
{
	// slowly hover around
}

LetterKey.prototype.updateFlyToGrid = function(deltaTime)
{
	this.moveProgress += this.moveSpeed * deltaTime;
	Vec2RefQuerpOut(this.position, this.startPosition, this.targetPosition, this.moveProgress);
	
	if(this.moveProgress >= 1.0)
	{
		this.moveProgress = 0.0;
		/*
		console.log("Key " + this.keyCode.key + " reached "+ this.targetPosition.x + ","+
				this.targetPosition.y);
				*/
				
		// change state 
		this.currentState = this.stateGoingDown;
		this.startDimensions.copy(this.originalDimensions);
		this.targetDimensions.x = this.originalDimensions.x * 0.1;
		this.targetDimensions.y = this.originalDimensions.y * 0.1;
	}
}

LetterKey.prototype.updateGoDown = function(deltaTime)
{
	this.scaleProgress += this.scaleSpeed * deltaTime;
	Vec2RefQuerpOut(this.dimensions, this.startDimensions, this.targetDimensions, this.scaleProgress);
	
	if(this.scaleProgress >= 1.0)
	{
		this.scaleProgress = 0.0;
		this.grid.addLetter(this.keyCode.key, this.targetBox);
		/*
		console.log("Key " + this.keyCode.key + " added letter to "+ this.targetBox.x + ","+ this.targetBox.y);
		*/
	
		// change state
		this.targetDimensions.copy(this.originalDimensions);
		this.startDimensions.x = this.originalDimensions.x * 0.1;
		this.startDimensions.y = this.originalDimensions.y * 0.1;
		this.currentState = this.stateGoingUp;
	}
}

LetterKey.prototype.updateGoUp = function(deltaTime)
{
	this.scaleProgress += this.scaleSpeed * deltaTime;
	Vec2RefQuerp(this.dimensions, this.startDimensions, this.targetDimensions, this.scaleProgress);
	
	if(this.scaleProgress >= 1.0)
	{
		this.scaleProgress = 0.0;
		//console.log("Key " + this.keyCode.key + " got up"+ this.targetBox.x + ","+ this.targetBox.y);
	
	
		// change state
		this.currentState = this.stateFlyingToHome;
		this.startDimensions.copy(this.originalDimensions);
		this.dimensions.copy(this.originalDimensions);
	}
}

LetterKey.prototype.updateFlyHome = function(deltaTime)
{
	this.moveProgress += this.moveSpeed * deltaTime;
	Vec2RefQuerpOut(this.position, this.targetPosition, this.startPosition, this.moveProgress);
	
	if(this.moveProgress >= 1.0)
	{
		this.moveProgress = 0.0;
		//console.log("Key " + this.keyCode.key + " reached "+ this.targetPosition.x + ","+
			//	this.targetPosition.y + " home");
				
		// change state 
		this.position.copy(this.originalPosition);
		this.currentState = this.stateIdle;
	}
}

LetterKey.prototype.draw = function( c )
{
	
	if(this.keyCode.key == ' ')
	{
		//return; // dont draw space for now
	}
	
	c.fillStyle = this.color;
	var x = this.position.x - this.dimensions.x / 2;
	var y = this.position.y - this.dimensions.y / 2
	c.fillRect(x ,y, this.dimensions.x, this.dimensions.y);
				
	// Draw letter on top
	
	//special cases 
	if( this.currentState == this.stateFlyingToGrid || this.currentState == this.stateIdle)
	{
		
		if(this.keyCode.key == 'downArrow')
		{
			c.strokeStyle = this.letterColor;
			c.lineWidth = 2;
			c.beginPath();
			c.moveTo(this.position.x, y);
			c.lineTo(this.position.x, this.position.y + (this.dimensions.y/4));
			c.lineTo(x + this.dimensions.x/6, this.position.y + this.dimensions.y/4);
			c.stroke();
		}
		else if(this.keyCode.key == 'leftArrow')
		{
			c.strokeStyle = this.letterColor;
			c.lineWidth = 2;
			xd = this.dimensions.x / 6;
			yd = this.dimensions.y/ 6;
			c.beginPath();
			c.moveTo(x + xd, y + yd);
			c.lineTo(x + this.dimensions.x - xd, y + this.dimensions.y -yd);
			c.lineTo(x + this.dimensions.x - xd, y + yd);
			c.lineTo(x + xd, y + this.dimensions.y -yd);
			c.stroke();
		}
		else
		{
			c.fillStyle = this.letterColor;
			c.font = this.font;
			c.fillText(this.keyCode.key, x + this.letterStart.x, y + this.letterStart.y);
		}
	}
}
