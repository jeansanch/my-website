const canvas = document.getElementById('mazeCanvas');
const cmat = canvas.getContext('2d');
let lines = [];

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

    closestPoint(x, y, get){
        var point = Math.pow(x-this.x, 2)+Math.pow(y-this.y, 2);
        var point2 = Math.pow(x-this.xi, 2)+Math.pow(y-this.yi, 2);
        if (point < point2){
            if(get)
                return point;
            drawCircle(this.x, this.y, true);
        }
        else{
            if(get)
                return point2;
            drawCircle(this.xi, this.yi, true);
        }
    }

    closestLine(x, y){
        var offset = 0;
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
        if(cross == 0){
            cmat.beginPath();
            cmat.strokeStyle = "green";
            cmat.moveTo(this.x, this.y);
            cmat.lineTo(this.xi, this.yi);
            cmat.stroke();

            drawCircle(mouse.x, mouse.y);
        }
    }
}

function redraw(){
    cmat.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(i => {
        i.drawLine();
    })
}

function drawCircle(x, y, end){
    cmat.fillStyle = end ? clicked ? "green": "red" : "yellow"
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

small = -1;

canvas.addEventListener('mousemove', function(evt){
    var mousePos = getMousePos(canvas, evt);
    mouse.x = mousePos.x;
    mouse.y = mousePos.y;
    smaller = Infinity;
    count = 0;
    lines.forEach(i => {
        value = i.closestPoint(mouse.x, mouse.y, true)
        if(value < smaller)
            smaller = value;
            small = count;
        count+=1;
    })
    lines[small].drawClosest(mouse.x, mouse.y);

    
}, false);

canvas.addEventListener('contextmenu', function(evt){
    console.log("right")
}, false);

    //CORTAR LINHA AO MEIO
clicked = false;

canvas.addEventListener('click', function(evt){
    console.log("click")
    clicked = !clicked;
    lines[small].drawClosest(mouse.x, mouse.y);

    //MOVER LINHA
}, false)

function init(){
    lines.push(new Line(canvas.width/4, canvas.height/2, canvas.width/4*3, canvas.height/2))
    mouse = new Mouse(0,0);
    lines[0].drawLine();
}

init()