/**
	Basic template for future javascript demos
*/


var Global = new Object();
Global.context = null;
Global.canvasHeight = 0;
Global.canvasWidth = 0;

Global.game = null;

Global.nowTime = 0;
Global.lastTime = 0;
Global.deltaTime = 0;


function Game()
{
	// Set game variables
}

Game.prototype.init = function()
{
	// Init all game objects
}

Game.prototype.update = function(deltaTime)
{
	// Take input
	// Update all objects
}

Game.prototype.draw = function()
{
	// Draw all objects
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
  var canvas = document.getElementById("canvas");
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
