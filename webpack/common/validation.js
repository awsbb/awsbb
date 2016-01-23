'use strict';

const SUCCESS = 'success';
const WARNING = 'warning';
const ERROR = 'error';

export function isValidEmail(email) {
  var pattern = /^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/;
  var regex = new RegExp(pattern, 'i');
  return regex.test(email);
}

export function getEmailValidationClass(email) {
  return isValidEmail(email) ? SUCCESS : ERROR;
};

export function isValidPassword(password) {
  let length = password.length;
  return length > 5;
}

export function getPasswordValidationClass(password) {
  let length = password.length;
  if(length > 10) {
    return SUCCESS;
  }
  if(length > 5) {
    return WARNING;
  }
  return ERROR;
};

export function isValidConfirmation(original, confirmation) {
  return original === confirmation;
}

export function getConfirmationValidationClass(original, confirmation) {
  return isValidConfirmation(original, confirmation) ? SUCCESS : ERROR;
};
