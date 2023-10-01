window.loginState = false;
///////////////////////////////////////////////// Login/Create Toggle Logic BEGIN ///////////////////////////////////////////////////////

let loginBox = document.getElementById("login-box");

document.getElementById("login-link").addEventListener("click", () => {
  if (loginBox.className == "login-hidden") {
    loginBox.className = "login-display";
    document.getElementById("login-link").style.backgroundColor = "lightblue";
  } else {
    loginBox.className = "login-hidden";
    document.getElementById("login-link").style.backgroundColor = "lightgray";
  }
});

let createAccountBox = document.getElementById("create-account-box");
document.getElementById("create-account-link").addEventListener("click", () => {
  if (createAccountBox.className == "create-account-hidden") {
    createAccountBox.className = "create-account-display";
    document.getElementById("create-account-link").style.backgroundColor =
      "lightblue";
  } else {
    createAccountBox.className = "create-account-hidden";
    document.getElementById("create-account-link").style.backgroundColor =
      "lightgray";
  }
});

let siginCreateForm = document.getElementById("sigin-createaccount-form");
document
  .getElementById("signin-createaccount-button")
  .addEventListener("click", () => {
    console.log(siginCreateForm);
    if (siginCreateForm.className == "siginCreateAccount-hidden") {
      siginCreateForm.className = "siginCreateAccount-display";
      console.log("inside1");
    } else {
      siginCreateForm.className = "siginCreateAccount-hidden";
      console.log("inside2");
    }
  });

//////////////////////////////////////////////////   login/create Toggle END  /////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////// Login begin //////////////////////////////////////////////////////////////////////
function authenticateUser() {
  let username = document.getElementById("login-username");
  let usernameValidation = document.getElementById("login-username-validation");
  if (username.value == "") {
    usernameValidation.innerHTML = `Please Enter Username`;
    usernameValidation.style.display = `flex`;
    return;
  }
  usernameValidation.innerHTML = ``;
  usernameValidation.style.display = `none`;

  let password = document.getElementById("login-password");
  let passwordValidation = document.getElementById("login-password-validation");
  if (password.value == "") {
    passwordValidation.innerHTML = `Please Enter Password`;
    passwordValidation.style.display = `flex`;
    return;
  }
  passwordValidation.innerHTML = "";
  passwordValidation.style.display = `flex`;

  username = username.value;
  password = password.value;
  console.log(JSON.stringify({ username, password }));
  fetch("http://127.0.0.1:5501/Login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  }).then(async function (response) {
    if (response.ok) {
      let res = await response.json();
      console.log(response);
      console.log(res);
      console.log(res.message);
      let res2 = res.data;
      console.log(res2);
      document.getElementById(
        "auth-message"
      ).innerHTML = `<p style="color: green;">Login Successful</p>`;

      document.getElementById("login-username").innerHTML = "";
      document.getElementById("login-password").innerHTML = "";

      setTimeout(() => {
        loginBox.className = "login-hidden";
        createAccountBox.className = "create-account-hidden";
        siginCreateForm.className = "siginCreateAccount-hidden";
        document.getElementById("username").innerHTML = `${res2.username}`;
        document.getElementById("races").innerHTML = `${res2.races} races`;
        document.getElementById("average").innerHTML = `${res2.speed} wpm`;
      }, 2000);
    } else if (response.status == 401) {
      console.log(response);
      document.getElementById(
        "auth-message"
      ).innerHTML = `<p style="color: red;">Invalid Credentials</p>`;
    }
  });
}
/////////////////////////////////////////////////////////// Login End ///////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////// Create-User Begin ///////////////////////////////////////////////////////////

function validatePassword(password, confirmPassword) {
  let confirmPasswordValidation = document.getElementById(
    "confirm-password-validation"
  );
  if (password == "") {
    confirmPasswordValidation.innerHTML = `please enter the password`;
    confirmPasswordValidation.style.display = `flex`;
    return false;
  }
  if (confirmPassword == "") {
    confirmPasswordValidation.innerHTML = `please confirm the entered password`;
    confirmPasswordValidation.style.display = `flex`;
    return false;
  }
  if (password != confirmPassword) {
    confirmPasswordValidation.innerHTML = `Passwords do not match`;
    confirmPasswordValidation.style.display = `flex`;
    return false;
  }
  confirmPasswordValidation.innerHTML = ``;
  confirmPasswordValidation.style.display = `none`;
  return true;
}

function validatingName(name) {
  let nameValidation = document.getElementById("create-name-validation");
  if (name == "") {
    nameValidation.innerHTML = `please enter a name`;
    nameValidation.style.display = `flex`;
    return false;
  }
  nameValidation.innerHTML = ``;
  nameValidation.style.display = ``;
  return true;
}
function validateUsername(username) {
  let usernameValidation = document.getElementById("username-availability");
  if (username == "") {
    usernameValidation.innerHTML = `please enter a username`;
    usernameValidation.style.display = `flex`;
    return false;
  }
  usernameValidation.innerHTML = ``;
  usernameValidation.style.display = ``;
  return true;
}
function validateEmail(email) {
  let emailValidation = document.getElementById("create-email-validation");
  if (email == "") {
    emailValidation.innerHTML = `please enter a email`;
    emailValidation.style.display = `flex`;
    return false;
  }
  emailValidation.innerHTML = ``;
  emailValidation.style.display = ``;
  return true;
}
// document
//   .getElementById("check-availability")
//   .addEventListener("click", checkUsernameAvailability);
function checkUsernameAvailability() {
  let username = document.getElementById("create-username").value;
  let bool;
  console.log(username);
  fetch(`http://127.0.0.1:5502/checkAvailability?username=${username}`, {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      const avail = document.getElementById("username-availability");
      if (data) {
        avail.style.display = "flex";
        avail.style.color = "green";
        avail.innerHTML = "username is available";
      } else {
        avail.style.display = "flex";
        avail.style.color = "red";
        avail.innerHTML = "username is unavailable";
      }
      bool = data;
    });
  return bool;
}

function addUser() {
  let name = document.getElementById("create-name");
  let username = document.getElementById("create-username");
  let email = document.getElementById("create-email");
  let password = document.getElementById("create-password");
  let confirmPassword = document.getElementById(
    "confirm-create-password"
  );

  if (!validatingName(name.value)) return;
  if (!validateEmail(email.value)) return;
  if (!validateUsername(username.value)) return;
  if (!validatePassword(password.value, confirmPassword.value)) return;
  if (checkUsernameAvailability()) return;

  const userData = {
    name: name.value,
    username: username.value,
    email: email.value,
    password: password.value,
  };

  fetch("http://127.0.0.1:5502/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((res) => {
      return res.json();
    })
    .then((msg) => {
      console.log(msg);
    }).finally(()=>{
      name.innerHTML="";
      username.innerHTML="";
      password.innerHTML="";
      confirmPassword.innerHTML="";
      email.innerHTML="";
    })



}
