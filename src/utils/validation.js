const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value) {
  return (value || "").trim().toLowerCase();
}

function isValidEmail(value, options = {}) {
  const { allowEmpty = false } = options;
  const normalizedValue = normalizeEmail(value);

  if (!normalizedValue) {
    return allowEmpty;
  }

  return EMAIL_REGEX.test(normalizedValue);
}

function normalizeMobileNumber(value) {
  return (value || "").replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
}

function isValidIndianMobileNumber(value, options = {}) {
  const { allowEmpty = false } = options;
  const normalizedValue = normalizeMobileNumber(value).replace(/^\+/, "");

  if (!normalizedValue) {
    return allowEmpty;
  }

  if (/^[6-9]\d{9}$/.test(normalizedValue)) {
    return true;
  }

  if (/^91[6-9]\d{9}$/.test(normalizedValue)) {
    return true;
  }

  return false;
}

function getEmailValidationMessage(label = "email address") {
  return `Please enter a valid ${label}.`;
}

function getMobileValidationMessage(label = "mobile number") {
  return `Please enter a valid ${label}. Use a 10-digit Indian mobile number like 9425412820.`;
}

module.exports = {
  getEmailValidationMessage,
  getMobileValidationMessage,
  isValidEmail,
  isValidIndianMobileNumber,
  normalizeEmail,
  normalizeMobileNumber
};
