const btnStartMenu = document.getElementById('btnStartMenu');
const menuElem = document.querySelector('.menu');
const desktop = document.querySelector('.desktop');
const windowsOverlay = document.querySelector('.windows-overlay');

const applications = new Set();

btnStartMenu.addEventListener('click', e =>
{
    menuElem.classList.toggle('show');
});

applications.add(new Application('MightyCoderX', 'My website', 'https://mightycoderx.github.io/images/bg.jpg', 'https://mightycoderx.github.io'));

for(let app of applications)
{
    let desktopIcon = document.createElement('desktop-icon');
    desktopIcon.setAttribute('icon-src', app.iconSrc);
    desktopIcon.setAttribute('label', app.name);
    desktopIcon.setAttribute('app-name', app.name);
    desktop.appendChild(desktopIcon);
}