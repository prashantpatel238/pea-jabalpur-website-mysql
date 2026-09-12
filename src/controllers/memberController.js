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
  normalizeFamilyFields
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

function buildMemberProfileUpdate(member, body, nextPhoto) {
  return normalizeFamilyFields({
    ...member,
    full_name: (body.full_name || "").trim(),
    phone: normalizeMobileNumber(body.phone),
    photo: nextPhoto,
    profession: (body.profession || "").trim(),
    city: (body.city || "").trim(),
    address: (body.address || "").trim(),
    dob: body.dob || null,
    gender: (body.gender || "").toLowerCase(),
    blood_group: normalizeBloodGroup(body.blood_group),
    marital_status: (body.marital_status || "").toLowerCase(),
    marriage_date: body.marriage_date || null,
    spouse_name: (body.spouse_name || "").trim(),
    children_count: normalizeChildrenCount(body.children_count)
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

  const updatedMember = buildMemberProfileUpdate(member, req.body, nextPhoto);
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
  handleUpdateMemberProfile,
  buildMemberProfileUpdate
};
