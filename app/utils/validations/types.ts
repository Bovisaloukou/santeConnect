export interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

export interface PhoneValidationData {
  value: string;
  countryData: {
    countryCode: string;
    dialCode: string;
  } | null;
}

export interface BirthdateValidationData {
  day: string;
  month: string;
  year: string;
  isTouched: boolean;
}

export interface PasswordValidationData {
  password: string;
  confirmPassword: string;
} 