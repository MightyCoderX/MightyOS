const txtEditor = document.getElementById('txtEditor');

txtEditor.focus();
window.addEventListener('focus', () => txtEditor.focus());

if(localStorage.getItem('notepad'))
{
    txtEditor.value = localStorage.getItem('notepad');
}

window.addEventListener('keydown', e =>
{
    if(e.key === 's' && e.ctrlKey)
    {
        e.preventDefault();
        localStorage.setItem('notepad', txtEditor.value);
    }
});