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
        this.window = document.createElement('draggable-window');
        this.window.setAttribute('window-title', this.name);
        this.window.setAttribute('content-url', this.url);
        windowsOverlay.appendChild(this.window);
        this.panelIcon = document.createElement('panel-icon');
        this.panelIcon.setAttribute('icon-src', this.iconSrc);
        this.panelIcon.setAttribute('app-name', this.name);
        this.panelIcon.setAttribute('app-desc', this.desc);
        panel.appendChild(this.panelIcon);
        
        this.window.onclose = () =>
        {
            this.panelIcon.remove();
            this.window = null;
        }
    }
}