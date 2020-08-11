const canvas = document.getElementById('mazeCanvas');
const cmat = canvas.getContext('2d');
const blockDist = 50;
var blocksCreated = 0;
class Player{
  constructor(x, y){
      this.x = x;
      this.y = y;
      this.fov = 90
      this.numRays = 35;
      this.viewAngle = 270;
  }

  setFov(value){
      this.fov = value;
      this.numRays = this.fov*35/90;
  }


  playerRays(){
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
      this.drawRay(-dir-this.viewAngle);
    }
  }

  drawRay(direct){
    var x = 0;
    var y = 0;
    direct = degrees_to_radians(direct);
    y = this.y+Math.sin(direct)*100;
    x = this.x+Math.cos(direct)*100;
    cmat.beginPath();
    cmat.strokeStyle = "white";
    cmat.lineWidth = 1;
    cmat.moveTo(this.x, this.y);
    cmat.lineTo(x, y);
    cmat.stroke();
  }

  drawPlayer(){
    //drawBase();
    cmat.fillStyle = "white"
    cmat.beginPath();
    cmat.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    cmat.fill();
    this.playerRays();
  }

  arrowMove(){
  }
}

class Barrier{

  constructor(x1, y1, x2, y2){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

}

class MazeBlock{

  constructor(xAxis, yAxis, fath, lastSize){
    this.x = xAxis;
    this.y = yAxis;
    this.up = null;
    this.left = null;
    this.right = null;
    this.down = null;
    this.father = fath;
    this.size = lastSize+1;
    this.xP = (cmat.getImageData(this.x+blockDist, this.y, 1, 1).data)[0];
    this.xM = (cmat.getImageData(this.x-blockDist, this.y, 1, 1).data)[0];
    this.yP = (cmat.getImageData(this.x, this.y+blockDist, 1, 1).data)[0];
    this.yM = (cmat.getImageData(this.x, this.y-blockDist, 1, 1).data)[0];
    cmat.fillStyle = "black";
    cmat.fillRect(this.x-blockDist/2, this.y-blockDist/2, blockDist, blockDist);
    this.create();
  }

  create(){
    blocksCreated++;
    if (this.yM != 255  && this.yP != 255 && this.xP != 255 && this.xM != 255){
      return;
    }

    var rand = this.createAux(false);
    var divide = Math.floor(Math.random() * 2);

    if(divide == 1){
      return;
    }
    this.xP = (cmat.getImageData(this.x+blockDist, this.y, 1, 1).data)[0];
    this.xM = (cmat.getImageData(this.x-blockDist, this.y, 1, 1).data)[0];
    this.yP = (cmat.getImageData(this.x, this.y+blockDist, 1, 1).data)[0];
    this.yM = (cmat.getImageData(this.x, this.y-blockDist, 1, 1).data)[0];
    switch(rand){
      case 0:
        if (this.yP != 255 && this.xP != 255 && this.xM != 255){
          return;
        }
      break;

      case 1:
        if (this.yM != 255 && this.xP != 255 && this.xM != 255){
          return;
        }
      break;

      case 2:
        if (this.yM != 255 && this.yP != 255 && this.xP != 255){
          return;
        }
      break;

      case 3:
        if (this.yM != 255 && this.yP != 255 && this.xM != 255){
          return;
        }
      break;
      }
    cmat.fillStyle = "blue";
    cmat.fillRect(this.x-blockDist/2, this.y-blockDist/2, blockDist, blockDist);
    this.createAux(true, rand);
    cmat.fillStyle = "black";
    cmat.fillRect(this.x-blockDist/2, this.y-blockDist/2, blockDist, blockDist);
  }

  createAux(second, oldRand){
    var rand;
    while(true){
      rand = second ? (Math.floor(Math.random() * 3)+1+oldRand) % 4 : Math.floor(Math.random() * 4);
      switch(rand){
        case 0:
          if(this.yM != 255){
              break;
          }
          this.up = new MazeBlock(this.x, this.y-blockDist, this, this.size);
          return rand;
        break;

        case 1:
          if(this.yP != 255){
              break;
          }
          this.down = new MazeBlock(this.x, this.y+blockDist, this, this.size);
          return rand;
        break;

        case 2:
          if(this.xM != 255){
              break;
          }
          this.left = new MazeBlock(this.x-blockDist, this.y, this, this.size);
          return rand;
        break;

        case 3:
          if(this.xP != 255){
              break;
          }
          this.right = new MazeBlock(this.x+blockDist, this.y, this, this.size);
          return rand;
        break;
      }
    }
    return rand;
  }
}

function getMousePos(canvas, evt){
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

canvas.addEventListener('mousemove', function(evt){
  if (debug){
    var mousePos = getMousePos(canvas, evt);
    user.x = mousePos.x;
    user.y = mousePos.y;
    user.drawPlayer();
  }
}, false);

var Keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  w: false,
  a: false,
  s: false,
  d: false
};

window.onkeydown = function(kb){
  console.log("A key was pressed")
  var kc = kb.keyCode;
  kb.preventDefault();

  if      (kc === 37) Keys.left = true;
  else if (kc === 38) Keys.up = true;
  else if (kc === 39) Keys.right = true;
  else if (kc === 40) Keys.down = true;
  else if (debug){
    if (kc === 87) Keys.w = true;
    else if (kc === 65) Keys.a = true;
    else if (kc === 83) Keys.s = true;
    else if (kc === 68) Keys.d = true;
  }

  if (Keys.up) {
    user.y -= Math.sin(radAngle)*5;
    user.x += Math.cos(radAngle)*5;
    user.drawPlayer();
  }
  else if (Keys.down){
    user.y += Math.sin(radAngle)*5;
    user.x -= Math.cos(radAngle)*5;
    user.drawPlayer();
  }

  if (Keys.left){
    user.viewAngle+=15;
    user.viewAngle = user.viewAngle % 360;
    radAngle = degrees_to_radians(user.viewAngle);
    user.drawPlayer();
  }
  else if (Keys.right){
    user.viewAngle-=15;
    user.viewAngle = user.viewAngle % 360;
    radAngle = degrees_to_radians(user.viewAngle);
    user.drawPlayer();
  }
  if (debug){
    if (Keys.w){
      user.y+=5;
      user.drawPlayer();
    }
    else if (Keys.s){
      user.y-=5;
      user.drawPlayer();
    }
    else if (Keys.a){
      user.x-=5;
      user.drawPlayer();
    }
    else if (Keys.d){
      user.x+=5;
      user.drawPlayer();
    }
  }
};

window.onkeyup = function(kb) {
  var kc = kb.keyCode;
  kb.preventDefault();

  if      (kc === 37) Keys.left = false;
  else if (kc === 38) Keys.up = false;
  else if (kc === 39) Keys.right = false;
  else if (kc === 40) Keys.down = false;
  else if (kc === 87) Keys.w = false;
  else if (kc === 65) Keys.a = false;
  else if (kc === 83) Keys.s = false;
  else if (kc === 68) Keys.d = false;
};

function degrees_to_radians(degrees){
  var pi = Math.PI;
  return degrees * (pi/180);
}

function drawBase(){
  cmat.clearRect(0, 0, canvas.width, canvas.height);
  cmat.strokeStyle = "white";
  cmat.lineWidth = 2;
  cmat.strokeRect(0, 0, 600, 600);
}

var debug = false;
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
    user.drawPlayer();
    debug=false;
  }
}

var spin = false;
function pressionadoSpin(){
  if(spin==false){
    document.getElementById('botaoSpin').style.cssText = 'background-color: green;';
    spin=true;
    sbinalla();
  }
  else{
    document.getElementById('botaoSpin').style.cssText = 'background-color: #d82424;';
    spin=false;
  }
}


function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateMaze(){
  cmat.fillStyle = "red";
  cmat.fillRect(0, 0, 600, 600);
  return new MazeBlock(25,25, null, 0);
}

async function sbinalla(){
  if(!spin){
    return;
  }
  for (var j = 0; j<360; j++){
    user.viewAngle++;
    user.drawPlayer()
    await sleep(10);
  }
  sbinalla();
}

function drawFirstWalls(point){
    cmat.beginPath();
    cmat.strokeStyle = "white";
    cmat.moveTo(point.x-blockDist/2, point.y-blockDist/2);
    cmat.lineTo(point.x+blockDist/2, point.y-blockDist/2);
    cmat.stroke();

    cmat.moveTo(point.x-blockDist/2, point.y-blockDist/2);
    cmat.lineTo(point.x-blockDist/2, point.y+blockDist/2);
    cmat.stroke();

  if(point.down == null){
    cmat.beginPath();
    cmat.strokeStyle = "white";
    cmat.moveTo(point.x-blockDist/2, point.y+blockDist/2);
    cmat.lineTo(point.x+blockDist/2, point.y+blockDist/2);
    cmat.stroke();
  }
  else{
    drawWalls(point.down);
  }

  if(point.right == null){
    cmat.beginPath();
    cmat.strokeStyle = "white";
    cmat.moveTo(point.x+blockDist/2, point.y-blockDist/2);
    cmat.lineTo(point.x+blockDist/2, point.y+blockDist/2);
    cmat.stroke();
  }
  else{
    drawWalls(point.right);
  }
}

function drawWalls(point){
  if(point.up == null && point != point.father.down){
    cmat.beginPath();
    cmat.strokeStyle = "white";
    cmat.moveTo(point.x-blockDist/2, point.y-blockDist/2);
    cmat.lineTo(point.x+blockDist/2, point.y-blockDist/2);
    cmat.stroke();
  }
  else if (point != point.father.down){
    drawWalls(point.up);
  }

  if(point.down == null && point != point.father.up){
    cmat.beginPath();
    cmat.strokeStyle = "white";
    cmat.moveTo(point.x-blockDist/2, point.y+blockDist/2);
    cmat.lineTo(point.x+blockDist/2, point.y+blockDist/2);
    cmat.stroke();
  }
  else if (point != point.father.up){
    drawWalls(point.down);
  }

  if(point.left == null && point != point.father.right){
    cmat.beginPath();
    cmat.strokeStyle = "white";
    cmat.moveTo(point.x-blockDist/2, point.y-blockDist/2);
    cmat.lineTo(point.x-blockDist/2, point.y+blockDist/2);
    cmat.stroke();
  }
  else if (point != point.father.right){
    drawWalls(point.left);
  }

  if(point.right == null && point != point.father.left){
    cmat.beginPath();
    cmat.strokeStyle = "white";
    cmat.moveTo(point.x+blockDist/2, point.y-blockDist/2);
    cmat.lineTo(point.x+blockDist/2, point.y+blockDist/2);
    cmat.stroke();
  }
  else if (point != point.father.left){
    drawWalls(point.right);
  }
}


var init = generateMaze();
drawFirstWalls(init);

// Create player
user = new Player(25, 25);

var radAngle = degrees_to_radians(user.viewAngle);

user.drawPlayer();

console.log("Blocks created = "+blocksCreated);
