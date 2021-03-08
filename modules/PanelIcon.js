const panelAppIconTemplate = document.createElement('template');

panelAppIconTemplate.innerHTML = `
<style>
    .panel-icon
    {
        overflow: hidden;
    }
    .panel-icon img
    {
        
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
        this.shadow.querySelector('.panel-icon').title = this.getAttribute('app-desc');
        this.shadow.querySelector('.panel-icon img').src = this.getAttribute('icon-src');
        
    }
}

customElements.define('panel-icon', PanelIcon);

