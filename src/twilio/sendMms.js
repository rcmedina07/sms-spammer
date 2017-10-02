const Twilio = require('twilio');

const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const fromNumber = process.env.TWILIO_NUMBER;

const client = new Twilio(accountSid, authToken);

module.exports.sendMms = (to, message, mediaUrl) => {
    return client.api.messages
        .create({
            body: message,
            to: to,
            from: fromNumber,
            mediaUrl: mediaUrl
        }).catch((err) => { throw err });
}; 
