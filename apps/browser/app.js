const txtUrl = document.querySelector('input#txtUrl');

txtUrl.addEventListener('keydown', e =>
{
    if(e.code == 'Enter')
    {
        document.querySelector('iframe').src = encodeURI(txtUrl.value);
    }
});