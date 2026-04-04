const bcrypt = require("bcryptjs");

const { Member } = require("../models/Member");
const { buildPage } = require("../utils/page");
const { calculateAge, parseCheckbox } = require("../utils/memberData");
const { sanitizeFormState, setFormState } = require("../utils/formState");
const {
  getMobileValidationMessage,
  isValidIndianMobileNumber,
  normalizeMobileNumber
} = require("../utils/validation");

async function renderMemberLogin(req, res) {
  if (req.session.member) {
    return res.redirect("/member/profile");
  }

  return res.render("member/login", {
    page: buildPage("/member/login", "Member Login"),
    formData: res.locals.formState.memberLogin || {}
  });
}

async function handleMemberLogin(req, res) {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  const member = await Member.findOne({ email });

  if (!member || member.membership_status !== "approved") {
    return res.status(401).render("member/login", {
      page: buildPage("/member/login", "Member Login"),
      errorMessage: "Only approved members can sign in.",
      formData: sanitizeFormState(req.body)
    });
  }

  const isValid = await bcrypt.compare(password, member.password_hash);

  if (!isValid) {
    return res.status(401).render("member/login", {
      page: buildPage("/member/login", "Member Login"),
      errorMessage: "Invalid member credentials.",
      formData: sanitizeFormState(req.body)
    });
  }

  member.last_login_at = new Date();
  await member.save();

  req.session.member = {
    id: member._id.toString(),
    full_name: member.full_name,
    email: member.email
  };
  req.session.flash = { type: "success", message: "Member login successful." };
  return res.redirect("/member/profile");
}

function handleMemberLogout(req, res) {
  req.session.destroy(() => {
    res.redirect("/member/login");
  });
}

async function renderMemberProfile(req, res) {
  const member = await Member.findById(req.session.member.id).lean();

  if (!member) {
    req.session.flash = { type: "error", message: "Member profile not found." };
    return res.redirect("/member/login");
  }

  return res.render("member/profile", {
    page: buildPage("/member/profile", "Member Profile"),
    member,
    formData: res.locals.formState.memberProfile || {}
  });
}

async function handleUpdateMemberProfile(req, res) {
  const member = await Member.findById(req.session.member.id);

  if (!member) {
    req.session.flash = { type: "error", message: "Member profile not found." };
    return res.redirect("/member/login");
  }

  member.full_name = (req.body.full_name || "").trim();
  const normalizedPhone = normalizeMobileNumber(req.body.phone);

  if (normalizedPhone && !isValidIndianMobileNumber(normalizedPhone, { allowEmpty: true })) {
    setFormState(req, "memberProfile", req.body);
    req.session.flash = { type: "error", message: getMobileValidationMessage("mobile number") };
    return res.redirect("/member/profile");
  }

  member.phone = normalizedPhone;
  member.profession = (req.body.profession || "").trim();
  member.city = (req.body.city || "").trim();
  member.address = (req.body.address || "").trim();
  member.dob = req.body.dob || null;
  member.gender = (req.body.gender || "").toLowerCase();
  member.marital_status = (req.body.marital_status || "").toLowerCase();
  member.marriage_date = req.body.marriage_date || null;
  member.spouse_name = (req.body.spouse_name || "").trim();
  member.show_in_directory = parseCheckbox(req.body, "show_in_directory");
  member.show_mobile_in_directory = parseCheckbox(req.body, "show_mobile_in_directory");
  member.show_email_in_directory = parseCheckbox(req.body, "show_email_in_directory");
  member.show_city_in_directory = parseCheckbox(req.body, "show_city_in_directory");
  member.show_profession_in_directory = parseCheckbox(req.body, "show_profession_in_directory");
  member.show_photo_in_directory = parseCheckbox(req.body, "show_photo_in_directory");
  member.age = calculateAge(member.dob);

  if (req.body.password) {
    member.password_hash = await bcrypt.hash(req.body.password, 12);
  }

  await member.save();

  req.session.member.full_name = member.full_name;
  req.session.flash = { type: "success", message: "Profile updated successfully." };
  return res.redirect("/member/profile");
}

module.exports = {
  renderMemberLogin,
  handleMemberLogin,
  handleMemberLogout,
  renderMemberProfile,
  handleUpdateMemberProfile
};
