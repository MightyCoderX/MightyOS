const draggableWindowTemplate = document.createElement('template');

draggableWindowTemplate.innerHTML = `
    <style>
        *
        {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
        }

        .window
        {
            --header-height: 30px;
            --window-width: 60vw;
        
            position: absolute;
            display: block;
            top: 20px;
            left: 100px;
            border-radius: 0.5rem 0.5rem 0 0;
            overflow: hidden;
            box-shadow: 0px 0px 5px #222222a4;
            transition-property: transform;
            transition-duration: 0.1s;
            transition-timing-function: ease-in;
            pointer-events: all;
            width: var(--window-width);
            height: calc(var(--window-width) * 9/16);
            resize: both;
        }

        .window.minimized
        {
            transition-property: transform, top, left;
        }
        
        .window .header
        {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 0.6rem;
            background: #222;
            height: var(--header-height);
            font-size: 14px;
        }
        
        .window .header .title
        {
            pointer-events: none;
            user-select: none;
            line-height: 0;
        }
        
        .window .header .left-buttons
        {
            position: relative;
            right: 0;
            display: flex;
            gap: 5px;
        }
        
        .window .header .left-buttons span
        {
            position: relative;
            display: grid;
            width: 0.9rem;
            height: 0.9rem;
            border-radius: 100rem;
            place-items: center;
        }
        
        .window .header .left-buttons .minimize
        {
            background: orange;
        }
        
        .window .header .left-buttons .maximize
        {
            background: green;
        }
        
        .window .header .left-buttons .close
        {
            background: red;
        }
        
        .window .body
        {
            background: #333;
            height: calc(100% - var(--header-height));
            width: 100%;
            user-select: none;
            border: 1px solid #222;
        }
    </style>
    <div class="window">
        <div class="header">
            <span class="title"></span>

            <div class="left-buttons"> 
                <span class="minimize"></span>
                <span class="maximize"></span>
                <span class="close"></span>
            </div>
        </div>
        <div class="body">
            <iframe src="" frameborder="0" style="width: 100%; height: 100%;"></iframe>
        </div>
    </div>
`;

class DraggableWindow extends HTMLElement
{
    constructor()
    {
        super();
        
        this.shadow = this.attachShadow({ mode: 'open' });
        this.focused = false;
        
        this.shadow.appendChild(draggableWindowTemplate.content.cloneNode(true));
    }

    connectedCallback()
    {
        this.windowFrame = this.shadow.querySelector('.window');
        this.header = this.shadow.querySelector('.header');
        this.titleElem = this.shadow.querySelector('.header .title');
        this.btnMinimize = this.shadow.querySelector('.header .minimize');
        this.btnMaximize = this.shadow.querySelector('.header .maximize');
        this.btnClose = this.shadow.querySelector('.header .close');
        this.body = this.shadow.querySelector('.window .body iframe');

        this.titleElem.innerText = this.getAttribute('window-title');
        this.body.src = this.getAttribute('content-url');
        this.titleElem.innerText = this.getAttribute('window-title');
        
        this.body.addEventListener('load', e =>
        {
            try
            {
                this.titleElem.innerText = this.body.contentWindow.document.title;
            }
            catch(err)
            {
                console.log(err);
            }
        });

        this.startSize = { width: this.windowFrame.clientWidth, height: this.windowFrame.clientHeight };
        this.size = this.startSize;

        this.position = { 
            x: window.innerWidth/2-this.size.width/2, 
            y: 100
        };

        this.maximized = false;
        this.minimized = false;
        this.headerMouseDown = false;

        this.onclose = () => {};
        
        this.btnMinimize.addEventListener('click', () => this.minimize());
        this.btnMaximize.addEventListener('click', () => this.maximize());
        this.btnClose.addEventListener('click', () => this.close());


        
        new ResizeObserver(() =>
        {
            let width = this.windowFrame.clientWidth;
            let height = this.windowFrame.clientHeight;
            this.size = { width, height };
            // console.log(this.size);
            
        }).observe(this.windowFrame);

        this.windowFrame.style.width = this.startSize.width + 'px';
        this.windowFrame.style.height = this.startSize.height + 'px';

        // TODO: fix focus on click on the window body
        // this.body.contentWindow.addEventListener('click', () =>
        // {
        //     console.log('Focusing this window', this.title);
        //     this.focusWindow();
        // });

        this.header.addEventListener('dblclick', () => this.maximize());
        
        this.focusWindow();
        this.dragWindow();
        // this.resize();
    }

    set position({x, y})
    {
        this._position = {x, y};
        this.windowFrame.style.left = `${x}px`;
        this.windowFrame.style.top = `${y}px`;
    }

    get position()
    {
        return this._position;
    }

    get iframe()
    {
        return this.body;
    }

    focusWindow()
    {
        Array.from(applications).filter(e => e.window).map(e => e.window).filter(e => e.focused).forEach(w =>
        {
            w.focused = false;
            w.windowFrame.style.zIndex = '0';
        });

        this.focused = true;
        this.windowFrame.style.zIndex = '1';
        
        this.body.contentWindow.focus();
    }

    dragWindow()
    {
        let windowMouseX, windowMouseY;
        
        let mouseDown = (e) =>
        {
            this.focusWindow();

            let clientX = e.clientX | e.changedTouches?.[0].pageX;
            let clientY = e.clientY | e.changedTouches?.[0].pageY;
            
            this.headerMouseDown = true;
            windowMouseX = clientX - this.windowFrame.offsetLeft;
            windowMouseY = clientY - this.windowFrame.offsetTop;
            this.body.style.pointerEvents = 'none';

            
            window.addEventListener('mouseup', mouseUp);
            window.addEventListener('touchend', mouseUp);
            window.addEventListener('touchcancel', mouseUp);
        }
    
        this.header.addEventListener('mousedown', mouseDown);
        this.header.addEventListener('touchstart', mouseDown);
        
        
        let mouseUp = (e) =>
        {
            this.headerMouseDown = false;
            this.header.removeEventListener('mousemove', windowDrag);
            this.body.style.pointerEvents = 'all';
        }

        
        let mouseMove = (e) =>
        {
            let clientX = e.clientX | e.changedTouches?.[0].pageX;
            let clientY = e.clientY | e.changedTouches?.[0].pageY;
            
            if(this.headerMouseDown)
            {
                if(this.maximized)
                {
                    this.maximize();
                    
                    this.position = { x: clientX - this.startSize.width/2, y: clientY - this.header.offsetHeight/2 };

                    windowMouseX = clientX - this.windowFrame.offsetLeft;
                    windowMouseY = clientY - this.windowFrame.offsetTop;
                }
                windowDrag(clientX, clientY);
                
                // if(!maximized && this.windowContainer.offsetTop <= 5)
                // {
                //     mouseDown = false;
                //     this.maximize();
                //     this.windowContainer.blur();
                //     return;
                // }
            }   
        }
            
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('touchmove', mouseMove);

        window.addEventListener('mouseleave', e =>
        {
            this.headerMouseDown = false;
        });
    
        let windowDrag = (clientX, clientY) =>
        {
            this.position = { x: clientX - windowMouseX, y: clientY - windowMouseY };
        }
    }

    minimize()
    {
        if(!this.minimized)
        {
            let panelIcon = document.querySelector(`.panel panel-icon[app-name=${this.getAttribute('window-title')}]`);
            let panelIconPos = { 
                x: panelIcon.getBoundingClientRect().x, 
                y: panelIcon.getBoundingClientRect().y 
            };

            this.position.x = this.windowFrame.getBoundingClientRect().x;
            this.position.y = this.windowFrame.getBoundingClientRect().y;

            this.windowFrame.classList.add('minimized');
            
            this.windowFrame.style.transformOrigin = `${panelIconPos.x}px ${panelIconPos.y}px`;
            this.windowFrame.style.left = `${panelIconPos.x-this.size.width}px`;
            this.windowFrame.style.top = `${panelIconPos.y}px`;
            this.windowFrame.style.transform = 'scale(0)';
            this.minimized = true;
        }
        else
        {
            this.windowFrame.classList.remove('minimized');
            this.windowFrame.style.left = `${this.position.x}px`;
            this.windowFrame.style.top = `${this.position.y}px`;
            this.windowFrame.style.transform = 'scale(1)';
            this.minimized = false;
        }
    }

    maximize()
    {
        if(!this.maximized)
        {
            this.windowFrame.style.top = 0;
            this.windowFrame.style.left = 0;

            this.startSize = { width: this.windowFrame.clientWidth, height: this.windowFrame.clientHeight };
            
            this.windowFrame.style.width = '100%';
            this.windowFrame.style.height = '100%';
            this.windowFrame.style.borderRadius = 0;
            
            this.maximized = true;
        }
        else
        {
            this.windowFrame.style.width = this.startSize.width+'px';
            this.windowFrame.style.height = this.startSize.height+'px';
            this.position = { x: this._position.x, y: this.position.y };
            this.windowFrame.style.borderRadius = '';
            this.maximized = false;
        }
    }

    close()
    {
        this.onclose();
        this.windowFrame.style.transformOrigin = 'center';
        this.windowFrame.style.transform = 'scale(0)';

        let dur = this.shadow.styleSheets[0].cssRules[0].style.transitionDuration.slice(0, -1);
        
        setTimeout(() =>
        {
            this.remove();
        }, dur*1000);
    }

    //TODO: Implement window resizing
    // resize()
    // {
    //     let rect = this.windowFrame.getBoundingClientRect();
        
    //     this.windowFrame.addEventListener('mousedown', e =>
    //     {
    //         if()
    //     });
    // }
}

customElements.define('draggable-window', DraggableWindow);
