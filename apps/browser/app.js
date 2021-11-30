const txtUrl = document.querySelector('input#txtUrl');
const btnBack = document.querySelector('button#back');
const btnRefresh = document.querySelector('button#refresh');
const btnForward = document.querySelector('button#forward');

const iframe = document.querySelector('iframe');

btnBack.addEventListener('click', () =>
{
    iframe.contentWindow.history.back();
});

btnRefresh.addEventListener('click', () =>
{
    iframe.contentWindow.location.reload();
});

btnForward.addEventListener('click', () =>
{
    iframe.contentWindow.history.forward();
});

txtUrl.addEventListener('keydown', e =>
{
    if(e.code == 'Enter')
    {
        iframe.src = encodeURI(txtUrl.value);
    }
});