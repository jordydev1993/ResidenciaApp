import { login, registerUser } from '../api/authApi.js';
import { $, serializeForm, showToast } from '../utils/dom.js';

function saveToken(token) {
    try { localStorage.setItem('auth_token', token); } catch {}
}

function bindLogin() {
    const form = $('#loginForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = serializeForm(form);
        if (!payload.email || !payload.password) return showToast('Email y contraseña requeridos');
        try {
            const res = await login({ email: payload.email, password: payload.password });
            if (res?.token) saveToken(res.token);
            showToast('Sesión iniciada');
            window.location.href = './legajos.html';
        } catch (err) {
            showToast(`Error de login: ${err.message}`);
        }
    });
}

function bindRegister() {
    const form = $('#registerForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = serializeForm(form);
        if (!payload.email || !payload.password || !payload.name) return showToast('Completa todos los campos');
        try {
            await registerUser({ name: payload.name, email: payload.email, password: payload.password });
            showToast('Registro exitoso, ahora puedes iniciar sesión');
            const loginTabBtn = document.querySelector('#authTabs button[data-bs-target="#login"]');
            loginTabBtn && new bootstrap.Tab(loginTabBtn).show();
        } catch (err) {
            showToast(`Error de registro: ${err.message}`);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    bindLogin();
    bindRegister();
});


