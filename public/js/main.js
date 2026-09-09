const menuToggle = document.querySelector("[data-mobile-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const siteHeader = document.querySelector("[data-site-header]");

if (siteHeader) {
  const updateHeader = () => siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (menuToggle && mobileMenu) {
  const closeMobileMenu = () => {
    mobileMenu.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    menuToggle.setAttribute("aria-expanded", String(!mobileMenu.classList.contains("hidden")));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      closeMobileMenu();
    }
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

document.querySelectorAll("form[data-single-submit]").forEach((form) => {
  form.addEventListener("submit", () => {
    if (form.dataset.submitting === "true") {
      return;
    }

    form.dataset.submitting = "true";

    const submitButtons = form.querySelectorAll('button[type="submit"]');

    submitButtons.forEach((button) => {
      button.disabled = true;
      button.classList.add("opacity-70", "cursor-not-allowed");

      if (!button.dataset.originalText) {
        button.dataset.originalText = button.textContent;
      }

      button.textContent = "Saving...";
    });
  });
});
