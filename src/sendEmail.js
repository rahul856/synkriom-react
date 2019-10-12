import nodemailer from "nodemailer";

const sendEmail = mailOptions => {
  let transporter = nodemailer.createTransport({
    sendmail: true,
    service: "gmail",
    type: "SMTP",
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: "kshitijsaxenaingram@gmail.com",
      pass: "understand0"
    }
  });
  transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  console.log("Transporter-->", transporter);
  console.log("mailOptions-->", mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message %s sent: %s", info.messageId, info.response);
  });
};

export default sendEmail;
