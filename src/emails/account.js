const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail
    .send({
      to: email,
      from: 'jisoolee0929@gmail.com',
      subject: 'Thanks for joining in',
      text: `Welcome ${name}`,
    })
    .then((result) => {
    })
    .catch((error) => {
      console.log(error);
    });
};


const sendCancelEmail = (email, name) => {
    sgMail
    .send({
      to: email,
      from: 'jisoolee0929@gmail.com',
      subject: 'Cancelation email',
      text: `${name} please reply about the reason why you cancel this account`,
    })
    .then((result) => {
    })
    .catch((error) => {
      console.log(error);
    });

}



module.exports = { sendWelcomeEmail, sendCancelEmail };
