const nodemailer = require('nodemailer');

const sendEmail = (to, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'nenasainvestment2019@gmail.com', // Replace with your Gmail email
            pass: 'gxouypacobthpvbe' // Replace with your Gmail password or app-specific password
        }
    });

    const mailOptions = {
        from: 'nenasainvestment2019@gmail.com', // Sender's email address
        to: to, // Receiver's email address
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

const sendEmailWithAttachment = (to, subject, message, uploadedFile) => {
  const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'nenasainvestment2019@gmail.com', // Replace with your Gmail email
          pass: 'gxouypacobthpvbe' // Replace with your Gmail password or app-specific password
      }
  });

  console.log(uploadedFile.path)
  const mailOptions = {
      from: 'nenasainvestment2019@gmail.com', // Sender's email address
      to: to, // Receiver's email address
      subject: subject,
      text: message,
      attachments: [
          {
              filename: uploadedFile.filename,  // Use filename instead of originalname
              path: uploadedFile.path
          }
      ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
      } else {
          console.log('Email sent:', info.response);
      }
  });
};

const sendVerificationEmail = (email, verificationToken) => {
    console.log(email + verificationToken)
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'nenasainvestment2019@gmail.com', // Replace with your Gmail email
            pass: 'gxouypacobthpvbe' // Replace with your Gmail password or app-specific password
        }
    });

    const verificationLink = `http://107.22.136.172:3006/api/user/verifyCreateEmail/${verificationToken}`;

    const mailOptions = {
        from: 'nenasainvestment2019@gmail.com', // Sender's email address
        to: email, // Receiver's email address (dealer's email)
        subject: 'Account Verification',
        text: `Thank you for register as a dealer with ceylinco genaral insurance.please verify your account by clicking the link ${verificationLink}. please contact us for any problem  or more information 0766 910710`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = { sendEmail, sendEmailWithAttachment, sendVerificationEmail};
