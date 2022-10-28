class Application
{
    constructor(name, desc, iconSrc, url)
    {
        this.name = name;
        this.desc = desc;
        this.iconSrc = iconSrc;
        this.url = url;
    }

    createWindow()
    {
        this.panelIcon = document.createElement('panel-icon');
        this.panelIcon.setAttribute('icon-src', this.iconSrc);
        this.panelIcon.setAttribute('app-name', this.name);
        this.panelIcon.setAttribute('app-desc', this.desc);
        panelApps.appendChild(this.panelIcon);

        this.window = document.createElement('draggable-window');
        this.window.setAttribute('window-title', this.name);
        this.window.setAttribute('content-url', this.url);
        const iconRect = this.panelIcon.getBoundingClientRect();
        this.window.setAttribute('minimize-origin', `${iconRect.x + iconRect.width/2} ${iconRect.y + iconRect.height/2}`);
        windowsOverlay.appendChild(this.window);
        
        this.window.addEventListener('close', () =>
        {
            this.panelIcon.remove();
            this.panelIcon = null;
            this.window = null;
        });
    }
}