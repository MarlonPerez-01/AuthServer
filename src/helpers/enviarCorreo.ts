import nodemailer from 'nodemailer';
import { config } from '../config/config';

interface IMailOptions {
  to: string;
  subject: string;
  text: string;
}

export const enviarCorreo = async (options: IMailOptions) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: config.SMT.host,
    auth: {
      user: config.SMT.user,
      pass: config.SMT.pass,
    },
    secure: true,
  });

  const mailOptions = {
    from: config.SMT.from,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  return transporter.sendMail(mailOptions);
};
