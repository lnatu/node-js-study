const nodemailer = require('nodemailer');

// new Email(user, url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `That developer ${process.env.EMAIL_FROM}`;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      // 1. send grid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send the email
  send(template, subject) {
    // 1. Render HTML base on pug template
    res.render('')

    // 2. Define email options
    const mailOptions = {
      from: 'That developer <something.io>',
      to: options.email,
      subject: options.subject,
      text: options.message
    };

    // 3. Create a transport and email
  }

  sendWelcome() {
    this.send('welcome', 'Welcome to natours');
  }
};

const sendEmail = async options => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2. Define the email options
  const mailOptions = {
    from: 'That developer <something.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};
