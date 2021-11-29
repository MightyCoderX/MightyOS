const btnStartMenu = document.getElementById('btnStartMenu');
const menuElem = document.querySelector('.menu');
const desktop = document.querySelector('.desktop');
const windowsOverlay = document.querySelector('.windows-overlay');
const panel = document.querySelector('.panel');

const applications = new Set();

btnStartMenu.addEventListener('click', e =>
{
    if(!menuElem.classList.contains('show'))
    {
        menuElem.classList.add('show');
        menuElem.focus();
        document.addEventListener('click', e =>
        {
            if(e.target == menuElem || e.target == btnStartMenu) return;
            
            if(menuElem.classList.contains('show'))
            {
                menuElem.classList.remove('show');
            }
        });
    }
    else
    {
        menuElem.classList.remove('show');
    }
});

let consoleApp = new Application('Console', 'A basic console that logs', './apps/console/icon.svg', './apps/console/');
consoleApp.createWindow();


applications.add(consoleApp);
applications.add(new Application('Notepad', 'A basic notepad', './apps/notepad/icon.svg', './apps/notepad/'));
applications.add(new Application('MightyCoderX', 'My website', 'https://mightycoderx.github.io/images/bg.jpg', 'https://mightycoderx.github.io'));
applications.add(new Application("MightyOS", "this", "/favicon.ico", "https://mightycoderx.github.io/MightyOS/"));

let oldConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
}

function parseArgs(...args)
{
    let res = "";

    for(let arg of args)
    {
        if(arg instanceof Object)
        {
            res += '<i>' + JSON.stringify(arg, null, ' ');
        }
        else
        {
            res += ` "${arg}"`;
        }
    }

    return res;
}

console.log = (...args) =>
{
    oldConsole.log(...args);

    let frame = consoleApp.window.shadowRoot.querySelector('iframe');
    frame.contentWindow.info(parseArgs(...args));
}

console.info = (...args) =>
{
    oldConsole.info(...args);

    let frame = consoleApp.window.shadowRoot.querySelector('iframe');
    frame.contentWindow.info(parseArgs(...args));
}

console.warn = (...args) =>
{
    oldConsole.warn(...args);

    let frame = consoleApp.window.shadowRoot.querySelector('iframe');
    frame.contentWindow.warn(parseArgs(...args));
}

console.error = (...args) =>
{
    oldConsole.error(...args);
    let frame = consoleApp.window.shadowRoot.querySelector('iframe');
    frame.contentWindow.error(parseArgs(...args));
}

for(let app of applications)
{
    let desktopIcon = document.createElement('desktop-icon');
    desktopIcon.setAttribute('icon-src', app.iconSrc);
    desktopIcon.setAttribute('label', app.name);
    desktopIcon.setAttribute('app-name', app.name);
    desktop.appendChild(desktopIcon);
}