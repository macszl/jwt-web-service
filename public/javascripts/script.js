function toggleForm() {
  const form = document.querySelector(".form form");
  const button = document.querySelector(".form button");
  const submitInput = document.querySelector('.form input[type="submit"]');
  if (form.action.includes("signin")) {
    form.action = "/auth/signup";
    document.querySelector("h2").textContent = "Register";
    button.textContent = "Switch to login";
    submitInput.textContent = "Register";
    submitInput.value = "Register";
    form.querySelector("#email").style.display = "block";
    form.querySelector("#email-confirm").style.display = "block";
    form.querySelector("#password-confirm").style.display = "block";
    form.querySelector('label[for="email"]').style.display = "block";
    form.querySelector('label[for="email-confirm"]').style.display = "block";
    form.querySelector('label[for="password-confirm"]').style.display = "block";
  } else {
    form.action = "/auth/signin";
    document.querySelector("h2").textContent = "Login";
    button.textContent = "Switch to register";
    submitInput.textContent = "Login";
    submitInput.value = "Login";
    form.querySelector("#email").style.display = "none";
    form.querySelector("#email").required = false;
    form.querySelector("#email-confirm").style.display = "none";
    form.querySelector("#email-confirm").required = false;
    form.querySelector("#password-confirm").style.display = "none";
    form.querySelector("#password-confirm").required = false;
    form.querySelector('label[for="email"]').style.display = "none";
    form.querySelector('label[for="email-confirm"]').style.display = "none";
    form.querySelector('label[for="password-confirm"]').style.display = "none";
  }
}
function validateForm() {
  const h2Content = document.querySelector("h2").textContent;
  console.log(h2Content);
  if (h2Content === "Login") {
    return true;
  }

  const email = document.getElementById("email").value;
  const emailConfirm = document.getElementById("email-confirm").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("password-confirm").value;
  const errorDiv = document.getElementById("error");

  if (email !== emailConfirm) {
    errorDiv.innerHTML = "Emails do not match";
    return false;
  } else if (password !== passwordConfirm) {
    errorDiv.innerHTML = "Passwords do not match";
    return false;
  } else {
    errorDiv.innerHTML = "";
    return true;
  }
}
