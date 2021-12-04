const contextMenuTemplate = document.createElement('template');

contextMenuTemplate.innerHTML = `
    <style>
        *
        {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .context-menu
        {
            position: absolute;
            background-color: #222;
            color: #ddd;
            width: max-content;
            height: max-content;
            display: flex;
            flex-direction: column;
            list-style: none;
            overflow: hidden;
            border-radius: 0.3rem;
            font-size: 14px;
        }

        .context-menu li
        {
            display: flex;
            align-items: center;
            padding: 0.7rem 1rem;
        }

        .context-menu li:hover
        {
            background-color: #fff2;
        }
    </style>
    <ul class="context-menu">

    </ul>
`;

class ContextMenu extends HTMLElement
{
    constructor(items, position)
    {
        super();

        this.items = items;
        this.position = position;

        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(contextMenuTemplate.content.cloneNode(true));

        this.addEventListener('contextmenu', e => e.preventDefault());
    }

    connectedCallback()
    {
        const contextMenuElem = this.shadow.querySelector('ul.context-menu');
        
        contextMenuElem.style.left = `${this.position.x}px`
        contextMenuElem.style.top = `${this.position.y}px`
        this.items.forEach(item =>
        {
            const li = document.createElement('li');
            li.innerText = item.label;
            contextMenuElem.appendChild(li);

            const callAction = e =>
            {
                e.preventDefault();
                item.action();
                this.remove();
            }

            li.addEventListener('click', callAction);
            li.addEventListener('contextmenu', callAction);
        });

        window.addEventListener('click', e => this.remove());
    }
}

customElements.define('context-menu', ContextMenu);