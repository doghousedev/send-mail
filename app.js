document.getElementById('email-form').addEventListener('submit', async event => {
    event.preventDefault();

    const recipient = document.getElementById('recipient').value;
    const subject = document.getElementById('subject').value;
    const body = document.getElementById('body').value;

    try {
        const response = await fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ recipient, subject, body })
        });

        if (!response.ok) {
            throw new Error('Email sending failed');
        }
        alert('Email sent successfully');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to send email. Please try again.');
    }
});
