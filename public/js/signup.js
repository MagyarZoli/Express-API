const form = document.querySelector("form");
const usernameError = document.querySelector(".username.error");
const emailError = document.querySelector(".email.error");
const passwordError = document.querySelector(".password.error");

form.addEventListener("submit", async event => {
  event.preventDefault();
  usernameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  const username = form.username.value;
  const email = form.email.value;
  const password = form.password.value;
  try {
    const res = await fetch(`/signup`, { // signup.js:15 POST http://localhost:3000/signup 400 (Bad Request)
      method: "POST",
      body: JSON.stringify({ username, email, password }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    console.log(data); // Log the response for debugging
    if (data.errors) {
      usernameError.textContent = data.errors.username;
      emailError.textContent = data.errors.email;
      passwordError.textContent = data.errors.password;
    }
    if (data.user) location.assign(`/login`);
  } catch (err) {
    console.log(err);
  }
});
