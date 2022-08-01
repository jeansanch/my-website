const canvas = document.getElementById('mazeCanvas');
const cmat = canvas.getContext('2d');

class Mouse{

    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class Line{

    constructor(x, y, xi, yi){
        this.x = x;
        this.y = y;
        this.xi = xi;
        this.yi = yi;
    }

    drawLine(){
        cmat.beginPath();
        cmat.strokeStyle = "white";
        cmat.moveTo(this.x, this.y);
        cmat.lineTo(this.xi, this.yi);
        cmat.stroke();
    }

    drawClosest(x, y){
        redraw();
        this.closestLine(x,y);
        this.closestPoint(x,y);        
       
    }

    closestPoint(x, y){
        var point = Math.pow(x-this.x, 2)+Math.pow(y-this.y, 2);
        var point2 = Math.pow(x-this.xi, 2)+Math.pow(y-this.yi, 2);
        if (point < point2){
            drawCircle(this.x, this.y);
        }
        else
            drawCircle(this.xi, this.yi);

    }

    closestLine(x, y){
        var offset = 5
        var dxc = mouse.x - this.x;
        var dyc = mouse.y - this.y;
        var dxl = this.xi - this.x;
        var dyl = this.yi - this.y;
        if(dxc >= -offset && dxc <= offset)
            dxc = 0;
        if(dyl >= -offset && dyl <= offset)
            dyl = 0
        if(dxl >= -offset && dxl <= offset)
            dxl = 0;
        if(dyc >= -offset && dyc <= offset)
            dyc = 0
        var cross = dxc * dyl - dyc * dxl;
        if(cross != 0){
            
        }
        else{
            cmat.beginPath();
            cmat.strokeStyle = "green";
            cmat.moveTo(this.x, this.y);
            cmat.lineTo(this.xi, this.yi);
            cmat.stroke();
        }
    }
}

function redraw(){
    cmat.clearRect(0, 0, canvas.width, canvas.height);
    line.drawLine();
}

function drawCircle(x, y){
    if(mouseDown)
        cmat.fillStyle = "green"
    else 
        cmat.fillStyle = "red"
    cmat.beginPath();
    cmat.arc(x, y, 5, 0, 2 * Math.PI);
    cmat.fill();
}

function getMousePos(canvas, evt){
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

canvas.addEventListener('mousemove', function(evt){
    var mousePos = getMousePos(canvas, evt);
    mouse.x = mousePos.x;
    mouse.y = mousePos.y;
    line.drawClosest(mouse.x, mouse.y)
}, false);

canvas.addEventListener('contextmenu', function(evt){
    var offset = 5
    var dxc = mouse.x - line.x;
    var dyc = mouse.y - line.y;
    var dxl = line.xi - line.x;
    var dyl = line.yi - line.y;
    if(dxc >= -offset && dxc <= offset)
        dxc = 0;
    if(dyl >= -offset && dyl <= offset)
        dyl = 0
    if(dxl >= -offset && dxl <= offset)
        dxl = 0;
    if(dyc >= -offset && dyc <= offset)
        dyc = 0
    console.log(dxc + ", " +dyl + ", " +dyc + ", " +dxl)
    var cross = dxc * dyl - dyc * dxl;
    if(cross != 0){
        console.log(false)
    }
    else 
        console.log(true)
}, false);

let mouseDown = false;
document.body.onmousedown = () => {
  mouseDown = true;
  line.drawClosest(mouse.x, mouse.y)
};
document.body.onmouseup = () => {
  mouseDown = false;
};


function init(){
    line = new Line(canvas.width/4, canvas.height/2, canvas.width/4*3, canvas.height/2)   
    mouse = new Mouse(0,0);
    line.drawLine()
}

init()