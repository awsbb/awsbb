'use strict';

import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';

const auth = {
  auth: {
    api_key: Config.MG_API_KEY,
    domain: Config.MG_DOMAIN
  }
};

const nodemailerMailgun = nodemailer.createTransport(mg(auth));

export function sendEmail(options, callback) {
  var MGOptions = {
    from: options.Source,
    to: options.Destination.ToAddresses[0],
    subject: options.Message.Subject.Data,
    html: options.Message.Body.Html.Data
  };
  nodemailerMailgun.sendMail(MGOptions, function (err, info) {
    callback(null, info);
  });
};
