/*
@全局通用函数
@
*/
export const showToast = function(text) {
    var toastWrapper = document.querySelectorAll('.toast_wrapper');
    var div = document.createElement('div');
    var body = document.body;
    if (toastWrapper && toastWrapper.length !== 0) {
        body.removeChild(toastWrapper[0]);
    }
    div.innerHTML = text;
    div.className = 'toast_wrapper';
    body.appendChild(div);
    setTimeout(() => {
        div.className += ' fade';
        setTimeout(() => {
            try {
                body.removeChild(div);
            } catch (e) {
            }
        }, 1000);
    }, 5);
};
