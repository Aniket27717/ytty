// utils.js
export function resetForms() {
  ["loginEmail", "loginPassword", "signupEmail", "signupPassword", "forgotEmail"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}
