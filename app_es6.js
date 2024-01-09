document.getElementById('email-form').addEventListener('submit', async event => {
    event.preventDefault();

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });

    const getContentType = filename => {
        const extension = filename.split('.').pop().toLowerCase();
        return extension === 'pdf' ? 'application/pdf' :
               extension.match(/jpe?g/) ? 'image/jpeg' :
               extension === 'png' ? 'image/png' :
               'application/octet-stream';
    };

    const emailData = {
        fromEmail: document.getElementById('sender').value,
        fromName: document.getElementById('senderName').value,
        toEmail: document.getElementById('recipient').value,
        toName: document.getElementById('recipientName').value,
        subject: document.getElementById('subject').value,
        htmlPart: document.getElementById('body').value,
        base64Attachments: []
    };

    const attachments = document.getElementById('attachments').files;
    for (const attachment of attachments) {
        emailData.base64Attachments.push({
            Filename: attachment.name,
            Content: await toBase64(attachment),
            ContentType: getContentType(attachment.name)
        });
    }

    const notyf = new Notyf({ types: [{ type: 'info', background: 'blue', icon: false }] });

    const notify = (message, type = 'info') => {
        if (type === 'success' || type === 'error') {
            notyf[type](message);
        } else {
            notyf.open({ type, message });
        }
    };

    notify('Sending <b>email</b>.....', 'info');

    try {
        const response = await fetch('https://us-central1-net-av-mailer.cloudfunctions.net/net-av-mailer-gmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) throw new Error('Email sending failed');
        notify('Email sent successfully', 'success');
    } catch (error) {
        console.error('Error:', error);
        notify('Failed to send email. Please try again.', 'error');
    }

    setTimeout(() => notyf.dismissAll(), 1000);
});
