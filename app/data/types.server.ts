export interface ExpenseType {
  title: string;
  amount: number;
  date: Date
}

export interface ValidationErrorType {
  [key:string]: string
}

export interface AuthType {
  email: string;
  password: string
}

export interface ErrorType extends Error {
  status?: number
}