const nodemailer = require('nodemailer');

function sendEmail(data) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.emailName,
    subject: 'Email Verification-OTP',
    html: `
        <div style="width:auto;
        height:auto;
        background-color:white;
        text-align: center;
        border-radius: 10px;">
        <div><img src="http://surl.li/gsqyu" style="width:100px;height:100px"></div><br>
            <div><h3>Here is your one-time password</h3></div>
            <h1>${data.randomNumber}</h1>
            <br>
            <div style="color:red">Don't share OTP with anyone!</div>
        </div>
    `
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Email sent ${info.response}`);
    }
  });
  transporter.close();
}

module.exports = { sendEmail };