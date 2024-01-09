document.getElementById('email-form').addEventListener('submit', async event => {
    event.preventDefault();

    // Function to convert file to Base64
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // Extract base64 part
        reader.onerror = error => reject(error);
    });

// Get content type based on file extension
    const getContentType = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf': return 'application/pdf';
            case 'jpg':
            case 'jpeg': return 'image/jpeg';
            case 'png': return 'image/png';
            // Add more cases as needed
            default: return 'application/octet-stream'; // Default type
        }
    };

    // Collecting form data
    const emailData = {
        fromEmail: document.getElementById('sender').value,
        fromName: document.getElementById('senderName').value,
        toEmail: document.getElementById('recipient').value,
        toName: document.getElementById('recipientName').value,
        subject: document.getElementById('subject').value,
        htmlPart: document.getElementById('body').value,
        base64Attachments: []
    };

    // Converting attachments to Base64 and including the original file name
    const attachments = document.getElementById('attachments').files;
    for (let i = 0; i < attachments.length; i++) {
        const attachment = attachments[i];
        const base64Attachment = await toBase64(attachment);
        emailData.base64Attachments.push({
            Filename: attachment.name,
            Content: base64Attachment,
            ContentType: getContentType(attachment.name) 
        });
    }

    console.log('Sending email...',emailData);

    try {
        const response = await fetch('https://us-central1-net-av-mailer.cloudfunctions.net/net-av-mailer-gmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData) // Sending the JSON object
        });

        if (!response.ok) {
            throw new Error('Email sending failed');
        }
        //alert('Email sent successfully');
        new Notyf().success('Email sent successfully');

    } catch (error) {
        console.error('Error:', error);
        //alert('Failed to send email. Please try again.');
        new Notyf().error('Failed to send email. Please try again.');
    }
});
