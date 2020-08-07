const canvas = document.getElementById('mazeCanvas');
const cmat = canvas.getContext('2d');

class Player{
  constructor(x, y){
      this.x = x;
      this.y = y;
  }

  playerRays(){
    let numRays = 150;
    let fov = 360;
    var viewAngle = 0;
    var dir = 0;
    var sum = 0;
    var min = 0;
    // for(viewAngle = 0; viewAngle<360; viewAngle++){
      for(var i = 0; i<numRays; i++){
        sum = fov*(i/(numRays-1));
        min = fov/2;
        if (!(isFinite(sum)))
        sum = 0;
        if (!(isFinite(min)))
        min = 0;
        dir = -min+sum;
        //console.log(i/numRays)
        this.drawRay(dir+viewAngle);
      }
    // }
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

  drawPlayer(){
    cmat.fillStyle = "white"
    cmat.beginPath();
    cmat.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    cmat.fill();
    this.playerRays();
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
    cmat.clearRect(0, 0, canvas.width, canvas.height);
    drawBase();
    user.drawPlayer();
  }
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
    debug=true;
  }
  else{
    document.getElementById('botaoDebug').style.cssText = 'background-color: #d82424;';
    debug=false;
  }
}

// Create player
user = new Player(300, 300);
user.drawPlayer();
drawBase();
