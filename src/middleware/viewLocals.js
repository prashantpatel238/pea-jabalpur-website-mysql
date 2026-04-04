const site = require("../config/site");

function attachViewLocals(req, res, next) {
  res.locals.site = site;
  res.locals.currentAdmin = req.session ? req.session.admin : null;
  res.locals.currentMember = req.session ? req.session.member : null;
  res.locals.flash = req.session ? req.session.flash : null;
  res.locals.formState = req.session ? req.session.formState || {} : {};

  if (req.session) {
    delete req.session.flash;
    delete req.session.formState;
  }

  next();
}

module.exports = {
  attachViewLocals
};
