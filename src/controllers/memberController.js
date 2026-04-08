const bcrypt = require("bcryptjs");

const { BLOOD_GROUP_OPTIONS } = require("../constants/memberFields");
const {
  findMemberById,
  updateMemberById
} = require("../repositories/memberRepository");
const { buildPage } = require("../utils/page");
const {
  calculateAge,
  isValidChildrenCount,
  normalizeBloodGroup,
  normalizeChildrenCount,
  normalizeFamilyFields,
  parseCheckbox
} = require("../utils/memberData");
const { getPhotoPath, removeUploadedMemberPhoto } = require("../middleware/memberPhotoUpload");
const { setFormState } = require("../utils/formState");
const {
  getMobileValidationMessage,
  isValidIndianMobileNumber,
  normalizeMobileNumber
} = require("../utils/validation");

function redirectMemberLogin(req, res) {
  return res.redirect("/auth/login");
}

async function renderMemberDashboard(req, res) {
  const member = await findMemberById(req.session.user.id);

  if (!member) {
    req.session.flash = { type: "error", message: "Member profile not found." };
    return res.redirect("/auth/login");
  }

  return res.render("member/dashboard", {
    page: buildPage("/member/dashboard", "Member Dashboard"),
    member
  });
}

async function renderMemberProfile(req, res) {
  const member = await findMemberById(req.session.user.id);

  if (!member) {
    req.session.flash = { type: "error", message: "Member profile not found." };
    return res.redirect("/auth/login");
  }

  return res.render("member/profile", {
    page: buildPage("/member/profile", "Member Profile"),
    member,
    formData: res.locals.formState.memberProfile || {},
    bloodGroupOptions: BLOOD_GROUP_OPTIONS
  });
}

async function handleUpdateMemberProfile(req, res) {
  const member = await findMemberById(req.session.user.id);

  if (!member) {
    removeUploadedMemberPhoto(getPhotoPath(req.file));
    req.session.flash = { type: "error", message: "Member profile not found." };
    return res.redirect("/auth/login");
  }

  if (req.photoUploadError) {
    setFormState(req, "memberProfile", req.body);
    req.session.flash = { type: "error", message: req.photoUploadError };
    return res.redirect("/member/profile");
  }

  const normalizedPhone = normalizeMobileNumber(req.body.phone);
  const nextPhoto = req.file ? getPhotoPath(req.file) : member.photo;

  if (normalizedPhone && !isValidIndianMobileNumber(normalizedPhone, { allowEmpty: true })) {
    removeUploadedMemberPhoto(getPhotoPath(req.file));
    setFormState(req, "memberProfile", req.body);
    req.session.flash = { type: "error", message: getMobileValidationMessage("mobile number") };
    return res.redirect("/member/profile");
  }

  if (!isValidChildrenCount(req.body.children_count)) {
    removeUploadedMemberPhoto(getPhotoPath(req.file));
    setFormState(req, "memberProfile", req.body);
    req.session.flash = { type: "error", message: "Children count must be a non-negative whole number." };
    return res.redirect("/member/profile");
  }

  const updatedMember = normalizeFamilyFields({
    ...member,
    full_name: (req.body.full_name || "").trim(),
    phone: normalizedPhone,
    photo: nextPhoto,
    profession: (req.body.profession || "").trim(),
    city: (req.body.city || "").trim(),
    address: (req.body.address || "").trim(),
    dob: req.body.dob || null,
    gender: (req.body.gender || "").toLowerCase(),
    blood_group: normalizeBloodGroup(req.body.blood_group),
    marital_status: (req.body.marital_status || "").toLowerCase(),
    marriage_date: req.body.marriage_date || null,
    spouse_name: (req.body.spouse_name || "").trim(),
    children_count: normalizeChildrenCount(req.body.children_count),
    show_in_directory: parseCheckbox(req.body, "show_in_directory"),
    show_mobile_in_directory: parseCheckbox(req.body, "show_mobile_in_directory"),
    show_email_in_directory: parseCheckbox(req.body, "show_email_in_directory"),
    show_city_in_directory: parseCheckbox(req.body, "show_city_in_directory"),
    show_profession_in_directory: parseCheckbox(req.body, "show_profession_in_directory"),
    show_photo_in_directory: parseCheckbox(req.body, "show_photo_in_directory")
  });
  updatedMember.age = calculateAge(updatedMember.dob);

  if (req.body.password) {
    updatedMember.password_hash = await bcrypt.hash(req.body.password, 12);
  }

  const savedMember = await updateMemberById(member.id, updatedMember);

  if (req.file && member.photo && member.photo !== savedMember.photo) {
    removeUploadedMemberPhoto(member.photo);
  }

  req.session.user.display_name = updatedMember.full_name;
  req.session.flash = { type: "success", message: "Profile updated successfully." };
  return res.redirect("/member/dashboard");
}

module.exports = {
  redirectMemberLogin,
  renderMemberDashboard,
  renderMemberProfile,
  handleUpdateMemberProfile
};
