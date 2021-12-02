const startMenuItemTemplate = document.createElement('template');

startMenuItemTemplate.innerHTML = `
<style>
    .start-menu-item
    {
        display: flex;
        position: relative;
        height: 3rem;
        overflow: hidden;
        align-items: center;
        gap: 0.5rem;
        padding-inline: 0.5rem;
    }
    
    .start-menu-item img
    {
        object-fit: contain;
        width: 2rem;
        aspect-ratio: 1;
    }
</style>
<div class="start-menu-item" tabindex="0">
    <img />
    <span class="label"></span>
</div>
`;

class StartMenuItem extends HTMLElement
{
    constructor()
    {
        super();
        
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(startMenuItemTemplate.content.cloneNode(true));
    }

    connectedCallback()
    {
        this.shadow.querySelector('img').src = this.getAttribute('icon-src');
        this.shadow.querySelector('.label').innerHTML = this.getAttribute('app-name');
        this.shadow.querySelector('.label').title = this.getAttribute('app-name');
    }
}

customElements.define('start-menu-item', StartMenuItem);