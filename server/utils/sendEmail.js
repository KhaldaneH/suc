import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SMTP settings
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmailToUsers = async (emails, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emails, // string of comma-separated emails
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
