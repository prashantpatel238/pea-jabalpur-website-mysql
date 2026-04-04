const menuToggle = document.querySelector("[data-mobile-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

if (window.lucide) {
  window.lucide.createIcons();
}

function showPopupMessage(message) {
  if (!message) {
    return;
  }

  window.alert(message);
}

function isValidIndianMobileNumber(value) {
  const normalizedValue = (value || "").replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "").replace(/^\+/, "");

  if (!normalizedValue) {
    return true;
  }

  return /^[6-9]\d{9}$/.test(normalizedValue) || /^91[6-9]\d{9}$/.test(normalizedValue);
}

function getPhoneValidationMessage(label) {
  return `Please enter a valid ${label}. Use a 10-digit Indian mobile number like 9425412820.`;
}

document.querySelectorAll("[data-popup-message]").forEach((element) => {
  showPopupMessage(element.getAttribute("data-popup-message"));
});

document.querySelectorAll("form[data-validate-popup]").forEach((form) => {
  form.setAttribute("novalidate", "novalidate");

  const emailInputs = Array.from(form.querySelectorAll('input[type="email"]'));
  const phoneInputs = Array.from(form.querySelectorAll('input[name="phone"], input[name="contact_phone"], input[name="whatsapp_number"]'));

  function applyCustomValidation() {
    emailInputs.forEach((input) => {
      input.setCustomValidity("");

      if (input.required && !input.value.trim()) {
        input.setCustomValidity("This field is required.");
        return;
      }

      if (input.value.trim() && !input.checkValidity()) {
        input.setCustomValidity("Please enter a valid email address.");
      }
    });

    phoneInputs.forEach((input) => {
      input.setCustomValidity("");

      if (input.required && !input.value.trim()) {
        input.setCustomValidity("This field is required.");
        return;
      }

      if (input.value.trim() && !isValidIndianMobileNumber(input.value)) {
        const label = input.dataset.validationLabel || input.getAttribute("placeholder") || "mobile number";
        input.setCustomValidity(getPhoneValidationMessage(label.toLowerCase()));
      }
    });
  }

  form.addEventListener("submit", (event) => {
    applyCustomValidation();

    if (form.checkValidity()) {
      return;
    }

    event.preventDefault();

    const firstInvalidField = form.querySelector(":invalid");

    if (firstInvalidField) {
      showPopupMessage(firstInvalidField.validationMessage);
      firstInvalidField.focus();
    }
  });

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", applyCustomValidation);
    field.addEventListener("change", applyCustomValidation);
  });
});
