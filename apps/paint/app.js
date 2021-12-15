let down = false;
let tools = 
{
    pen: 'pen',
    eraser: 'eraser',
    circle: 'circle'
};
let tool = tools.pen;
let color = getComputedStyle(document.body).color;

const toolbar = document.querySelector('div.toolbar');
const canvas = document.createElement('canvas');
const btnClear = document.getElementById('btnClear');
const sldSize = document.getElementById('sldSize');
const nmbSize = document.getElementById('nmbSize');
const btnPen = document.getElementById('btnPen');
const btnEraser = document.getElementById('btnEraser');
const btnCircle = document.getElementById('btnCircle');
const colorPicker = document.getElementById('colorPicker');
const btnDownload = document.getElementById('btnDownload');
const btnColors = Array.from(document.querySelectorAll('.btn-color'));

canvas.id = 'canvas';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.prepend(canvas);

btnDownload.addEventListener('click', e =>
{
    const aElem = document.createElement('a');
    aElem.href = canvas.toDataURL();
    aElem.download = 'image.png';
    document.body.appendChild(aElem);
    aElem.click();
    aElem.remove();
});

let ctx = canvas.getContext('2d');
ctx.fillStyle = getComputedStyle(canvas).backgroundColor;
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = getComputedStyle(document.body).color;
ctx.strokeStyle = getComputedStyle(document.body).color;

let size = sldSize.value;

let posX, posY;

// resizeCanvas();
// new ResizeObserver(resizeCanvas).observe(canvas);

// function resizeCanvas()
// {
//     // let newCanvas = document.createElement('canvas');
//     // newCanvas.id = 'canvas';
//     // newCanvas.width = getComputedStyle(canvas).width.replace('px', '');
//     // newCanvas.height = getComputedStyle(canvas).height.replace('px', '');
//     // canvas.remove();
//     // document.body.prepend(newCanvas);
//     // canvas = newCanvas;

//     canvas.width = getComputedStyle(canvas).width.replace('px', '');
//     canvas.height = getComputedStyle(canvas).height.replace('px', '');
// }

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('contextmenu', mouseUp);
canvas.addEventListener('mousedown', e =>
{
    toolbar.classList.add('hidden');
    down = true;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if(tool == tools.circle)
    {
        drawCircle(ctx, posX, posY, size, color);
    }
    else
    {
        ctx.beginPath();
        ctx.moveTo(posX, posY);
        ctx.lineTo(posX, posY);
        ctx.stroke();
    }
});
window.addEventListener('mouseup', mouseUp);
canvas.addEventListener('mouseleave', mouseUp);

function mouseUp()
{
    down = false;
    toolbar.classList.remove('hidden');
}

btnColors.forEach(btn =>
{
    btn.style.backgroundColor = btn.dataset.color;
    btn.addEventListener('click', e =>
    {
        color = ctx.strokeStyle = btn.dataset.color;
    });
});
colorPicker.addEventListener('change', e =>
{
    color = ctx.strokeStyle = e.target.value;
});

btnClear.addEventListener('click', clearCanvas);

sldSize.addEventListener('input', function()
{
    size = sldSize.value;
    nmbSize.value = size;
});
nmbSize.value = 4;
nmbSize.addEventListener('change', function()
{
    sldSize.value = nmbSize.value;
    size = nmbSize.value;
});

btnPen.addEventListener('click', function()
{
    tool = tools.pen;
});
btnEraser.addEventListener('click', function()
{
    tool = tools.eraser;
});
btnCircle.addEventListener('click', function()
{
    tool = tools.circle;
});

document.addEventListener('keydown', function(e)
{
    if(e.ctrlKey)
    { 
        if(e.key == 'x')
        {
            clearCanvas();
        }
    }   
});

function clearCanvas()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw(e)
{
    ctx.lineCap = 'round';
    ctx.lineWidth = size;

    posX = e.pageX - canvas.offsetLeft;
    posY = e.pageY - canvas.offsetTop;
    
    if(down)
    {
        if(tool == tools.pen)
        {
            ctx.lineTo(posX, posY);
            ctx.stroke();
            //context.closePath();
        }
        else if(tool == tools.eraser)
        {
            let strokeStyle = ctx.strokeStyle;
            ctx.strokeStyle = getComputedStyle(canvas).backgroundColor;
            ctx.lineTo(posX, posY);
            ctx.stroke();
            ctx.strokeStyle = strokeStyle;
        }
    }
}

function drawCircle(context, x, y, radius, color)
{
    context.beginPath();
    context.arc(x, y, radius/2, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    context.stroke();
}

