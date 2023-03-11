async function newForm(event) {
    event.preventDefault();
    console.log('=========ENTERED ADD FUNCTION=============');

    const title = document.querySelector('input[name="post-title"]').value;
    const post_text = document.querySelector('input[name="post-text"]').value;
    console.log('TITLE: ' + title + ' AND TEXT: ' + post_text);
    const response = await fetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            post_text
        }),

        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    }

    else {
        alert(response.statusText);
    }
}

document.querySelector('.new-post-form').addEventListener('submit', newForm);