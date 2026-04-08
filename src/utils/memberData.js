const { BLOOD_GROUP_OPTIONS } = require("../constants/memberFields");
const { normalizeEmail, normalizeMobileNumber } = require("./validation");

function calculateAge(dob) {
  if (!dob) {
    return null;
  }

  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function parseCheckbox(body, fieldName) {
  return Boolean(body[fieldName]);
}

function normalizeBloodGroup(value) {
  const normalizedValue = typeof value === "string" ? value.trim() : "";
  return BLOOD_GROUP_OPTIONS.includes(normalizedValue) ? normalizedValue : "";
}

function normalizeChildrenCount(value, fallback = null) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 0) {
    return Number.isInteger(fallback) && fallback >= 0 ? fallback : null;
  }

  return parsedValue;
}

function isValidChildrenCount(value) {
  if (value === undefined || value === null || value === "") {
    return true;
  }

  return Number.isInteger(Number(value)) && Number(value) >= 0;
}

function normalizeFamilyFields(payload) {
  if (payload.marital_status !== "married") {
    return {
      ...payload,
      spouse_name: "",
      marriage_date: null,
      children_count: null
    };
  }

  return payload;
}

function normalizePublicMemberInput(body) {
  return normalizeFamilyFields({
    full_name: body.full_name || body.name || "",
    email: normalizeEmail(body.email),
    phone: normalizeMobileNumber(body.phone),
    profession: (body.profession || "").trim(),
    role: body.role || "General Member",
    city: (body.city || "").trim(),
    address: (body.address || "").trim(),
    dob: body.dob || body.date_of_birth || null,
    gender: (body.gender || "").toLowerCase(),
    marital_status: (body.marital_status || "").toLowerCase(),
    spouse_name: (body.spouse_name || "").trim(),
    marriage_date: body.marriage_date || null,
    blood_group: normalizeBloodGroup(body.blood_group),
    children_count: normalizeChildrenCount(body.children_count)
  });
}

function buildAdminMemberPayload(body, existingMember) {
  const shouldShowInLeadership = parseCheckbox(body, "show_in_leadership_section") || parseCheckbox(body, "is_important_member");

  return normalizeFamilyFields({
    full_name: (body.full_name ?? existingMember?.full_name ?? "").trim(),
    email: normalizeEmail(body.email ?? existingMember?.email),
    phone: normalizeMobileNumber(body.phone ?? existingMember?.phone),
    profession: (body.profession ?? existingMember?.profession ?? "").trim(),
    role: body.role || existingMember?.role || "General Member",
    city: (body.city ?? existingMember?.city ?? "").trim(),
    address: (body.address ?? existingMember?.address ?? "").trim(),
    dob: body.dob ?? existingMember?.dob ?? null,
    gender: (body.gender ?? existingMember?.gender ?? "").toLowerCase(),
    marital_status: (body.marital_status ?? existingMember?.marital_status ?? "").toLowerCase(),
    marriage_date: body.marriage_date ?? existingMember?.marriage_date ?? null,
    spouse_name: (body.spouse_name ?? existingMember?.spouse_name ?? "").trim(),
    blood_group: normalizeBloodGroup(body.blood_group ?? existingMember?.blood_group ?? ""),
    children_count: body.children_count === undefined
      ? (existingMember?.children_count ?? null)
      : normalizeChildrenCount(body.children_count),
    leadership_title: (body.leadership_title ?? existingMember?.leadership_title ?? "").trim(),
    notes: (body.notes ?? existingMember?.notes ?? "").trim(),
    admin_notes: (body.admin_notes ?? existingMember?.admin_notes ?? "").trim(),
    show_in_directory: parseCheckbox(body, "show_in_directory"),
    show_mobile_in_directory: parseCheckbox(body, "show_mobile_in_directory"),
    show_email_in_directory: parseCheckbox(body, "show_email_in_directory"),
    show_city_in_directory: parseCheckbox(body, "show_city_in_directory"),
    show_profession_in_directory: parseCheckbox(body, "show_profession_in_directory"),
    show_photo_in_directory: parseCheckbox(body, "show_photo_in_directory"),
    show_in_leadership_section: shouldShowInLeadership,
    is_important_member: shouldShowInLeadership,
    important_member_order: Number(body.important_member_order || 0),
    registration_source: (body.registration_source || existingMember?.registration_source || "admin").trim(),
    age: calculateAge(body.dob ?? existingMember?.dob ?? null)
  });
}

module.exports = {
  buildAdminMemberPayload,
  calculateAge,
  isValidChildrenCount,
  normalizeBloodGroup,
  normalizeChildrenCount,
  normalizeFamilyFields,
  normalizePublicMemberInput,
  parseCheckbox
};
