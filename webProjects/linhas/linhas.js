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

    closestPoint(x, y, get){
        redraw();
        var point = Math.pow(x-this.x, 2)+Math.pow(y-this.y, 2);
        var point2 = Math.pow(x-this.xi, 2)+Math.pow(y-this.yi, 2);
        if (point < point2){
            if(get)
                return{
                    dist: point,
                    x: this.x,
                    y: this.y};
            drawCircle(this.x, this.y, true);
        }
        else{
            if(get)
                return{
                    dist: point2,
                    x: this.xi,
                    y: this.yi};
            drawCircle(this.xi, this.yi, true);
        }
    }

    closestLine(){
        redraw();
        let flag = false;
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
        if(Math.abs(dxl) >= Math.abs(dyl)){
            if (dxl > 0)
                flag = (this.x <= mouse.x && mouse.x <= this.xi)
            else
                flag = (this.xi <= mouse.x && mouse.x <= this.x)
        }
        else{
            if (dyl > 0)
                flag = (this.y <= mouse.y && mouse.y <= this.yi)
            else
                flag = (this.yi <= mouse.y && mouse.y <= this.y)
        }
        if(Math.abs(cross) < 201 && flag == true){
            cmat.beginPath();
            cmat.strokeStyle = "green";
            cmat.moveTo(this.x, this.y);
            cmat.lineTo(this.xi, this.yi);
            cmat.stroke();

            drawCircle(mouse.x, mouse.y);
            return true;
        }
    }

    movePoint(x, y){
        if(x == this.x && y == this.y || flagPoint == true){
            flagPoint = true;
            this.x = mouse.x;
            this.y = mouse.y;
        }
        else{
            flagPoint = false;
            this.xi = mouse.x;
            this.yi = mouse.y;
        }
    }

    moveLine(){
        var diffx = (mouse.x - startMouse.x)
        var diffy = (mouse.y - startMouse.y)
        this.x = old.x + diffx;
        this.y = old.y + diffy;
        this.xi = old.xi + diffx;
        this.yi = old.yi + diffy;
    }

    cutLine(){
        lines.push(new Line(this.x, this.y, mouse.x, mouse.y));
        lines.push(new Line(this.xi, this.yi, mouse.x, mouse.y));
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
activeSide = false;
activeLine = false;
pointx = NaN;
pointy = NaN;
flagPoint = false;
smallLine = 0;

startMouse = {
    x:0,
    y:0
}

old = {
    x:0,
    y:0
}

canvas.addEventListener('mousemove', function(evt){
    var mousePos = getMousePos(canvas, evt);
    mouse.x = mousePos.x;
    mouse.y = mousePos.y;
    smaller = Infinity;
    count = 0;
    redraw();
    if(!clicked){
        activeLine = false;
        lines.forEach(i => {
            isActive = false;
            value = i.closestPoint(mouse.x, mouse.y, true)
            isActive = i.closestLine();
            if(isActive)
                smallLine = count;
            if(value.dist < smaller){
                smaller = value.dist;
                small = count;
                pointx = value.x;
                pointy = value.y;
            }
            count+=1;
            
        })
        activeLine = lines[smallLine].closestLine();
        if (smaller < 11){
            activeSide = true;
            lines[small].closestPoint(mouse.x, mouse.y);
        }
        else
            activeSide = false;
    }
    else{
        if(activeSide)
            lines[small].movePoint(pointx, pointy);
        else{
            lines[smallLine].moveLine();
        }
    }
}, false);

canvas.addEventListener('contextmenu', function(evt){
    if(activeLine == true){
        lines[smallLine].cutLine();
        lines.splice(smallLine, 1);
        redraw();
    }
}, false);

clicked = false;

canvas.addEventListener('click', function(evt){
    if(activeSide == true){
        clicked = !clicked;
        flagPoint = false;
        lines[small].closestPoint(mouse.x, mouse.y);
    }
    else if(activeLine == true){
        clicked = !clicked;
        old.x = lines[smallLine].x;
        old.xi = lines[smallLine].xi;
        old.y = lines[smallLine].y;
        old.yi = lines[smallLine].yi;
        startMouse.x = mouse.x;
        startMouse.y = mouse.y;
    }
}, false)

function init(){
    lines.push(new Line(canvas.width/4, canvas.height/2, canvas.width/4*3, canvas.height/2))
    mouse = new Mouse(0,0);
    lines[0].drawLine();
}

function createGeometry(){
    lines = [];
    sides = document.getElementById('geometry').value;
    for(var i = 0; i<sides-1; i++){
        pos1 = getPos(i, sides);
        pos2 = getPos(i+1, sides);
        lines.push(new Line(pos1.x, pos1.y, pos2.x, pos2.y));
    }
        pos1 = getPos(sides-1, sides);
        pos2 = getPos(0, sides);
        lines.push(new Line(pos1.x, pos1.y, pos2.x, pos2.y));
    redraw();
}

function degrees_to_radians(degrees){
    var pi = Math.PI;
    return degrees * (pi/180);
}

function getPos(val, sides){
        sum = 360*(val/(sides));
        min = 360/2;
        if (!(isFinite(sum)))
        sum = 0;
        if (!(isFinite(min)))
        min = 0;
        dir = -min+sum;
        value = -dir;
        direct = degrees_to_radians(value);
        y = 200+Math.sin(direct)*100;
        x = 200+Math.cos(direct)*100;
        return{
            x: x,
            y: y
        }
}

init()