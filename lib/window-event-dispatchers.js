export function dispatchCustomEvent(type, detail, 
    options =
    {
        bubbles: false,
        cancelable: false,
        composed: true
    }
)
{
    console.log({type, detail, options});
    return document.dispatchEvent(new CustomEvent(type, {
        ...options,
        detail
    }))
}

export function dispatchOpenWindow(appName)
{
    return dispatchCustomEvent('openwindow', { appName });
}

export function dispatchToggleMinimizeWindow(appName)
{
    return dispatchCustomEvent('toggleminimize', { appName });
}
