import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';

const auth = {
  auth: {
    api_key: process.env.MG_API_KEY,
    domain: process.env.MG_DOMAIN
  }
};

const nodemailerMailgun = nodemailer.createTransport(mg(auth));

export function sendEmail(options, callback) {
  const MGOptions = {
    from: options.Source,
    to: options.Destination.ToAddresses[0],
    subject: options.Message.Subject.Data,
    html: options.Message.Body.Html.Data
  };
  nodemailerMailgun.sendMail(MGOptions, (err, info) => callback(err, info));
}
