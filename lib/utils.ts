import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateFromDDMMYYYY(dateString: string): string {
  if (!dateString) return "";
  const [day, month, year] = dateString.split('/');
  if (day && month && year) {
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateString;
}
