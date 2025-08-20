import { Coordinates } from "@/store/slices/tarot/types"

export interface AuthFormData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface ValidationErrors {
  [key: string]: string
}

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required'
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return 'Email is invalid'
  }
  return null
}

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required'
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters'
  }
  return null
}

export const validatePasswordConfirmation = (password: string, confirmation: string): string | null => {
  if (!confirmation) {
    return 'Password confirmation is required'
  }
  if (password !== confirmation) {
    return 'Passwords do not match'
  }
  return null
}

export const validateName = (name: string): string | null => {
  if (!name) {
    return 'Name is required'
  }
  if (name.length < 2) {
    return 'Name must be at least 2 characters'
  }
  return null
}

export const validateAuthForm = (form: AuthFormData, isLogin: boolean): ValidationErrors => {
  const errors: ValidationErrors = {}

  const emailError = validateEmail(form.email)
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(form.password)
  if (passwordError) errors.password = passwordError

  if (!isLogin) {
    const nameError = validateName(form.name)
    if (nameError) errors.name = nameError

    const confirmationError = validatePasswordConfirmation(form.password, form.password_confirmation)
    if (confirmationError) errors.password_confirmation = confirmationError
  }

  return errors
} 



export const transformMatrixToArray = (matrix: any): Coordinates[] => {
  if (matrix && typeof matrix === 'object' && !Array.isArray(matrix)) {
      let result: { x: number; y: number }[] = [];
      Object.values(matrix).forEach((value: any) => {
          if (Array.isArray(value) && value.length === 2) {
              const [x, y] = value;
              result.push({ x, y });
          }
      });
      return result;
  }
  return matrix || [];
};
