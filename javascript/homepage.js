title = "Guitar Editor";

var modalSignIn = document.getElementsByClassName('modal')[0]
var signIn = document.getElementById('login');

signIn.onclick = function(event) {
    modalSignIn.style.display = 'block';
    document.title = "Log In | " + title;
};

var modalSignUp = document.getElementsByClassName('modal')[1]
var signUp = document.getElementById('register');

signUp.onclick = function(event) {
    modalSignUp.style.display = 'block';
    document.title = "Register | " + title;
}

window.onclick = function(event) {
    if (event.target == modalSignIn) {
        modalSignIn.style.display = 'none';
        document.getElementById('login-username').value = null;
        document.getElementById('login-password').value = null;
        document.getElementById('login-error').style.visibility = 'hidden';
        document.title = title;
    } else if (event.target == modalSignUp) {
        modalSignUp.style.display = 'none';
        document.getElementById('register-username').value = null;
        document.getElementById('register-password').value = null;
        document.getElementById('register-confirm-password').value = null;
        document.getElementById('register-error').style.visibility = 'hidden';
        document.title = title;
    }
}

const loginFormHandler = event => {
    event.preventDefault();
    const formElement = event.target;
    const formData = {
        username: document.getElementById('login-username').value,
        password: document.getElementById('login-password').value,
    };

    fetch(formElement.getAttribute('action'), {
        method: 'POST',
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(({success}) => {
        if (success) {
            document.location.assign('../html/logged-homepage.html');
        } else {
            document.getElementById('login-username').value = null;
            document.getElementById('login-password').value = null;
            document.getElementById('login-error').style.visibility = 'visible';
        }
    });
}

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', loginFormHandler);

const registerFormHandler = event => {
    event.preventDefault();
    usernameElement = document.getElementById('register-username');
    passwordElement = document.getElementById('register-password');
    confirmPasswordElement = document.getElementById('register-confirm-password');
    errorElement = document.getElementById('register-error');
    const formElement = event.target;
    const formData = {
        username: usernameElement.value,
        password: passwordElement.value,
        confirm_password: confirmPasswordElement.value,
    };
    
    console.log(formData.username);
    if (formData.username.length < 6) {
        errorElement.innerHTML = `Username must be at least 6 characters long.`
        errorElement.style.visibility = 'visible';
    } else if (formData.password.length < 6) {
        errorElement.innerHTML = `Password must be at least 6 characters long.`
        errorElement.style.visibility = 'visible';
    } else {
        fetch(formElement.getAttribute('action'), {
            method: 'POST',
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(response => {
            $success = response['success'];
            if ($success) {
                document.location.assign('../html/logged-homepage.html');
            } else {
                $error = response['error'];
                if ($error != 'Passwords don\'t match!') {
                    usernameElement.value = null;
                }
                passwordElement.value = null;
                confirmPasswordElement.value = null;
                errorElement.innerHTML = $error;
                errorElement.style.visibility = 'visible';
            }
        });
    }
}

const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', registerFormHandler);