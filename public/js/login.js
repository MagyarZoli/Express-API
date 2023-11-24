const form = document.querySelector("form");
const emailError = document.querySelector(".email.error");
const passwordError = document.querySelector(".password.error");

const database = "mongo";

form.addEventListener("submit", async event => {
  event.preventDefault();
  emailError.textContent = "";
  passwordError.textContent = "";
  const email = form.email.value;
  const password = form.password.value;
  try {
    const res = await fetch(`/${database}/login`, {
      method: "POST",
      body: JSON.stringify({email, password}),
      headers: {"Content-Type": "application/json"}
    });
    const data = await res.json();
    if (data.errors) {
      emailError.textContent = data.errors.email;
      passwordError.textContent = data.errors.password;
    }
    if (data.user) location.assign("/");
  } catch (err) {
    console.log(err);
  }
});