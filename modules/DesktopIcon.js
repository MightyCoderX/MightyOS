const desktopIconTemplate = document.createElement('template');

desktopIconTemplate.innerHTML = `
    <style>
        *
        {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .desktop-icon
        {
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow: hidden;
            /* max-height: 100%; */
            outline: none;
        }
        
        .desktop-icon:hover,
        .desktop-icon:focus
        {
            outline: 1px solid #0ffa;
            background: #0ff5;
        }
        
        .desktop-icon img
        {
            width: 80%;
            aspect-ratio: 1;
        }
        
        .desktop-icon p
        {
            font-size: 12px;
            margin-top: 5px;
            text-align: center;
            word-break: break-word;
            text-overflow: ellipsis;
            filter: drop-shadow(0 0 0.2rem #000);
        }
    </style>
    <div class="desktop-icon" tabindex="0">
        <img />
        <p></p>
    </div>
`;

class DesktopIcon extends HTMLElement
{
    constructor()
    {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(desktopIconTemplate.content.cloneNode(true));
    }
    
    connectedCallback()
    {
        this.shadow.querySelector('.desktop-icon img').src = this.getAttribute('icon-src');
        this.shadow.querySelector('.desktop-icon p').textContent = this.getAttribute('label');
        this.container = this.shadow.querySelector('.desktop-icon');
        
        this.container.addEventListener('dblclick', e =>
        {
            let appName = this.getAttribute('app-name');
            applications.forEach(app =>
            {
                if(app.name == appName && !app.window)
                {
                    app.createWindow();
                }
            });
        });
    }
}

customElements.define('desktop-icon', DesktopIcon);