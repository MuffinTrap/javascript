
/* Audio manager 
 * 
 * Loads audio and plays audio
 * 
 * 
 */

function SoundPool(soundpath, size)
{
	
	this.pool = [];
	this.size = size;
	this.currentSound = 0;
	
	// fill pool
	for(var i = 0; i < this.size; i++)
	{
		var sound = new Audio(soundpath);
		sound.load();
		this.pool[i] = sound;
	}
}


SoundPool.prototype.play = function()
{
	if(this.pool[ this.currentSound ].currentTime == 0 || 
		this.pool[ this.currentSound ].ended )
		{
			this.pool[ this.currentSound ].play();
		}
	this.currentSound++;
	if(this.currentSound >= this.size)
	{
		this.currentSound = 0;
	}
}

function AudioManager( )
{
	this.audioPools = [];
	
}

AudioManager.prototype.createSoundPool = function(soundpath, size)
{
	this.audioPools.push( new SoundPool(soundpath, size));
	return this.audioPools[ this.audioPools.length -1];
	
}
