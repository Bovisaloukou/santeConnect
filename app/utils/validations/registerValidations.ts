import { ValidationResult, PhoneValidationData, BirthdateValidationData, PasswordValidationData } from './types';
import { VALIDATION_CONSTANTS } from './constants';

export const validateFirstName = (value: string): ValidationResult => {
  if (!value) {
    return {
      isValid: false,
      errorMessage: "Le prénom est requis."
    };
  }
  return { isValid: true, errorMessage: "" };
};

export const validateLastName = (value: string): ValidationResult => {
  if (!value) {
    return {
      isValid: false,
      errorMessage: "Le nom est requis."
    };
  }
  return { isValid: true, errorMessage: "" };
};

export const validateEmail = (value: string): ValidationResult => {
  if (!value) {
    return {
      isValid: false,
      errorMessage: "L'email est requis."
    };
  }
  if (!VALIDATION_CONSTANTS.EMAIL.REGEX.test(value)) {
    return {
      isValid: false,
      errorMessage: "Veuillez entrer une adresse email valide."
    };
  }
  return { isValid: true, errorMessage: "" };
};

export const validatePhone = ({ value, countryData }: PhoneValidationData): ValidationResult => {
  const digitsOnlyPhone = value.replace(/\D/g, '');

  if (!value) {
    return {
      isValid: false,
      errorMessage: "Le numéro de téléphone est requis."
    };
  }

  if (countryData?.countryCode === 'bj') {
    const dialCode = countryData.dialCode.replace(/\D/g, '');
    const expectedTotalLength = dialCode.length + 10;

    if (digitsOnlyPhone.length !== expectedTotalLength) {
      return {
        isValid: false,
        errorMessage: `Le numéro de téléphone doit comporter exactement ${expectedTotalLength} chiffres pour le Bénin (incluant l'indicatif).`
      };
    }

    const nationalNumber = digitsOnlyPhone.substring(dialCode.length);
    if (!nationalNumber.startsWith(VALIDATION_CONSTANTS.PHONE.BENIN_NUMBER_PREFIX)) {
      return {
        isValid: false,
        errorMessage: "Pour le Bénin, le numéro de téléphone doit commencer par '01' après l'indicatif (+229)."
      };
    }
  }

  return { isValid: true, errorMessage: "" };
};

export const validateBirthdate = ({ day, month, year, isTouched }: BirthdateValidationData): ValidationResult => {
  if (!isTouched) return { isValid: true, errorMessage: "" };

  if (!day || !month || !year) {
    return {
      isValid: false,
      errorMessage: "Veuillez sélectionner votre date de naissance complète."
    };
  }

  const birthDate = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10)));
  const today = new Date();

  if (birthDate > today) {
    return {
      isValid: false,
      errorMessage: "La date de naissance ne peut pas être dans le futur."
    };
  }

  if (birthDate.getUTCDate() !== parseInt(day, 10)) {
    return {
      isValid: false,
      errorMessage: "La date que vous avez sélectionnée n'est pas valide."
    };
  }

  return { isValid: true, errorMessage: "" };
};

export const validateGenre = (value: string | undefined): ValidationResult => {
  if (!value) {
    return {
      isValid: false,
      errorMessage: "Veuillez sélectionner votre genre."
    };
  }
  return { isValid: true, errorMessage: "" };
};

export const validatePassword = (value: string): ValidationResult => {
  if (!value) {
    return {
      isValid: false,
      errorMessage: "Le mot de passe est requis."
    };
  }

  const { MIN_LENGTH, REQUIRE_UPPERCASE, REQUIRE_LOWERCASE, REQUIRE_NUMBER, REQUIRE_SPECIAL_CHAR, SPECIAL_CHARS } = VALIDATION_CONSTANTS.PASSWORD;

  if (value.length < MIN_LENGTH) {
    return {
      isValid: false,
      errorMessage: "Le mot de passe doit contenir au moins 8 caractères."
    };
  }
  if (REQUIRE_UPPERCASE && !/[A-Z]/.test(value)) {
    return {
      isValid: false,
      errorMessage: "Le mot de passe doit contenir au moins une lettre majuscule."
    };
  }
  if (REQUIRE_LOWERCASE && !/[a-z]/.test(value)) {
    return {
      isValid: false,
      errorMessage: "Le mot de passe doit contenir au moins une lettre minuscule."
    };
  }
  if (REQUIRE_NUMBER && !/\d/.test(value)) {
    return {
      isValid: false,
      errorMessage: "Le mot de passe doit contenir au moins un chiffre."
    };
  }
  if (REQUIRE_SPECIAL_CHAR && !SPECIAL_CHARS.test(value)) {
    return {
      isValid: false,
      errorMessage: "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*(),.?\":{}|<>)."
    };
  }

  return { isValid: true, errorMessage: "" };
};

export const validateConfirmPassword = ({ password, confirmPassword }: PasswordValidationData): ValidationResult => {
  if (!confirmPassword) {
    return {
      isValid: false,
      errorMessage: "La confirmation du mot de passe est requise."
    };
  }
  if (password !== confirmPassword) {
    return {
      isValid: false,
      errorMessage: "Les mots de passe ne correspondent pas."
    };
  }
  return { isValid: true, errorMessage: "" };
}; 