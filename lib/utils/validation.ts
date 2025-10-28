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
    return { isValid: false, error: 'validation.date.required' };
  }

  const [day, month, year] = dateString.split('/').map(Number);

  if (!day || !month || !year) {
    return { isValid: false, error: 'validation.date.format' };
  }

  const currentYear = new Date().getFullYear();
  const currentDate = new Date();

  if (year > currentYear) {
    return { isValid: false, error: 'validation.birth.year.future' };
  }

  if (year < 1900) {
    return { isValid: false, error: 'validation.birth.year.before1900' };
  }



    if (year === currentYear) {
      const birthDate = new Date(year, month - 1, day);
      if (birthDate > currentDate) {
        return { isValid: false, error: 'validation.birth.date.future' };
      }
    }

  if (day > 31 || day < 1) {
    return { isValid: false, error: 'validation.day.invalid' };
  }

  if (month > 12 || month < 1) {
    return { isValid: false, error: 'validation.month.invalid' };
  }

  const birthDate = new Date(year, month - 1, day);
  const ageDifMs = currentDate.getTime() - birthDate.getTime();
  const ageDate = new Date(ageDifMs); 
  const age = Math.abs(ageDate.getUTCFullYear() - 1970); 

  if (age > 120) {
    return { isValid: false, error: 'validation.age.unrealistic' };
  }

  if (age < 16) {
    return { isValid: false, error: 'validation.age.tooYoung' };
  }

  return { isValid: true };
}

export const validatePasswordConfirmation = (password: string, confirmation: string): string | null => {
  if (!confirmation) {
    return 'validation.passwordConfirmation.required'
  }
  if (password !== confirmation) {
    return 'validation.passwordConfirmation.mismatch'
  }
  return null
}

export const validateName = (name: string): string | null => {
  if (!name) {
    return 'validation.name.required'
  }
  if (name.length < 2) {
    return 'validation.name.minLength'
  }
  return null
}

export const validateAuthForm = (form: AuthFormData, isLogin: boolean): ValidationErrors => {
  const errors: ValidationErrors = {}

  const emailError = validateEmail(form.email) ? null : 'Email is invalid'
  const emailKey = emailError ? 'validation.email.invalid' : null
  if (emailKey) errors.email = emailKey

  const passwordKey = validatePassword(form.password) ? null : 'validation.password.minLength'
  if (passwordKey) errors.password = passwordKey

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
