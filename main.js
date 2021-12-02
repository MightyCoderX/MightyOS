const btnStartMenu = document.getElementById('btnStartMenu');
const menuElem = document.querySelector('.menu');
const desktop = document.querySelector('.desktop');
const windowsOverlay = document.querySelector('.windows-overlay');
const panelApps = document.querySelector('.panel .panel-apps');

const btnClock = document.querySelector('.panel .panel-right #clock');
setInterval(() =>
{
    btnClock.innerText = (new Date()).toLocaleTimeString();
    btnClock.title = (new Date()).toLocaleString();
}, 500);

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
applications.add(consoleApp);
consoleApp.createWindow();

applications.add(new Application('Notepad', 'A basic notepad', './apps/notepad/icon.svg', './apps/notepad/'));
applications.add(new Application('Browser', 'A basic web browser', './apps/browser/icon.svg', './apps/browser'));

applications.add(new Application('MightyCoderX', 'My website', 'https://mightycoderx.github.io/images/bg.jpg', 'https://mightycoderx.github.io'));
applications.add(new Application('MightyOS', 'this', 'https://mightycoderx.github.io/favicon.ico', './'));
applications.add(new Application('LAN-Chat', 'My LAN Chat', 'https://mcx-lan-chat.herokuapp.com/img/icon.svg', 'https://mcx-lan-chat.herokuapp.com'));

let oldConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
}

function parseArgs(...args)
{
    let res = '';

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

    if(!consoleApp.window) return;

    let frame = consoleApp.window.iframe;
    if(!frame) return;
    frame?.contentWindow?.info?.(parseArgs(...args));
}

console.info = (...args) =>
{
    oldConsole.info(...args);

    if(!consoleApp.window) return;

    let frame = consoleApp.window.iframe;
    if(!frame) return;
    frame?.contentWindow?.info?.(parseArgs(...args));
}

console.warn = (...args) =>
{
    oldConsole.warn(...args);

    if(!consoleApp.window) return;

    let frame = consoleApp.window.iframe;
    frame?.contentWindow?.warn?.(parseArgs(...args));
}

console.error = (...args) =>
{
    oldConsole.error(...args);

    if(!consoleApp.window) return;

    let frame = consoleApp.window.iframe;
    if(!frame) return;
    frame?.contentWindow?.error?.(parseArgs(...args));
}

for(let app of applications)
{
    let desktopIcon = document.createElement('desktop-icon');
    desktopIcon.setAttribute('icon-src', app.iconSrc);
    desktopIcon.setAttribute('label', app.name);
    desktopIcon.setAttribute('app-name', app.name);
    desktopIcon.setAttribute('title', app.desc);
    desktop.appendChild(desktopIcon);

    let startMenuItem = document.createElement('start-menu-item');
    startMenuItem.setAttribute('app-name', app.name);
    startMenuItem.setAttribute('icon-src', app.iconSrc);
    menuElem.appendChild(startMenuItem);
}