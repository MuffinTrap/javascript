var context = null;
var stars = [];
var starAmount = 100;
var canvasHeight = 0;
var canvasWidth = 0;

var deltaTime = 0;
var nowTime = 0;
var lastTime = 0;
/** Abstract class */
function Drawable()
{
  this.init = function(x,y)
  {
    this.x = x;
    this.y = y;
  }
  
  this.speed = 0.0;
  
  this.draw = function()
  {
  };

}
 
 var red = "#dd0025";
 var blue = "#2500dd";
 var white = "#dddddd";
  function Color()
  {
    this.rbgColor = "#ffffff";
    
    this.randomize = function()
    {
      var color = Math.round(Math.random() * 3.0);
      if(color == 1)
      {
        this.rgbColor =red;
      }
      else if(color == 2)
      {
        this.rgbColor =blue;
      }
      else 
      {
        this.rgbColor =white;
      }
    };
  }
    
/** star derived from drawable */
function Star()
{
  this.speed = 3.0;
  this.size = 2.0;
  this.color = new Color();

  this.randomInit = function()
  {
    this.speed = 1.0 + (Math.random() * 5.0);
    this.size = Math.round(Math.random() * 4.0);
    this.color.randomize();
  }
}
Star.prototype = new Drawable();


function CreateStars()
{
  var randomY = 0;
  var interval = canvasWidth/starAmount
  for(var i = 0; i < starAmount; i++)
  {
    stars.push(new Star());
    randomY = Math.random() * canvasHeight;
    stars[i].init(i * interval, randomY);
    stars[i].randomInit(); 
  }
}

function DrawStars()
{
  
  context.beginPath();
  context.fillStyle = "rgba(0,0,0,0.6)";
  context.rect(0,0,400,400);
  context.fill();
  context.closePath();


  for( var i = 0; i < starAmount; i++)
  {
    context.beginPath();
    context.rect(stars[i].x - stars[i].size, stars[i].y - stars[i].size, stars[i].size, stars[i].size);
    context.fillStyle = stars[i].color.rgbColor;
    context.fill();
    context.closePath();
  }
}



function MoveStars(delta)
{
  for( var i = 0; i < starAmount; i++)
  {
    //console.log("Starmove is " , stars[i].speed * delta);
    stars[i].y -= (stars[i].speed );
    if(stars[i].y < 0)
    {
      stars[i].y = stars[i].y + canvasHeight;
      stars[i].randomInit();
    }
  }
}

function animate()
{
  nowTime = new Date().getTime();
  deltaTime = nowTime - lastTime;
  deltaTime =  deltaTime/1000.0;
  DrawStars();
  MoveStars(deltaTime);
  lastTime = nowTime;

  requestAnimFrame(animate);

}
function Game()
{
  this.start = function()
  {
    animate();
  }

}

function Init()
{

  var canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  if(context != null)
  {
    console.log("Context obtained");
  }
  canvasHeight = canvas.height;
  canvasWidth = canvas.width;
  console.log("Canvas", canvasHeight, " " , canvasWidth);
  var game = new Game();
  CreateStars();
  game.start();
}

window.onload = function()
{

  Init();
}

/** set requestAnimFrame to one supported by browser */
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


