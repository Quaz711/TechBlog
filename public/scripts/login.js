async function loginForm(event) {
    event.preventDefault();

    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (username && password) {
        console.log('=========LOG IN=============');
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username,
                password
            }),

            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log('=========RESPONSE OKAY=============');
            document.location.replace('/dashboard/');
        }

        else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.login-form').addEventListener('submit', loginForm);