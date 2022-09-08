const btnStartMenu = document.getElementById('btnStartMenu');
const btnShutdown = document.getElementById('btnShutdown');
const btnRestart = document.getElementById('btnRestart');
const menuElem = document.querySelector('.menu');
const desktop = document.querySelector('.desktop');
const windowsOverlay = document.querySelector('.windows-overlay');
const panelApps = document.querySelector('.panel .panel-apps');

const btnClock = document.querySelector('.panel .panel-right #clock');
setInterval(() =>
{
    btnClock.innerText = (new Date()).toLocaleTimeString();
    btnClock.title = (new Date()).toLocaleDateString();
}, 500);

const applications = new Set();

if(localStorage.getItem('desktop-bg'))
{
    desktop.style.backgroundImage = `url('${localStorage.getItem('desktop-bg')}')`;
}

function openContextMenu(x, y)
{
    const contextMenu = new ContextMenu([
        {
            label: 'Set Desktop Background',
            action()
            {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.style.display = 'none';

                document.body.appendChild(fileInput);

                fileInput.click();
                fileInput.addEventListener('input', () =>
                {
                    const image = fileInput.files[0];
                    const reader = new FileReader();
                    
                    reader.readAsDataURL(image);
                    
                    reader.addEventListener('load', () =>
                    {
                        desktop.style.backgroundImage = `url('${reader.result}')`;
                        localStorage.setItem('desktop-bg', reader.result);
                    });
                });
                fileInput.remove();

            }
        },
        {
            label: 'Refresh',
            action: createDesktopIcons
        }
    ], { x, y });

    document.querySelector('context-menu')?.remove?.();
    document.body.appendChild(contextMenu);
}

desktop.addEventListener('contextmenu', e =>
{
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY);
});

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

btnRestart.addEventListener('click', () => location.reload());
btnShutdown.addEventListener('click', () => window.close());

let consoleApp = new Application('Console', 'A basic console that logs', './apps/console/icon.svg', './apps/console/');
applications.add(consoleApp);

applications.add(new Application('Notepad', 'A basic notepad', './apps/notepad/icon.svg', './apps/notepad/'));
applications.add(new Application('Browser', 'A basic web browser', './apps/browser/icon.svg', './apps/browser'));
applications.add(new Application('Paint', 'A basic painting app', './apps/paint/icon.ico', './apps/paint'));

applications.add(new Application('MightyCoderX', 'My website', 'https://mightycoderx.github.io/images/bg.jpg', 'https://mightycoderx.github.io'));
applications.add(new Application('MightyOS', 'this', 'https://mightycoderx.github.io/favicon.ico', './'));
applications.add(new Application('LAN-Chat', 'My LAN Chat', 'https://mcx-lan-chat.herokuapp.com/img/icon.svg', 'https://mcx-lan-chat.herokuapp.com'));
applications.add(new Application('MusicMaker', 'Play Music and record it!', 'https://mightycoderx.github.io/MusicMaker/icon.svg', 'https://mightycoderx.github.io/MusicMaker/'));

function createDesktopIcons()
{
    desktop.innerHTML = '';
    for(let app of applications)
    {
        let desktopIcon = document.createElement('desktop-icon');
        desktopIcon.setAttribute('icon-src', app.iconSrc);
        desktopIcon.setAttribute('label', app.name);
        desktopIcon.setAttribute('app-name', app.name);
        desktopIcon.setAttribute('title', app.desc);
        desktop.appendChild(desktopIcon);
    }
}

function createStartMenuItems()
{
    const startMenuAppList = menuElem.querySelector('.app-list');
    for(let app of applications)
    {
        let startMenuItem = document.createElement('start-menu-item');
        startMenuItem.setAttribute('app-name', app.name);
        startMenuItem.setAttribute('icon-src', app.iconSrc);
        startMenuAppList.appendChild(startMenuItem);
    }
}

createDesktopIcons();
createStartMenuItems();
