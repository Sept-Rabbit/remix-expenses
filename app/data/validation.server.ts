import { ExpenseType, AuthType, ValidationErrorType } from "./types.server";

function isValidTitle(value: string) {
  return value && value.trim().length > 0 && value.trim().length <= 30;
}

function isValidAmount(value: number) {
  const amount = value;
  return !isNaN(amount) && amount > 0;
}

function isValidDate(value: Date) {
  return value && new Date(value).getTime() < new Date().getTime();
}

export function validateExpenseInput(input: ExpenseType) {
  let validationErrors: ValidationErrorType = {};

  if (!isValidTitle(input.title)) {
    validationErrors.title =
      "Invalid expense title. Must be at most 30 characters long.";
  }

  if (!isValidAmount(input.amount)) {
    validationErrors.amount =
      "Invalid amount. Must be a number greater than zero.";
  }

  if (!isValidDate(input.date)) {
    validationErrors.date = "Invalid date. Must be a date before today.";
  }

  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}

function isValidEmail(mail:string) {
  // console.log(mail)
  // const mailformat = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
  return mail && mail.includes("@")
}

function isValidPassword(password: string) {
  return password && password.trim().length >= 7
}

export function validateAuthInput(input: AuthType) {

  let authValidationErrors: ValidationErrorType = {};

  if (!isValidEmail(input.email)) {
    authValidationErrors.email = "Invalid email!"
  }

  if (!isValidPassword(input.password)) {
    authValidationErrors.password = "Invalid password!";
  }

  if (Object.keys(authValidationErrors).length > 0) {
    throw authValidationErrors;
  }
}