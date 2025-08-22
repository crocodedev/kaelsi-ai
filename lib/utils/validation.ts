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

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function validateBirthDate(dateString: string): { isValid: boolean; error?: string } {
  if (!dateString) {
    return { isValid: false, error: 'Date is required' };
  }

  const [day, month, year] = dateString.split('/').map(Number);
  
  if (!day || !month || !year) {
    return { isValid: false, error: 'Invalid date format' };
  }

  const currentYear = new Date().getFullYear();
  const currentDate = new Date();
  
  if (year > currentYear) {
    return { isValid: false, error: 'Birth year cannot be in the future' };
  }
  
  if (year < 1900) {
    return { isValid: false, error: 'Birth year cannot be before 1900' };
  }
  
  if (year === currentYear) {
    const birthDate = new Date(year, month - 1, day);
    if (birthDate > currentDate) {
      return { isValid: false, error: 'Birth date cannot be in the future' };
    }
  }

  if(day > 31 || day < 1) {
    return { isValid: false, error: 'Day is invalid' };
  }

  if(month > 12 || month < 1) {
    return { isValid: false, error: 'Month is invalid' };
  }

  const birthDate = new Date(year, month - 1, day);
  const age = currentYear - year;
  
  if (age > 120) {
    return { isValid: false, error: 'Birth year seems unrealistic' };
  }

  return { isValid: true };
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

  const emailError = validateEmail(form.email) ? null : 'Email is invalid'
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(form.password) ? null : 'Password must be at least 6 characters'
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
