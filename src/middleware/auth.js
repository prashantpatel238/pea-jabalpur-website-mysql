function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }

  req.session.flash = { type: "error", message: "Please sign in as admin to continue." };
  return res.redirect("/auth/login");
}

function requireMember(req, res, next) {
  if (req.session && req.session.member) {
    return next();
  }

  req.session.flash = { type: "error", message: "Please sign in as a member to continue." };
  return res.redirect("/member/login");
}

module.exports = {
  requireAdmin,
  requireMember
};
