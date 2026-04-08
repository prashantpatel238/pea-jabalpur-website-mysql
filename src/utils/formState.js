function sanitizeFormState(data = {}) {
  const nextData = { ...data };

  delete nextData.password;
  delete nextData.confirm_password;
  delete nextData.otp;

  return nextData;
}

function setFormState(req, key, data) {
  if (!req.session || !key) {
    return;
  }

  req.session.formState = {
    ...(req.session.formState || {}),
    [key]: sanitizeFormState(data)
  };
}

module.exports = {
  sanitizeFormState,
  setFormState
};
