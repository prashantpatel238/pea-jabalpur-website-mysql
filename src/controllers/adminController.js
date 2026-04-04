const bcrypt = require("bcryptjs");

const { Member, MEMBER_ROLES } = require("../models/Member");
const Notice = require("../models/Notice");
const { buildPage } = require("../utils/page");
const { buildAdminMemberPayload, parseCheckbox } = require("../utils/memberData");
const { approveMember, rejectMember } = require("../services/memberApprovalService");
const { getPhotoPath, removeUploadedMemberPhoto } = require("../middleware/memberPhotoUpload");

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
    Member.find({ membership_status: "pending" }).sort({ createdAt: -1 }).lean(),
    Member.find().sort({ createdAt: -1 }).lean(),
    Notice.find().sort({ createdAt: -1 }).lean(),
    Member.countDocuments(),
    Member.countDocuments({ membership_status: "pending" }),
    Member.countDocuments({ membership_status: "approved" }),
    Member.countDocuments({ membership_status: "approved", role: { $ne: "General Member" } })
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
    }
  });
}

async function renderPendingMembers(req, res) {
  const members = await Member.find({ membership_status: "pending" })
    .sort({ createdAt: -1 })
    .lean();

  res.render("admin/member-list", {
    page: buildPage("/admin/members/pending", "Pending Members"),
    heading: "Pending Members",
    description: "Review submitted registrations and decide whether to approve or reject them.",
    members,
    memberStatus: "pending"
  });
}

async function renderApprovedMembers(req, res) {
  const members = await Member.find({ membership_status: "approved" })
    .sort({ approval_date: -1, full_name: 1 })
    .lean();

  res.render("admin/member-list", {
    page: buildPage("/admin/members/approved", "Approved Members"),
    heading: "Approved Members",
    description: "Browse approved members and open individual records for updates.",
    members,
    memberStatus: "approved"
  });
}

async function renderMemberDetail(req, res) {
  const member = await Member.findById(req.params.id).lean();

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
    req.session.flash = { type: "error", message: req.photoUploadError };
    return res.redirect("/admin/dashboard");
  }

  if (!payload.full_name || !payload.email || !password) {
    removeUploadedMemberPhoto(photo);
    req.session.flash = { type: "error", message: "Full name, email, and password are required." };
    return res.redirect("/admin/dashboard");
  }

  const password_hash = await bcrypt.hash(password, 12);
  const member = new Member({
    ...payload,
    photo,
    password_hash,
    membership_status,
    member_id: null,
    approval_date: null,
    approved_by_admin: false
  });

  if (membership_status === "approved") {
    await approveMember(member);
  } else if (membership_status === "rejected") {
    await rejectMember(member);
  } else {
    await member.save();
  }

  req.session.flash = { type: "success", message: "Member created successfully." };
  return res.redirect(getAdminMemberRedirectPath(member.membership_status));
}

async function renderEditMember(req, res) {
  const member = await Member.findById(req.params.id).lean();

  if (!member) {
    req.session.flash = { type: "error", message: "Member not found." };
    return res.redirect("/admin/dashboard");
  }

  return res.render("admin/member-edit", {
    page: buildPage(`/admin/members/${req.params.id}/edit`, "Edit Member"),
    member,
    memberRoles: MEMBER_ROLES
  });
}

async function handleUpdateMember(req, res) {
  const member = await Member.findById(req.params.id);

  if (!member) {
    removeUploadedMemberPhoto(getPhotoPath(req.file));
    req.session.flash = { type: "error", message: "Member not found." };
    return res.redirect("/admin/dashboard");
  }

  if (req.photoUploadError) {
    req.session.flash = { type: "error", message: req.photoUploadError };
    return res.redirect(`/admin/members/${req.params.id}/edit`);
  }

  const previousPhoto = member.photo;

  Object.assign(member, buildAdminMemberPayload(req.body, member));
  member.photo = req.file ? getPhotoPath(req.file) : member.photo;

  if (req.body.password) {
    member.password_hash = await bcrypt.hash(req.body.password, 12);
  }

  const nextStatus = req.body.membership_status || member.membership_status;

  if (nextStatus === "approved") {
    await approveMember(member);
  } else if (nextStatus === "rejected") {
    await rejectMember(member);
  } else {
    member.membership_status = "pending";
    member.member_id = null;
    member.approval_date = null;
    member.approved_by_admin = false;
    await member.save();
  }

  if (req.file && previousPhoto && previousPhoto !== member.photo) {
    removeUploadedMemberPhoto(previousPhoto);
  }

  req.session.flash = { type: "success", message: "Member updated successfully." };
  return res.redirect(getAdminMemberRedirectPath(member.membership_status));
}

async function handleApproveMember(req, res) {
  const member = await Member.findById(req.params.id);

  if (!member) {
    req.session.flash = { type: "error", message: "Member not found." };
    return res.redirect("/admin/dashboard");
  }

  await approveMember(member);
  req.session.flash = { type: "success", message: "Member approved successfully." };
  return res.redirect("/admin/members/approved");
}

async function handleRejectMember(req, res) {
  const member = await Member.findById(req.params.id);

  if (member) {
    await rejectMember(member);
  }

  req.session.flash = { type: "success", message: "Member request rejected." };
  return res.redirect("/admin/members/pending");
}

async function handleDeleteMember(req, res) {
  const member = await Member.findByIdAndDelete(req.params.id);

  if (member && member.photo) {
    removeUploadedMemberPhoto(member.photo);
  }

  req.session.flash = { type: "success", message: "Member deleted successfully." };
  return res.redirect("/admin/dashboard");
}

async function handleCreateNotice(req, res) {
  await Notice.create({
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
  const notice = await Notice.findById(req.params.id).lean();

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
  await Notice.findByIdAndUpdate(req.params.id, {
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
  await Notice.findByIdAndDelete(req.params.id);
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
