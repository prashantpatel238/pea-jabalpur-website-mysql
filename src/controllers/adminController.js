const bcrypt = require("bcryptjs");

const { MEMBER_ROLES } = require("../constants/memberRoles");
const {
  countMembers,
  createMember,
  deleteMemberById,
  findMemberById,
  listMembers,
  updateMemberById
} = require("../repositories/adminMemberRepository");
const {
  createNotice,
  deleteNoticeById,
  findNoticeById,
  listNotices,
  updateNoticeById
} = require("../repositories/noticeRepository");
const { buildPage } = require("../utils/page");
const { buildAdminMemberPayload, parseCheckbox } = require("../utils/memberData");
const { approveMember, rejectMember } = require("../services/memberApprovalService");
const { getPhotoPath, removeUploadedMemberPhoto } = require("../middleware/memberPhotoUpload");
const { setFormState } = require("../utils/formState");
const {
  getEmailValidationMessage,
  getMobileValidationMessage,
  isValidEmail,
  isValidIndianMobileNumber
} = require("../utils/validation");

function getAdminMemberRedirectPath(status) {
  if (status === "approved") {
    return "/admin/members/approved";
  }

  if (status === "pending") {
    return "/admin/members/pending";
  }

  return "/admin/dashboard";
}

async function renderDashboard(req, res) {
  const [pendingMembers, members, notices, totalMembers, pendingCount, approvedCount, leadershipCount] = await Promise.all([
    listMembers({ membershipStatus: "pending" }),
    listMembers(),
    listNotices(),
    countMembers(),
    countMembers({ membershipStatus: "pending" }),
    countMembers({ membershipStatus: "approved" }),
    countMembers({ membershipStatus: "approved", leadershipOnly: true })
  ]);

  res.render("admin/dashboard", {
    page: buildPage("/admin/dashboard", "Admin Dashboard"),
    pendingMembers,
    members,
    notices,
    memberRoles: MEMBER_ROLES,
    summary: {
      totalMembers,
      pendingMembers: pendingCount,
      approvedMembers: approvedCount,
      leadershipMembers: leadershipCount
    },
    formData: res.locals.formState.adminCreateMember || {}
  });
}

async function renderPendingMembers(req, res) {
  const members = await listMembers({ membershipStatus: "pending" });

  res.render("admin/member-list", {
    page: buildPage("/admin/members/pending", "Pending Members"),
    heading: "Pending Members",
    description: "Review submitted registrations and decide whether to approve or reject them.",
    members,
    memberStatus: "pending"
  });
}

async function renderApprovedMembers(req, res) {
  const members = await listMembers({ membershipStatus: "approved" });

  res.render("admin/member-list", {
    page: buildPage("/admin/members/approved", "Approved Members"),
    heading: "Approved Members",
    description: "Browse approved members and open individual records for updates.",
    members,
    memberStatus: "approved"
  });
}

async function renderMemberDetail(req, res) {
  const member = await findMemberById(req.params.id);

  if (!member) {
    req.session.flash = { type: "error", message: "Member not found." };
    return res.redirect("/admin/dashboard");
  }

  return res.render("admin/member-detail", {
    page: buildPage(`/admin/members/${req.params.id}`, "Member Details"),
    member
  });
}

async function handleCreateMember(req, res) {
  const payload = buildAdminMemberPayload(req.body);
  const password = req.body.password || "";
  const membership_status = req.body.membership_status || "approved";
  const photo = getPhotoPath(req.file);

  if (req.photoUploadError) {
    setFormState(req, "adminCreateMember", req.body);
    req.session.flash = { type: "error", message: req.photoUploadError };
    return res.redirect("/admin/dashboard");
  }

  if (!payload.full_name || !payload.email || !password) {
    removeUploadedMemberPhoto(photo);
    setFormState(req, "adminCreateMember", req.body);
    req.session.flash = { type: "error", message: "Full name, email, and password are required." };
    return res.redirect("/admin/dashboard");
  }

  if (!isValidEmail(payload.email)) {
    removeUploadedMemberPhoto(photo);
    setFormState(req, "adminCreateMember", req.body);
    req.session.flash = { type: "error", message: getEmailValidationMessage("email address") };
    return res.redirect("/admin/dashboard");
  }

  if (payload.phone && !isValidIndianMobileNumber(payload.phone, { allowEmpty: true })) {
    removeUploadedMemberPhoto(photo);
    setFormState(req, "adminCreateMember", req.body);
    req.session.flash = { type: "error", message: getMobileValidationMessage("mobile number") };
    return res.redirect("/admin/dashboard");
  }

  const password_hash = await bcrypt.hash(password, 12);
  const member = await createMember({
    ...payload,
    photo,
    password_hash,
    membership_status,
    member_id: null,
    approval_date: null,
    approved_by_admin: false
  });

  try {
    if (membership_status === "approved") {
      await approveMember(member);
    } else if (membership_status === "rejected") {
      await rejectMember(member);
    }
  } catch (error) {
    removeUploadedMemberPhoto(photo);
    throw error;
  }

  req.session.flash = { type: "success", message: "Member created successfully." };
  return res.redirect(getAdminMemberRedirectPath(member.membership_status));
}

async function renderEditMember(req, res) {
  const member = await findMemberById(req.params.id);

  if (!member) {
    req.session.flash = { type: "error", message: "Member not found." };
    return res.redirect("/admin/dashboard");
  }

  return res.render("admin/member-edit", {
    page: buildPage(`/admin/members/${req.params.id}/edit`, "Edit Member"),
    member,
    memberRoles: MEMBER_ROLES,
    formData: res.locals.formState.adminEditMember || {}
  });
}

async function handleUpdateMember(req, res) {
  const member = await findMemberById(req.params.id);

  if (!member) {
    removeUploadedMemberPhoto(getPhotoPath(req.file));
    req.session.flash = { type: "error", message: "Member not found." };
    return res.redirect("/admin/dashboard");
  }

  if (req.photoUploadError) {
    setFormState(req, "adminEditMember", req.body);
    req.session.flash = { type: "error", message: req.photoUploadError };
    return res.redirect(`/admin/members/${req.params.id}/edit`);
  }

  const previousPhoto = member.photo;

  const nextMember = {
    ...member,
    ...buildAdminMemberPayload(req.body, member),
    photo: req.file ? getPhotoPath(req.file) : member.photo
  };

  if (!isValidEmail(nextMember.email)) {
    removeUploadedMemberPhoto(getPhotoPath(req.file));
    setFormState(req, "adminEditMember", req.body);
    req.session.flash = { type: "error", message: getEmailValidationMessage("email address") };
    return res.redirect(`/admin/members/${req.params.id}/edit`);
  }

  if (nextMember.phone && !isValidIndianMobileNumber(nextMember.phone, { allowEmpty: true })) {
    removeUploadedMemberPhoto(getPhotoPath(req.file));
    setFormState(req, "adminEditMember", req.body);
    req.session.flash = { type: "error", message: getMobileValidationMessage("mobile number") };
    return res.redirect(`/admin/members/${req.params.id}/edit`);
  }

  if (req.body.password) {
    nextMember.password_hash = await bcrypt.hash(req.body.password, 12);
  }

  const nextStatus = req.body.membership_status || nextMember.membership_status;
  let updatedMember = null;

  try {
    if (nextStatus === "approved") {
      updatedMember = await approveMember({
        ...nextMember,
        membership_status: nextStatus
      });
    } else if (nextStatus === "rejected") {
      updatedMember = await rejectMember({
        ...nextMember,
        membership_status: nextStatus
      });
    } else {
      updatedMember = await updateMemberById(member.id, {
        ...nextMember,
        membership_status: "pending",
        member_id: null,
        approval_date: null,
        approved_by_admin: false
      });
    }
  } catch (error) {
    if (req.file) {
      removeUploadedMemberPhoto(nextMember.photo);
    }

    throw error;
  }

  if (req.file && previousPhoto && previousPhoto !== updatedMember.photo) {
    removeUploadedMemberPhoto(previousPhoto);
  }

  req.session.flash = { type: "success", message: "Member updated successfully." };
  return res.redirect(getAdminMemberRedirectPath(updatedMember.membership_status));
}

async function handleApproveMember(req, res) {
  const member = await findMemberById(req.params.id);

  if (!member) {
    req.session.flash = { type: "error", message: "Member not found." };
    return res.redirect("/admin/dashboard");
  }

  await approveMember(member);
  req.session.flash = { type: "success", message: "Member approved successfully." };
  return res.redirect("/admin/members/approved");
}

async function handleRejectMember(req, res) {
  const member = await findMemberById(req.params.id);

  if (member) {
    await rejectMember(member);
  }

  req.session.flash = { type: "success", message: "Member request rejected." };
  return res.redirect("/admin/members/pending");
}

async function handleDeleteMember(req, res) {
  const member = await deleteMemberById(req.params.id);

  if (member && member.photo) {
    removeUploadedMemberPhoto(member.photo);
  }

  req.session.flash = { type: "success", message: "Member deleted successfully." };
  return res.redirect("/admin/dashboard");
}

async function handleCreateNotice(req, res) {
  await createNotice({
    title: (req.body.title || "").trim(),
    content: (req.body.content || "").trim(),
    type: req.body.type || "notice",
    event_date: req.body.event_date || null,
    publish_date: req.body.publish_date || new Date(),
    expiry_date: req.body.expiry_date || null,
    is_published: parseCheckbox(req.body, "is_published"),
    sort_order: Number(req.body.sort_order || 0),
    created_by_admin: req.session.admin.email
  });

  req.session.flash = { type: "success", message: "Notice saved successfully." };
  return res.redirect("/admin/dashboard");
}

async function renderEditNotice(req, res) {
  const notice = await findNoticeById(req.params.id);

  if (!notice) {
    req.session.flash = { type: "error", message: "Notice not found." };
    return res.redirect("/admin/dashboard");
  }

  return res.render("admin/notice-edit", {
    page: buildPage("/admin/dashboard", "Edit Notice"),
    notice
  });
}

async function handleUpdateNotice(req, res) {
  await updateNoticeById(req.params.id, {
    title: (req.body.title || "").trim(),
    content: (req.body.content || "").trim(),
    type: req.body.type || "notice",
    event_date: req.body.event_date || null,
    publish_date: req.body.publish_date || new Date(),
    expiry_date: req.body.expiry_date || null,
    is_published: parseCheckbox(req.body, "is_published"),
    sort_order: Number(req.body.sort_order || 0)
  });

  req.session.flash = { type: "success", message: "Notice updated successfully." };
  return res.redirect("/admin/dashboard");
}

async function handleDeleteNotice(req, res) {
  await deleteNoticeById(req.params.id);
  req.session.flash = { type: "success", message: "Notice deleted successfully." };
  return res.redirect("/admin/dashboard");
}

module.exports = {
  renderDashboard,
  renderPendingMembers,
  renderApprovedMembers,
  renderMemberDetail,
  handleCreateMember,
  renderEditMember,
  handleUpdateMember,
  handleApproveMember,
  handleRejectMember,
  handleDeleteMember,
  handleCreateNotice,
  renderEditNotice,
  handleUpdateNotice,
  handleDeleteNotice
};
