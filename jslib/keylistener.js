/* Keylistener singleton class thingie */

// code : int
// key  : 1 letter string
function Key(code, key)
{
	this.code = code;
	this.key = key;
}

var KeyListener = new Object();



KeyListener.keyEnums = [];
KeyListener.keys = [];
KeyListener.keysRead = [];
KeyListener.canvas = null;

KeyListener.AddKey = function(code, key)
{
	KeyListener.keyEnums.push(new Key(code, key));
	KeyListener.initKey( KeyListener.keyEnums[ KeyListener.keyEnums.length-1 ] );
	return KeyListener.keyEnums[ KeyListener.keyEnums.length-1 ];
}

KeyListener.initKey = function(keycode)
{
	//console.log("KeyListener init of key " + keycode.code +" : " + keycode.key);
	KeyListener.keys[keycode.code] 	= 0.0;
	KeyListener.keysRead[keycode] = false;
}

KeyListener.Key_LeftArrow 	= KeyListener.AddKey(37, 'leftArrow');
KeyListener.Key_UpArrow 	= KeyListener.AddKey(38, 'upArrow');
KeyListener.Key_RightArrow 	= KeyListener.AddKey(39, 'rightArrow');
KeyListener.Key_DownArrow 	= KeyListener.AddKey(40, 'downArrow');


KeyListener.Key_TAB = KeyListener.AddKey(9, 'tab');

KeyListener.Key_Q 	= KeyListener.AddKey(81, 'q');
KeyListener.Key_W 	= KeyListener.AddKey(87, 'w');
KeyListener.Key_E 	= KeyListener.AddKey(69, 'e');
KeyListener.Key_R 	= KeyListener.AddKey(82, 'r');
KeyListener.Key_T 	= KeyListener.AddKey(84, 't');
KeyListener.Key_Y 	= KeyListener.AddKey(89, 'y');
KeyListener.Key_U 	= KeyListener.AddKey(85, 'u');
KeyListener.Key_I 	= KeyListener.AddKey(73, 'i');
KeyListener.Key_O 	= KeyListener.AddKey(79, 'o');
KeyListener.Key_P 	= KeyListener.AddKey(80, 'p');

KeyListener.Key_A	= KeyListener.AddKey(65, 'a');
KeyListener.Key_S 	= KeyListener.AddKey(83, 's');
KeyListener.Key_D 	= KeyListener.AddKey(68, 'd');

KeyListener.Key_F	= KeyListener.AddKey(70, 'f');
KeyListener.Key_G 	= KeyListener.AddKey(71, 'g');
KeyListener.Key_H  	= KeyListener.AddKey(72, 'h');

KeyListener.Key_J	= KeyListener.AddKey(74, 'j');
KeyListener.Key_K 	= KeyListener.AddKey(75, 'k');
KeyListener.Key_L 	= KeyListener.AddKey(76, 'l');

KeyListener.Key_Z	= KeyListener.AddKey(90, 'z');
KeyListener.Key_X 	= KeyListener.AddKey(88, 'x');
KeyListener.Key_C 	= KeyListener.AddKey(67, 'c');

KeyListener.Key_V	= KeyListener.AddKey(86, 'v');
KeyListener.Key_B 	= KeyListener.AddKey(66, 'b');
KeyListener.Key_N 	= KeyListener.AddKey(78, 'n');

KeyListener.Key_M 	= KeyListener.AddKey(77, 'm');


KeyListener.Key_COMMA 	= KeyListener.AddKey(188, ',');
KeyListener.Key_STOP 	= KeyListener.AddKey(190, '.');

KeyListener.Key_SPACE 	= KeyListener.AddKey(32, ' ');
KeyListener.Key_ENTER 	= KeyListener.AddKey(312, 'enter');
KeyListener.Key_BACKSPACE 	= KeyListener.AddKey(8, 'backspace');


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
	return false;
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

KeyListener.isKeyDown = function(keycode)
{
	if( KeyListener.keys[keycode.code] > 0.0)
	{
		return true;
	}
	else
	{
		return false;
	}
}


KeyListener.isKeyPressed = function(keycode)
{
	return KeyListener.keysRead[keycode.code];	
}


// used by game to differentiate between keypresses
KeyListener.setKeyRead = function(keycode)
{
	KeyListener.keysRead[keycode.code] = true;
}

KeyListener.setKeyUnRead = function(keycode)
{
	KeyListener.keysRead[keycode.code] = false;
}

KeyListener.getKeyCode = function(keystring)
{
	var amountKeys = KeyListener.keyEnums.length;
	for( var i = 0; i < amountKeys; i++)
	{
		if( KeyListener.keyEnums[i].key == keystring)
		{
			//console.log("KeyListener returning keyEnum code " + KeyListener.keyEnums[i].code +" for " + keystring);
			return KeyListener.keyEnums[i];
		}
	}
	console.error("No such key");
	return 0;
	
}


document.addEventListener("keydown", KeyListener.keyDownHandler, false);
document.addEventListener("keyup", KeyListener.keyUpHandler, false);
