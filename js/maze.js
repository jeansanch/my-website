const canvas = document.getElementById('mazeCanvas');
const cmat = canvas.getContext('2d');

class Player{
  constructor(x, y){
      this.x = x;
      this.y = y;
      this.fov = 90
      this.numRays = 35;
  }

  setFov(value){
      this.fov = value;
      this.numRays = this.fov*35/90;
  }

  playerRays(viewAngle){
    var dir = 0;
    var sum = 0;
    var min = 0;
    for(var i = 0; i<this.numRays; i++){
      sum = this.fov*(i/(this.numRays-1));
      min = this.fov/2;
      if (!(isFinite(sum)))
      sum = 0;
      if (!(isFinite(min)))
      min = 0;
      dir = -min+sum;
      //console.log(i/numRays)
      this.drawRay(dir+viewAngle);
    }
  }

  drawRay(direct){
    var x = 0;
    var y = 0;
    direct = degrees_to_radians(direct);
    y = this.y+Math.sin(direct)*100;
    x = this.x+Math.cos(direct)*100;
    cmat.beginPath();
    //console.log(this.x, this.y, x, y)
    cmat.strokeStyle = "white";
    cmat.lineWidth = 1;
    cmat.moveTo(this.x, this.y);
    cmat.lineTo(x, y);
    cmat.stroke();
  }

  drawPlayer(pos){
    cmat.clearRect(0, 0, canvas.width, canvas.height);
    drawBase();
    cmat.fillStyle = "white"
    cmat.beginPath();
    cmat.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    cmat.fill();
    this.playerRays(pos);
  }

  arrowMove(){
  }
}

function getMousePos(canvas, evt){
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

var debug = false;

canvas.addEventListener('mousemove', function(evt){
  if (debug){
    var mousePos = getMousePos(canvas, evt);
    user.x = mousePos.x;
    user.y = mousePos.y;
    user.drawPlayer(0);
  }
}, false);

canvas.addEventListener('keypress', function(kb){
}, false);

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}
// Outside boundry
function drawBase(){
  cmat.strokeStyle = "white";
  cmat.lineWidth = 2;
  cmat.strokeRect(0, 0, 600, 600);
}

function pressionadoDebug(){
  if(debug==false){
    document.getElementById('botaoDebug').style.cssText = 'background-color: green;';
    user.setFov(360);
    debug=true;
  }
  else{
    document.getElementById('botaoDebug').style.cssText = 'background-color: #d82424;';
    user.setFov(90);
    user.x = 300;
    user.y = 300;
    user.drawPlayer(0);
    debug=false;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Create player
user = new Player(300, 300);
async function a(){
  for (var j = 0; j<360; j++){
    user.drawPlayer(j)
    await sleep(10);
  }
}
a();
// user.drawPlayer(j);
drawBase();
