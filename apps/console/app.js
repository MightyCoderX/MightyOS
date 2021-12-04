const divOut = document.querySelector('div.out');
const jsInput = document.getElementById('jsInput');

let consoleHistory = [];
let currentIndex = 0;
let index = 0;

jsInput.focus();
window.addEventListener('focus', () => jsInput.focus());

new MutationObserver(mutations =>
{
    mutations.forEach(mutation =>
    {
        if(mutation.type == 'childList')
        {
            document.scrollingElement.scrollTo(0, document.scrollingElement.scrollHeight+100);
        }
    });
}).observe(divOut, {
    childList: true
});

jsInput.addEventListener('keydown', e =>
{
    if(e.key == 'Enter')
    {
        if(!jsInput.value.trim()) return;

        let result = undefined;

        try
        {
            result = eval(jsInput.value);
            info(parseArgs(result));
        }
        catch(ex)
        {
            console.log(ex);
            error(ex.stack);
        }
        
        consoleHistory.push(jsInput.value);
        index++;
        currentIndex = index;

        jsInput.value = '';
    }

    if(e.key == 'ArrowUp')
    {
        if(index <= 0) return;
        index--;
        jsInput.value = consoleHistory[index];
    }
    else if(e.key == 'ArrowDown')
    {
        if(index >= consoleHistory.length-1) return;
        index++;
        jsInput.value = consoleHistory[index];
    } 
    // oldConsole.log(index);
});

jsInput.addEventListener('input', e =>
{
    e.preventDefault();
    if(!jsInput.value.trim())
    {
        index = currentIndex;
    }
});

let oldConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
}

function parseArgs(...args)
{
    let res = [];

    for(let arg of args)
    {
        if(arg instanceof Object)
        {
            try
            {
                res.push('<i>' + JSON.stringify(arg, null, ' '));
            }
            catch(err)
            {
                res.push(arg);
            }
        }
        else
        {
            if(typeof arg == 'string')
            {
                res.push(`"${arg}"`);
            }
            else
            {
                res.push(`${arg}`);
            }
        }
    }

    return res;
}

console.log = (...args) =>
{
    oldConsole.log(...args);
    info(parseArgs(...args));
}

console.info = (...args) =>
{
    oldConsole.info(...args);
    info(parseArgs(...args));
}

console.warn = (...args) =>
{
    oldConsole.warn(...args);
    warn(parseArgs(...args));
}

console.error = (...args) =>
{
    oldConsole.error(...args);
    error(parseArgs(...args));
}

function message(type, text)
{
    let div = document.createElement('div');

    div.classList.add(type);
    div.innerHTML = text;
    
    divOut.appendChild(div);
}

function info(text)
{
    message('info', text);
}

function warn(text)
{
    message('warning', text);
}

function error(text)
{
    message('error', text);
}