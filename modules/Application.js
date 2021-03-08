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
    }
}