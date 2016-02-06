const SUCCESS = 'success';
const WARNING = 'warning';
const ERROR = 'error';

export function isValidEmail(email) {
  const pattern = /^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/;
  const regex = new RegExp(pattern, 'i');
  return regex.test(email);
}

export function getEmailValidationClass(email) {
  return isValidEmail(email) ? SUCCESS : ERROR;
}

export function isValidPassword(password) {
  const length = password.length;
  return length > 5;
}

export function getPasswordValidationClass(password) {
  const length = password.length;
  if(length > 10) {
    return SUCCESS;
  }
  if(length > 5) {
    return WARNING;
  }
  return ERROR;
}

export function isValidConfirmation({ password, confirmation }) {
  return password === confirmation;
}

export function getConfirmationValidationClass({ password, confirmation }) {
  return isValidConfirmation({ password, confirmation }) ? SUCCESS : ERROR;
}
