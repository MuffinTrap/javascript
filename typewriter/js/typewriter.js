/**
	Basic template for future javascript demos
*/


var Global = new Object();
Global.canvas = null;
Global.context = null;
Global.canvasHeight = 0;
Global.canvasWidth = 0;

Global.game = null;

Global.nowTime = 0;
Global.lastTime = 0;
Global.deltaTime = 0;

//////////////////////////////////////////////////////


/* The grid for drawing letters */
function Grid( position, dimensions, boxesPerRow, rows)
{
	this.upperLeft = new Vec2(position.x,position.y);
	
	this.boxesPerRow = boxesPerRow;
	this.rows = rows;
	// in boxes
	this.dimensions = new Vec2(dimensions.x,dimensions.y);
	
	this.boxInterval = new Vec2(0,0);
	
	var xspace = this.dimensions.x - (this.boxInterval.x * (boxesPerRow - 2.0));
	var yspace = this.dimensions.y - (this.boxInterval.y * (rows - 2.0));
	this.boxSize = new Vec2( xspace / boxesPerRow , yspace / rows);
	//console.log("BoxSize in grid is " + this.boxSize.x + ", " + this.boxSize.y);
	
	this.chapterInterval = new Vec2(0,0);
	
	this.caretPosition = new Vec2(0,0);
	this.caretShapeCounter = 0.0;
	this.caretShapeInterval = 0.8;
	this.caretFlat = true;
	this.caretIndex = new Vec2(0,0);
	
	
	this.font = "" + this.boxSize.y + "px monospace";
	
	// the actual text
	this.letters = [];
	
	// For fancy capital letters
	// this.capitalBoxSize = new Vec2(0,0);
	// this.capitalSizeMultiplier = 3;
}

Grid.prototype.setSoundPools = function(letterWrittenPool)
{
	this.letterWrittenPool = letterWrittenPool;
}

Grid.prototype.update = function(deltaTime)
{
	this.caretShapeCounter += deltaTime;
	if( this.caretShapeCounter > this.caretShapeInterval)
	{
		this.caretShapeCounter = 0.0;
		this.caretFlat = !this.caretFlat;
	}
}

Grid.prototype.draw = function(c)
{
	// Draw borders of grid
	c.strokeStyle = "#3366ff";
	c.lineWidth = 1.0;
	c.strokeRect(this.upperLeft.x, this.upperLeft.y, 
				 this.dimensions.x, this.dimensions.y);
	
	// Draw borders of each box
	
	// Draw caret
	c.fillStyle = "#22ddff"; // this.caretColor
	var yadjust = 0.0;
	var height = this.boxSize.y;
	if( this.caretFlat )
	{
		height = this.boxSize.y * 0.2;
		yadjust = this.boxSize.y * 0.8;
	}
	c.fillRect( this.upperLeft.x + this.caretPosition.x, 
				this.upperLeft.y + this.caretPosition.y + yadjust,
				this.boxSize.x, 
				height);
				
				
	// Draw the letters
	var x = 0.0;
	var y = 0.0;
	var row = 1.0;
	var col = 0.0;
	
	c.font = this.font;
	
	for( var i = 0; i < this.letters.length; i++)
	{
		
		x = this.upperLeft.x + col * this.boxSize.x;
		y = this.upperLeft.y + row * this.boxSize.y;
		
		
		c.fillText( this.letters[i], x, y);
	
		

		col += 1;
		if( col >= this.boxesPerRow)
		{
			row += 1;
			col = 0;
		}
	}
		
}

// Return the place of the caret 
Grid.prototype.getCaretPos = function()
{
	
	var x = this.upperLeft.x + this.caretPosition.x + (this.boxSize.x / 2.0);
	var y = this.upperLeft.y + this.caretPosition.y + (this.boxSize.y / 2.0);
	
	return new Vec2(x,y);
}

Grid.prototype.getCaretCoordinate = function()
{
	var value = new Vec2(this.caretIndex.x, this.caretIndex.y);
	return value;
}

Grid.prototype.advanceCaret = function()
{
	// check if end of line reached
	// move to first of next line
	//console.log("Advancing caret");
	this.caretPosition.x += this.boxSize.x;
	this.caretIndex.x += 1;
	if( this.caretPosition.x >= this.dimensions.x)
	{
		this.newLine();
	}
}

Grid.prototype.newLine = function()
{
	//console.log("Advancing line with caret");
	this.caretPosition.y += this.boxSize.y;
	this.caretPosition.x = 0.0;

	this.caretIndex.y += 1;
	this.caretIndex.x = 0;
}

Grid.prototype.fillLineWithEmpty = function(gridIndex)
{
	this.backSpace();
	var lettersLeft = this.boxesPerRow - this.caretIndex.x;
	
	//console.log("filling with empty " + lettersLeft + " from " + this.caretIndex.x);
	for(var i = 0; i < lettersLeft; i++)
	{
		var index = gridIndex.x + i + (gridIndex.y * this.boxesPerRow);
		//console.log(index);
		this.letters[index] = ' ';
		this.advanceCaret();
	}
}

Grid.prototype.backSpace = function()
{
	this.caretPosition.x -= this.boxSize.x * 1;
	this.caretIndex.x -= 1;
	if( this.caretPosition < 0.0) 
	{
		this.caretPosition += this.boxesPerRow * this.boxSize;
		this.caretIndex.x = this.boxesPerRow -1;
		this.caretIndex.y -= 1;
		if(this.caretIndex.y < 0)
		{
			this.caretIndex.y = 0;
		}
	}
}



// Called by letterkeys
Grid.prototype.addLetter = function(key, gridIndex)
{
	//special cases
	
	if( key == 'downArrow')
	{
		this.fillLineWithEmpty(gridIndex);
	}
	else if( key == 'leftArrow')
	{
		this.backSpace();
	}
	else
	{
		var index = gridIndex.x + (gridIndex.y * this.boxesPerRow);
		this.letters[index] = key;
		this.letterWrittenPool.play();
		//console.log("add letter " + key + " to " + gridIndex.x + " " + gridIndex.y + " : " + index);
	}
}

/* The keyboard */
///////////////////////////////////////////////
function Keyboard( position, dimensions, targetGrid )
{
	this.grid = targetGrid;
	
	this.keys = [];
	this.keyIndices = [];
	
	
	this.upperLeft = new Vec2(0,0);
	this.upperLeft.copy(position);
	//console.log("Keyboard upperLeft is at " + this.upperLeft.x +","+ this.upperLeft.y);
	
	this.dimensions = new Vec2(dimensions.x, dimensions.y);
	
	this.keyInterval = new Vec2(2,2);
	this.lettersPerRow = [ 11,
						   10,
						   10
						];
						   
	var rows = 3; // CHANGE
					// 1   2   3   4   5   6   7   8   9   0   11
	var keysToFind = ['q','w','e','r','t','y','u','i','o','p','leftArrow',
					  'a','s','d','f','g','h','j','k','l','downArrow',
					  'z','x','c','v','b','n','m',',','.',' '
					     ];
	this.keysInUse = [];
	
	var position = new Vec2(this.upperLeft.x, this.upperLeft.y);
	
	// Make relative to own size
	var mostKeysOnRow = 10;
	var xspace = this.dimensions.x - (this.keyInterval.x) * (mostKeysOnRow - 2.0);
	var yspace = this.dimensions.y - (this.keyInterval.y) * (rows - 2.0)
	var keyDimensions = new Vec2( xspace / mostKeysOnRow, yspace / rows); 
	//console.log("Dimensios of a single key are " + keyDimensions.x + "," + keyDimensions.y);
	this.keyOffsetPerRow = new Vec2(keyDimensions.x / 2, 0);
	
	var letterKeyRatio = 0.9;
	this.fontSize = keyDimensions.y * letterKeyRatio;
	this.fontName = "monospace";
	this.font = "" + this.fontSize + "px " + this.fontName;
	
	
	var keyCode = KeyListener.Key_A;
	var keyCodeShift = 'A';
	var letterWidth;
	// Create keys
	var keyIndex = 0;
	
	for(var i = 0; i < rows; i++)
	{
		for(l = 0; l < this.lettersPerRow[i]; l++)
		{
			keyCode = KeyListener.getKeyCode(keysToFind[keyIndex]);
			this.keysInUse.push(keyCode);
			
			keyIndex++;
			if(keyIndex > keysToFind.length)
			{
				//console.log("All keys found");
				break;
			}
				
			
			letterWidth = Global.context.measureText(keyCode.key).width;
			
			position.x = this.upperLeft.x + 
						 this.keyOffsetPerRow.x * i + 
						 this.keyInterval.x * l + 
						 keyDimensions.x * l;
						 
			position.y = this.upperLeft.y + 
						 this.keyOffsetPerRow.y * i + 
						 this.keyInterval.y * i + 
						 keyDimensions.y * i;
			
			//
			this.keys[keyCode.code] = ( new LetterKey( keyCode, keyCodeShift, position, keyDimensions, this.font, letterKeyRatio, letterWidth, this.grid));
			
			this.keyIndices.push(keyCode.code);
			//
			
			KeyListener.initKey(keyCode);
			//KeyListener.initKey(keyCodeShift);
			//console.log("Key for " + keyCode.key + " created at " + position.x +","+ position.y);
		}
	}
	this.amountKeys = this.keys.length;
	//console.log("Created " + this.amountKeys + " keys for keyboard");
	
	this.codeForLeftArrow = KeyListener.getKeyCode("leftArrow");
	this.codeForDownArrow = KeyListener.getKeyCode("downArrow");
}


Keyboard.prototype.setSoundPools = function(keyDownPool, keyUpPool)
{
	this.keyDownPool = keyDownPool;
	this.keyUpPool = keyUpPool;
}

Keyboard.prototype.draw = function(c)
{
	
	// Draw borders of keyboard
	c.strokeStyle = "#1144aa";
	c.lineWidth = 1.0;
	c.strokeRect(this.upperLeft.x, this.upperLeft.y, 
				 this.dimensions.x, this.dimensions.y);
	
	for(var i = 0; i < this.keyIndices.length; i++)
	{
		this.keys[ this.keyIndices[i] ].draw(c);
	}
}

Keyboard.prototype.update = function(deltaTime)
{
	// Listen to keys
	var key = null;
	var canWrite = true;
	
	for(var i = 0; i < this.keysInUse.length; i++)
	{
		key = this.keysInUse[i];
		if(KeyListener.isKeyDown(key))
		{
			if(!KeyListener.isKeyPressed(key))
			{
				
				KeyListener.setKeyRead(key);
				canWrite = this.keys[key.code].write();
				if(canWrite)
				{
					this.keyDownPool.play();
				
					// ENTER 
					if(key == this.codeForDownArrow)
					{
						
					}
					else if(key == this.codeForLeftArrow)
					{
						
					}
					else
					{		
						// only letters advance caret
						this.grid.advanceCaret();
					}
				}
			}
		}
		else
		{
			if( KeyListener.isKeyPressed(key))
			{
				// key is released
				KeyListener.setKeyUnRead(key);
				this.keyUpPool.play();
			}
		}
	}
	// update all keys
	for(var i = 0; i < this.keyIndices.length; i++)
	{
		this.keys[ this.keyIndices[i] ].update(deltaTime);
	}
	
	// Animate caret movement!
}




function Game()
{
	// Set game variables
	this.backgroundColor = "#222244";
	 
}

Game.prototype.init = function()
{
	// create sound pools
	this.audioManager = new AudioManager();
	
	this.buttonDownSoundPath = "audio/keyDown.wav";
	this.buttonDownPool = this.audioManager.createSoundPool(this.buttonDownSoundPath, 10);
	
	this.buttonUpSoundPath = "audio/keyUp.wav";
	this.buttonUpPool = this.audioManager.createSoundPool(this.buttonUpSoundPath, 10);
	
	this.letterWrittenPath = "audio/letterWritten.wav";
	this.letterWrittenPool = this.audioManager.createSoundPool(this.letterWrittenPath, 10);
	
	this.soundsLoaded = 0;
	this.soundsToLoad = 3;
	this.soundsAreReady = false;
	
	
	
	// Init all game objects
	this.gridPos = new Vec2(Global.canvasWidth * 0.2, Global.canvasHeight * 0.1);
	this.gridDim = new Vec2(Global.canvasWidth * 0.6, Global.canvasHeight * 0.6);
	
	this.gridBoxPerRow = 20;
	this.gridRows = 10;
	
	this.keyboardPos = new Vec2(Global.canvasWidth * 0.1, Global.canvasHeight * 0.8);
	this.keyboardDim = new Vec2(Global.canvasWidth * 0.8, Global.canvasHeight * 0.2);
	
	
	
	this.grid = new Grid(this.gridPos, this.gridDim, this.gridBoxPerRow, this.gridRows);
	this.keyboard = new Keyboard( this.keyboardPos, this.keyboardDim, this.grid);
	
	this.grid.setSoundPools(this.letterWrittenPool);
	this.keyboard.setSoundPools(this.buttonDownPool, this.buttonUpPool);
	
	this.loadingCounter = 0.0;
	this.loadingTime = 2.0;
	this.checkAudio = window.setInterval( function(){Global.game.soundsReady()},this.loadingTime * 1000);
	
}


// Called by audiopools when sounds are loaded
Game.prototype.soundsReady = function()
{
	//this.soundsLoaded++;
	//if(this.soundsLoaded === this.soundsToLoad)
	//{
		console.log("Sounds are loaded");
		this.soundsAreReady = true;
		window.clearInterval(this.checkAudio);
	//}
}

Game.prototype.update = function(deltaTime)
{
	// Take input
	// Update all objects
	if( this.soundsAreReady )
	{
		this.grid.update(deltaTime);
		this.keyboard.update(deltaTime);
	}
	else
	{
		this.loadingCounter += deltaTime;
	}
}

Game.prototype.draw = function()
{
	
	var c = Global.context;
	c.fillStyle = this.backgroundColor;
	c.fillRect(0,0, Global.canvasWidth, Global.canvasHeight);
	
	if(this.soundsAreReady)
	{
	
		// Draw all objects
		// draw background
		this.grid.draw(c);
		// draw foreground
		this.keyboard.draw(c)
		// draw overlay
	}
	else
	{
		this.drawLoading(c);
	}
}

Game.prototype.drawLoading = function(c)
{
	c.fillStyle = "#88bbff";
	c.font = "40px monospace";
	
	var loadingProg = 1.0 - (this.loadingCounter / (this.loadingTime + 0.3));
	
	c.fillText("Loading", 100,  Global.canvasHeight * loadingProg);
	
	// Draw lines accross screen
	
	var amountLines = Math.ceil( 10 * ( loadingProg));
	amountLines += 3; // at least 1
	
	for(var i = 0; i < amountLines; i++)
	{
		var y =  Math.random() * Global.canvasHeight;
		c.strokeStyle = c.fillStyle;
		c.lineWidth = Math.random() * 5.0;
		c.beginPath();
		c.moveTo( 0, y);
		c.lineTo( Global.canvasWidth, y);
		c.stroke();
	}
}

Global.initGame = function()
{
	Global.game.init();
}

Global.runGame = function()
{
	Global.nowTime = new Date().getTime();
    Global.deltaTime = Global.nowTime - Global.lastTime;
    Global.deltaTime = Global.deltaTime / 1000.0;

	// loop de loop
    Global.game.update(Global.deltaTime);
    Global.game.draw();
    
    Global.lastTime = Global.nowTime;
    
    requestAnimFrame(Global.runGame);
}

function Init()
{
  Global.canvas = document.getElementById("canvas");
  Global.context = canvas.getContext("2d");
  if(Global.context != null)
  {
	  console.log("Got context from Canvas");
  }
  Global.canvasHeight = canvas.height;
  Global.canvasWidth = canvas.width;
  Global.game = new Game();
  Global.initGame();
  Global.lastTime = new Date().getTime();
  Global.runGame();
}

window.onload = function()
{
  Init();
} 

window.requestAnimFrame = (function()
{
  return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( callback, element) {
          window.setTimeout(callback, 1000/60);
          };
})();

console.log("Javascript running"); 
