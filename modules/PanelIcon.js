const panelAppIconTemplate = document.createElement('template');

panelAppIconTemplate.innerHTML = `
<style>
    .panel-icon
    {
        display: grid;
        position: relative;
        height: 100%;
        overflow: hidden;
        place-items: center;
        user-select: none;
    }
    
    .panel-icon:hover, panel-icon:active
    {
        outline: none;
    }

    .panel-icon:focus
    {
        outline: 2px solid white;
        outline-offset: -2px;
    }

    .panel-icon img
    {
        user-select: none;
        object-fit: cover;
        height: 80%;
        pointer-events: none;
    }
</style>
<div class="panel-icon" tabindex="0">
    <img />
</div>
`;

class PanelIcon extends HTMLElement
{
    constructor()
    {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(panelAppIconTemplate.content.cloneNode(true));
    }

    connectedCallback()
    {
        this.shadow.querySelector('.panel-icon img').src = this.getAttribute('icon-src');

        let panelIconElem = this.shadow.querySelector('.panel-icon');
        
        panelIconElem.title = this.getAttribute('app-desc');
        panelIconElem.addEventListener('click', e => this.toggleMinimized());
    }

    toggleMinimized(e)
    {
        applications.forEach(app =>
        {
            if(app.name == this.getAttribute('app-name'))
            {
                app.window.minimize();
                return;
            }
        });
    }
}

customElements.define('panel-icon', PanelIcon);

