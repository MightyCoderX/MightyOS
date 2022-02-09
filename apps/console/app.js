const divOut = document.querySelector('div.out');
const jsInput = document.getElementById('jsInput');

let consoleHistory = [];
let currentIndex = 0;
let index = 0;

let oldConsole = { ...console };

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

        printInput(jsInput.value);
        
        let result = undefined;

        try
        {
            result = eval("(" + jsInput.value + ")");
            printOutput('info', `<span data-return-value><span data-return-value-prefix>&lt;&middot;</span>${parseArgs(result)}</span>`);
        }
        catch(err)
        {
            error(err.stack);
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

function displayUndefined()
{
    return `<span data-undefined>${undefined}</span>`;
}

function displayPrimitive(value)
{
    return `<span data-primitive>${value}</span>`;
}

function displayString(str)
{
    return `<span data-string>"${str}"</span>`;
}

function displayFunction(func)
{
    return `<span data-function><span data-function-prefix>ƒ</span> ${func.toString().replace(/^function /, "").replace(/\r\n/gi, "<br>")}</span>`;
}

// function displayObject(object, level)
// {
//     let detailsElem = `<details>
//     ${level == 1 ? "<summary>" + object + "</summary>" : ""}
    
//     {`;

//     for(const [key, value] of Object.entries(object))
//     {
//         let val;

//         switch(typeof value)
//         {
//             case 'object':
//                 if(Array.isArray(value))
//                 {
//                     val = `[\n${"\t".repeat(level)}${displayObject(value, level+1)}\n]`;
//                 }
//                 val = `{\n${"\t".repeat(level)}${displayObject(value, level+1)}\n}`;
//                 break;

//             case 'function':
//                 val = displayFunction(value);
//                 break;
            
//             case 'string':
//                 val = displayString(value);
            
//             default:
//                 val = displayPrimitive(value);
//         }

//         detailsElem += `${key}: ${val}\n`;
//     }

//     detailsElem += `}</details>`;

//     return detailsElem;
// }

function displayObject(object)
{
    const replacer = (key, value) =>
    {
        switch(typeof value)
        {
            case 'object':
                // Implement details elements
                // return JSON.stringify(value, replacer, 4);
                return value;

            case 'function':
                return displayFunction(value);
            
            case 'string':
                return `<span data-string>${value}</span>`;

            case 'undefined':
                return displayUndefined();
            
            case 'bigint':
            case 'number':
            case 'boolean':
                return displayPrimitive(value);

        }
    }

    return JSON.stringify(object, replacer, 4).replace(/\r\n/gi, "\n");
}

function parseArgs(...args)
{
    let res = [];

    for(let arg of args)
    {
        switch(typeof arg)
        {
            case 'object':
                try
                {
                    // res.push(displayObject(arg, 1));
                    res.push(`<pre>${displayObject(arg)}</pre>`);
                }
                catch(err)
                {
                    console.error(err);
                    res.push(arg);
                }
                break;
            
            case 'function':
                res.push(displayFunction(arg));
                break;
            
            case 'string':
                res.push(displayString(arg));
                break;

            case 'undefined':
                res.push(displayUndefined());
                break;

            default:
                res.push(displayPrimitive(arg));
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

console.dir = (...args) =>
{
    oldConsole.dir(...args);
    dir(parseArgs(...args));
}

console.clear = () =>
{
    oldConsole.clear();
    divOut.innerHTML = '';
}

function printOutput(type, value)
{
    let div = document.createElement('div');

    div.classList.add(type);
    div.innerHTML = value;
    
    divOut.appendChild(div);
}

function printInput(input)
{
    printOutput('info', `<span data-input><span data-input-prefix>&gt;</span>${input}</span>`);
}

function info(value)
{
    printOutput('info', value);
}

function warn(value)
{
    printOutput('warning', value);
}

function error(value)
{
    printOutput('error', value);
}

function dir(value)
{
    printOutput('info', value);
}