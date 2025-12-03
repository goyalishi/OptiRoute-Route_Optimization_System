import nodemailer from "nodemailer";

const sendMail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Route Optimizer" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};

export default sendMail;