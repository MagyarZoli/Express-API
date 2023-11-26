const form = document.querySelector("form");
const loginError = document.querySelector(".login.error");

form.addEventListener("submit", async event => {
  event.preventDefault();
  loginError.textContent = "";
  const email = form.email.value;
  const password = form.password.value;
  try {
    const res = await fetch(`/login`, {
      method: "POST",
      body: JSON.stringify({email, password}),
      headers: {"Content-Type": "application/json"}
    });
    const data = await res.json();
    if (data.errors) loginError.textContent = data.errors.login;
    if (data.user) location.assign("/");
  } catch (err) {
    console.log(err);
  }
});