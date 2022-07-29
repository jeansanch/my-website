const canvas = document.getElementById('mazeCanvas');
const cmat = canvas.getContext('2d');

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
}

function getMousePos(canvas, evt){
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function getClosestPoint(){
    getMousePos()
}

canvas.addEventListener('click', function(evt){
    closest = getClosestPoint()
}, false);

function init(){
    line = new Line(canvas.width/4, canvas.height/2, canvas.width/4*3, canvas.height/2)   
    line.drawLine()
}

init()