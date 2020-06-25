import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

// DOMS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form-login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const emailInput = document.getElementById('email');
const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const passwordInput = document.getElementById('password');
const passwordCurrentInput = document.getElementById('password-current');
const passwordConfirmInput = document.getElementById('password-confirm');

// VALUES

// IM
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    login(emailInput.value, passwordInput.value);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', nameInput.value);
    form.append('email', emailInput.value);
    form.append('photo', photoInput.files[0]);
    console.log(form);

    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const password = passwordInput.value;
    const passwordCurrent = passwordCurrentInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    await updateSettings(
      {
        passwordCurrent,
        password,
        passwordConfirm
      },
      'password'
    );

    passwordInput.value = '';
    passwordCurrentInput.value = '';
    passwordConfirmInput.value = '';
  });
}
