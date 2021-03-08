const panelAppIconTemplate = document.createElement('template');

desktopIconTemplate.innerHTML = `
<style>

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
        this.shadow.appendChild(desktopIconTemplate.content.cloneNode(true));
    }

    connectedCallback()
    {
        
    }
}

customElements.define('panel-icon', PanelIcon);

