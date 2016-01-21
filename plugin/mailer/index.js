'use strict';

const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const auth = {
  auth: {
    api_key: Config.MG_API_KEY,
    domain: Config.MG_DOMAIN
  }
};

const nodemailerMailgun = nodemailer.createTransport(mg(auth));

export function sendEmail(options, callback) {
  var MGOptions = {
    from: 'Administrator 👥 [awsBB] <administrator@awsbb.com>',
    to: options.Destination.ToAddresses[0],
    subject: options.Message.Subject,
    html: options.Message.Body.Html.Data
  };
  nodemailerMailgun.sendMail(MGOptions, function (err, info) {
    callback(null, info);
  });
};
