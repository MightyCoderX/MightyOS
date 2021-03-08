const panelAppIconTemplate = document.createElement('template');

panelAppIconTemplate.innerHTML = `
<style>
    .panel-icon
    {
        display: block;
        position: relative;
        height: 100%;
        overflow: hidden;
    }
    .panel-icon img
    {
        object-fit: cover;
        height: 100%;
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

