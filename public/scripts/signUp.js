async function signupForm(event) {
    event.preventDefault();

    const username = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (username && password) {
        const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),

            headers: {
                'Content-Type': 'application/json'
            }
        });
 
        if (response.ok) {
            alert('Account created! Logging you in now.');
            document.location.replace('/dashboard');
        }

        else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.signup-form').addEventListener('submit', signupForm);