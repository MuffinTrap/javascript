/* Keylistener singleton class thingie */

var KeyListener = new Object();
KeyListener.Key_LeftArrow 	= 37;
KeyListener.Key_UpArrow 	= 38;
KeyListener.Key_RightArrow 	= 39;
KeyListener.Key_DownArrow 	= 40;

KeyListener.Key_I 	= 73;
KeyListener.Key_J	= 74;
KeyListener.Key_K 	= 75;
KeyListener.Key_L 	= 76;
KeyListener.Key_B 	= 66;


KeyListener.Key_W 	= 87;
KeyListener.Key_A	= 65;
KeyListener.Key_S 	= 83;
KeyListener.Key_D 	= 68;
KeyListener.Key_TAB = 9;

KeyListener.Key_Q = 81;

KeyListener.keys = [];
KeyListener.canvas = null;

KeyListener.keyDown = function(event)
{
	// Save the time when key was pressed
	if(KeyListener.keys[event.keyCode] == 0.0)
	{
		KeyListener.keys[event.keyCode] = new Date().getTime();
		//console.log("Key " + String.fromCharCode(event.keyCode) + " pressed");
	}
	// This prevents scrolling etc in case of arrow keys
	return false;
}

KeyListener.keyDownHandler = function(event)
{
	KeyListener.keyDown(event);
}



KeyListener.keyUpHandler = function(event)
{
	// Clear the time to 0.0 which is also false
	if(KeyListener.keys[event.keyCode] > 0.0)
	{
		//console.log("Key " + String.fromCharCode(event.keyCode) + " released");
		KeyListener.keys[event.keyCode] = 0.0;
	}
}

KeyListener.initKey = function(keycode)
{
	KeyListener.keys[keycode] 	= 0.0;
}

KeyListener.setCanvas = function(canvas)
{
	if(canvas != null)
	{
		KeyListener.canvas = canvas;
		KeyListener.canvas.onkeydown = KeyListener.keyDown;
	}
	else
	{
		console.logError("Tried to set null canvas for KeyListener");
	}
	
	
	
}

document.addEventListener("keydown", KeyListener.keyDownHandler, false);
document.addEventListener("keyup", KeyListener.keyUpHandler, false);
