// index.js
import { signup, login, resetPassword } from './auth.js';
import { initFormSwitching } from './ui-switcher.js';

initFormSwitching();

document.getElementById("signupBtn").addEventListener("click", signup);
document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("resetBtn").addEventListener("click", resetPassword);
