function toggleForm() {
  const form = document.querySelector(".form form");
  const button = document.querySelector(".form button");
  const submitInput = document.querySelector('.form input[type="submit"]');
  if (document.querySelector("h2").textContent === "Login") {
    // switch to register
    form.setAttribute("onsubmit", "return sendRegisterData(event)");
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
    // switch to login
    form.setAttribute("onsubmit", "return sendLoginData(event)");
    document.querySelector("h2").textContent = "Login";
    button.textContent = "Switch to register";
    submitInput.textContent = "Login";
    submitInput.value = "Login";
    form.querySelector("#email").style.display = "none";
    form.querySelector("#email").required = false;
    form.querySelector("#email").value = "";
    form.querySelector("#email-confirm").style.display = "none";
    form.querySelector("#email-confirm").required = false;
    form.querySelector("#email-confirm").value = "";
    form.querySelector("#password-confirm").style.display = "none";
    form.querySelector("#password-confirm").required = false;
    form.querySelector("#password-confirm").value = "";
    form.querySelector('label[for="email"]').style.display = "none";
    form.querySelector('label[for="email-confirm"]').style.display = "none";
    form.querySelector('label[for="password-confirm"]').style.display = "none";
  }
}

function validateForm(event) {
  event.preventDefault();

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

  errorDiv.innerHTML = "";

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
function sendRegisterData(event) {
  if (!validateForm(event)) {
    return;
  }

  let xhr = new XMLHttpRequest();
  const errorDiv = document.getElementById("error");

  xhr.open("POST", "/auth/signup", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status <= 204) {
        console.log("Registration successful.");
        errorDiv.innerHTML =
          "Registration successful. Please wait until your account is activated.";
      } else {
        console.error(xhr.statusText);
        errorDiv.innerHTML = "Registration unsuccessful.";
      }
    }
  };
  xhr.send(
    JSON.stringify({
      login: document.getElementById("login").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    })
  );

  return true;
}

function sendLoginData(event) {
  if (!validateForm(event)) {
    return;
  }

  let xhr = new XMLHttpRequest();
  const errorDiv = document.getElementById("error");

  xhr.open("POST", "/auth/signin", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status <= 204) || xhr.status === 0) {
        const response = JSON.parse(xhr.responseText);
        console.log(response);
        createCookieWithToken(response.token);
        console.log("Token saved to local storage.");

        setTimeout(function () {
          window.location.href = "/menu";
        }, 3000);
      } else {
        console.error(xhr.statusText);
        errorDiv.innerHTML = "Login unsuccessful.";
      }
    }
  };

  xhr.send(
    JSON.stringify({
      login: document.getElementById("login").value,
      password: document.getElementById("password").value,
    })
  );

  return true;
}

function createCookieWithToken(token) {
  // Set the cookie expiration date
  const now = new Date();
  const expirationDate = new Date(now.getTime() + 3600 * 1000); // 1 hour from now

  // Set the cookie value
  const cookieValue = `Bearer ${token}`;

  // Set the cookie to be accessible from any URL within your website
  document.cookie = `my_cookie_name=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/`;
}
