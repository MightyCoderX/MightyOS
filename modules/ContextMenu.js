const contextMenuTemplate = document.createElement('template');

contextMenuTemplate.innerHTML = `

`;

class ContextMenu extends HTMLElement
{
    constructor()
    {
        super();
        
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(contextMenuTemplate.content.cloneNode(true));
    }

    connectedCallback()
    {
        
    }
}

customElements.define('context-menu', ContextMenu);