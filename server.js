const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
    '5494dcf6eafc1a93faaab2d5ece45a81',
    '742a5c417e529233dda1628cb44959b5',
);

const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: "rmbaylin@net-av.com",
                Name: "Mailjet Pilot"
              },
              To: [
                {
                  Email: "doghousedev@gmail.com",
                  Name: "passenger 1"
                }
              ],
              Subject: "Your email flight plan!",
              TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
              HTMLPart: "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
            }
          ]
        })

request
    .then((result) => {
        console.log(result.body)
    })
    .catch((err) => {
        console.log(err.statusCode)
    })