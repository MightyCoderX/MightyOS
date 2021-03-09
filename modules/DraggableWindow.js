const draggableWindowTemplate = document.createElement('template');

draggableWindowTemplate.innerHTML = `
<style>
    .window
    {
        --header-height: 30px;
    
        position: absolute;
        display: block;
        top: 20px;
        left: 100px;
        border-radius: 0.5rem 0.5rem 0 0;
        overflow: hidden;
        box-shadow: 0px 0px 5px #222222a4;
        transform-origin: top left;
        transition-property: transform;
        transition-duration: 0.1s;
        transition-timing-function: ease-in;
        border: 1px solid #222;
        pointer-events: all;
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
    }
    
    .window .header .left-buttons
    {
        position: relative;
        right: 0;
        display: flex;
    }
    
    .window .header .left-buttons span
    {
        position: relative;
        display: grid;
        width: 0.9rem;
        height: 0.9rem;
        border-radius: 100rem;
        margin-left: 5px;
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
        cursor: ew-resize;
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
        
        this.shadow.appendChild(draggableWindowTemplate.content.cloneNode(true));
    }

    connectedCallback()
    {
        this.style.position = 'absolute';
        this.windowFrame = this.shadow.querySelector('.window');
        this.header = this.shadow.querySelector('.header');
        this.titleElem = this.shadow.querySelector('.header .title');
        this.btnMinimize = this.shadow.querySelector('.header .minimize');
        this.btnMaximize = this.shadow.querySelector('.header .maximize');
        this.btnClose = this.shadow.querySelector('.header .close');
        this.body = this.shadow.querySelector('.window .body iframe');

        // this.titleElem.innerText = this.getAttribute('window-title');
        this.body.src = this.getAttribute('content-url');
        this.titleElem.innerText = this.getAttribute('window-title');
        
        this.body.addEventListener('load', e =>
        {
            try{ this.titleElem.innerText = this.body.contentWindow.document.title; } catch(_){}
        });

        this.startSize = { width: 720, height: 480 };
        this.position = { x: 100, y: 100 };
        this.size = this.startSize;
        
        this.maximized = false;
        this.minimized = false;
        this.headerMouseDown = false;

        this.onclose = () => {};
        
        this.btnMinimize.addEventListener('click', () => this.minimize());
        this.btnMaximize.addEventListener('click', () => this.maximize());
        this.btnClose.addEventListener('click', () => this.close());

        // this.resizing = '';
        // document.addEventListener('mousedown', e => this.mouseDown = true);
        // document.addEventListener('mouseup', e =>
        // {
        //     this.mouseDown = false;
        //     this.resizing = '';
        // });
        // document.addEventListener('mouseleave', e =>
        // {
        //     this.mouseDown = false;
        //     this.resizing = '';
        // });
        // document.addEventListener('mousemove', e => this.resize(e));
        
        new ResizeObserver(() =>
        {
            let width = this.windowFrame.clientWidth;
            let height = this.windowFrame.clientHeight;
            this.size = { width, height };
            console.log(this.size);
        }).observe(this.windowFrame);

        this.windowFrame.style.width = this.startSize.width + 'px';
        this.windowFrame.style.height = this.startSize.height + 'px';

        this.dragWindow();
    }

    dragWindow()
    {
        let windowMouseX, windowMouseY;

    
        this.header.addEventListener('mousedown', e =>
        {
            this.headerMouseDown = true;
            windowMouseX = e.clientX - this.windowFrame.offsetLeft;
            windowMouseY = e.clientY - this.windowFrame.offsetTop;
        });
        
        document.addEventListener('mouseup', e =>
        {
            this.headerMouseDown = false;
            this.header.removeEventListener('mousemove', windowDrag);
        });
        
        document.addEventListener('mousemove', e =>
        {
            if(this.headerMouseDown)
            {
                if(this.maximized)
                {
                    this.maximize();

                    this.windowFrame.style.left = e.clientX - this.startSize.width/2 + 'px';
                    this.windowFrame.style.top = e.clientY - this.header.offsetHeight/2 + 'px';
                    windowMouseX = e.clientX - this.windowFrame.offsetLeft;
                    windowMouseY = e.clientY - this.windowFrame.offsetTop;
                }
    
                // if(!maximized && this.windowContainer.offsetTop <= 5)
                // {
                //     mouseDown = false;
                //     this.maximize();
                //     this.windowContainer.blur();
                //     return;
                // }
                windowDrag(e);
            }
        });
    
        document.addEventListener('mouseleave', e =>
        {
            this.headerMouseDown = false;
        });
    
        let windowDrag = e =>
        {
            this.windowFrame.style.left = e.clientX - windowMouseX + 'px';
            this.windowFrame.style.top = e.clientY - windowMouseY + 'px';
        }
    }

    minimize()
    {
        if(!this.minimized)
        {
            this.windowFrame.style.transformOrigin = 'bottom left';
            this.windowFrame.style.transform = 'scale(0)';
            this.minimized = true;
        }
        else
        {
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
            this.windowFrame.style.width = window.innerWidth +'px';
            this.windowFrame.style.height = window.innerHeight +'px';
            this.windowFrame.style.borderRadius = 0;
            this.maximized = true;
        }
        else
        {
            this.windowFrame.style.width = this.startSize.width+'px';
            this.windowFrame.style.height = this.startSize.height+'px';
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

    // resize(e)
    // {
    //     if(this.maximized) return;
    //     if(!this.mouseDown)
    //     {
    //         this.resizing = '';
    //         return;
    //     }
        
    //     let left = this.windowFrame.getBoundingClientRect().left;
    //     let right = this.windowFrame.getBoundingClientRect().right;
    //     let top = this.windowFrame.getBoundingClientRect().top;
    //     let bottom = this.windowFrame.getBoundingClientRect().bottom;
        
    //     if(this.resizing == '')
    //     {
    //         if(e.clientX >= left-2 && e.clientX <= left+2)
    //         {
    //             this.resizing = 'left';
    //             document.body.style.cursor = 'ew-resize';
    //         }
    //         else if(e.clientX >= right-2 && e.clientX <= right+2)
    //         {
    //             this.resizing = 'right';
    //             document.body.style.cursor = 'ew-resize';
    //         }
    //         else if(e.clientY >= top-2 && e.clientY <= top+2)
    //         {
    //             this.resizing = 'top';
    //             document.body.style.cursor = 'ns-resize';
                
    //         }
    //         else if(e.clientY >= bottom-2 && e.clientY <= bottom+2)
    //         {
    //             this.resizing = 'bottom';
    //             document.body.style.cursor = 'ns-resize';
    //         }
    //     }
    //     else
    //     {
    //         switch(this.resizing)
    //         {
    //             case 'left':
    //                 this.windowFrame.style.left = e.clientX + 'px';
    //                 this.windowFrame.style.width = e.clientX + right + 'px';
    //                 break;
    //             case 'right':
    //                 this.windowFrame.style.
    //                 break;
    //             case 'top':
    //                 break;
    //             case 'bottom':
    //                 break;
    //         }
    //     }
    // }
}

customElements.define('draggable-window', DraggableWindow);