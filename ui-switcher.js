// ui-switcher.js
export function initFormSwitching() {
  document.getElementById("showSignup").onclick = () => toggle("signup");
  document.getElementById("showLoginFromSignup").onclick = () => toggle("login");
  document.getElementById("showForgot").onclick = () => toggle("forgot");
  document.getElementById("showLoginFromForgot").onclick = () => toggle("login");
}

function toggle(type) {
  const forms = {
    login: document.getElementById("loginForm"),
    signup: document.getElementById("signupForm"),
    forgot: document.getElementById("forgotForm")
  };

  Object.keys(forms).forEach(key => {
    forms[key].style.display = key === type ? "block" : "none";
  });

  document.getElementById("formTitle").innerText = {
    login: "Spyder Login",
    signup: "Create Account",
    forgot: "Reset Password"
  }[type];

  document.getElementById("error").textContent = "";
}
