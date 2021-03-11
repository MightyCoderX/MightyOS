const txtEditor = document.getElementById('txtEditor');

window.addEventListener('blur', e =>
{
    txtEditor.focus();
});

txtEditor.addEventListener('blur', e =>
{
    txtEditor.focus();
});