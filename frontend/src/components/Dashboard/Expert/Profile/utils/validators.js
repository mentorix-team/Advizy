// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone number validation regex (basic international format)
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

// URL validation regex
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Invalid email format';
  return '';
};

export const validatePhone = (phone) => {
  if (!phone) return 'Mobile number is required';
  if (!PHONE_REGEX.test(phone)) return 'Invalid phone number format';
  return '';
};

export const validateUrl = (url) => {
  if (!url) return '';
  if (!URL_REGEX.test(url)) return 'Invalid URL format';
  return '';
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};