const divOut = document.getElementById('out');

function info(text)
{
    let div = document.createElement('div');

    div.classList.add('info');
    div.innerHTML = text;
    
    divOut.appendChild(div);
}

function warn(text)
{
    let div = document.createElement('div');
    
    div.classList.add('warning');
    div.innerHTML = text;

    divOut.appendChild(div);
}

function error(text)
{
    let div = document.createElement('div');
    
    div.classList.add('error');
    div.innerHTML = text;

    divOut.appendChild(div);
}