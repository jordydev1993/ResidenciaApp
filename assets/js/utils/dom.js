export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

export function setText(el, text) {
    if (!el) return;
    el.textContent = text;
}

export function renderHTML(el, html) {
    if (!el) return;
    el.innerHTML = html;
}

export function serializeForm(form) {
    const fd = new FormData(form);
    return Object.fromEntries(fd.entries());
}

export function showToast(message) {
    const toastEl = $('#toastNotificacion');
    const toastMsg = $('#toastMensaje');
    if (!toastEl || !toastMsg) return alert(message);
    toastMsg.textContent = message;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}


