export const VALIDATION_CONSTANTS = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: true,
    SPECIAL_CHARS: /[!@#$%^&*(),.?":{}|<>]/,
  },
  PHONE: {
    BENIN_DIAL_CODE: '229',
    BENIN_NUMBER_PREFIX: '01',
  },
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} as const; 