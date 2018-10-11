const Twilio = require('twilio');

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TOKEN;
const from = process.env.FROM;

const client = new Twilio(accountSid, authToken);

module.exports.sendMms = (to, message, mediaUrl) => {
    return client.api.messages
      .create({
        body: message,
        to: to,
        from: from,
        mediaUrl: mediaUrl
      })
        .catch(err => {
        throw err;
      });
}; 
