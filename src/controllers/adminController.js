const bcrypt = require("bcryptjs");

const site = require("../config/site");
const { Member, MEMBER_ROLES } = require("../models/Member");
const Notice = require("../models/Notice");
const { calculateAge } = require("./publicController");

function getPage(path, title) {
  return { path, title: `${title} - ${site.title}` };
}

function parseCheckbox(body, fieldName) {
  return Boolean(body[fieldName]);
}

function buildMemberPayload(body, existingMember) {
  return {
    full_name: (body.full_name ?? existingMember?.full_name ?? "").trim(),
    email: (body.email ?? existingMember?.email ?? "").trim().toLowerCase(),
    phone: (body.phone ?? existingMember?.phone ?? "").trim(),
    profession: (body.profession ?? existingMember?.profession ?? "").trim(),
    role: body.role || existingMember?.role || "General Member",
    city: (body.city ?? existingMember?.city ?? "").trim(),
    address: (body.address ?? existingMember?.address ?? "").trim(),
    dob: body.dob ?? existingMember?.dob ?? null,
    gender: (body.gender ?? existingMember?.gender ?? "").toLowerCase(),
    marital_status: (body.marital_status ?? existingMember?.marital_status ?? "").toLowerCase(),
    marriage_date: body.marriage_date ?? existingMember?.marriage_date ?? null,
    spouse_name: (body.spouse_name ?? existingMember?.spouse_name ?? "").trim(),
    leadership_title: (body.leadership_title ?? existingMember?.leadership_title ?? "").trim(),
    notes: (body.notes ?? existingMember?.notes ?? "").trim(),
    admin_notes: (body.admin_notes ?? existingMember?.admin_notes ?? "").trim(),
    show_in_directory: parseCheckbox(body, "show_in_directory"),
    show_mobile_in_directory: parseCheckbox(body, "show_mobile_in_directory"),
    show_email_in_directory: parseCheckbox(body, "show_email_in_directory"),
    show_city_in_directory: parseCheckbox(body, "show_city_in_directory"),
    show_profession_in_directory: parseCheckbox(body, "show_profession_in_directory"),
    show_photo_in_directory: parseCheckbox(body, "show_photo_in_directory"),
    show_in_leadership_section: parseCheckbox(body, "show_in_leadership_section"),
    is_important_member: parseCheckbox(body, "is_important_member"),
    important_member_order: Number(body.important_member_order || 0),
    registration_source: (body.registration_source || existingMember?.registration_source || "admin").trim(),
    age: calculateAge(body.dob ?? existingMember?.dob ?? null)
  };
}

async function renderAdminLogin(req, res) {
  if (req.session.admin) {
    return res.redirect("/admin");
  }

  return res.render("admin/login", {
    page: getPage("/admin/login", "Admin Login")
  });
}

async function handleAdminLogin(req, res) {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  if (email !== (process.env.ADMIN_EMAIL || "").trim().toLowerCase() || password !== (process.env.ADMIN_PASSWORD || "")) {
    return res.status(401).render("admin/login", {
      page: getPage("/admin/login", "Admin Login"),
      errorMessage: "Invalid admin credentials."
    });
  }

  req.session.admin = { email };
  req.session.flash = { type: "success", message: "Admin login successful." };
  return res.redirect("/admin");
}

function handleAdminLogout(req, res) {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
}

async function renderDashboard(req, res) {
  const [pendingMembers, members, notices] = await Promise.all([
    Member.find({ membership_status: "pending" }).sort({ createdAt: -1 }).lean(),
    Member.find().sort({ createdAt: -1 }).lean(),
    Notice.find().sort({ createdAt: -1 }).lean()
  ]);

  res.render("admin/dashboard", {
    page: getPage("/admin", "Admin Dashboard"),
    pendingMembers,
    members,
    notices,
    memberRoles: MEMBER_ROLES
  });
}

async function handleCreateMember(req, res) {
  const payload = buildMemberPayload(req.body);
  const password = req.body.password || "";
  const membership_status = req.body.membership_status || "approved";

  if (!payload.full_name || !payload.email || !password) {
    req.session.flash = { type: "error", message: "Full name, email, and password are required." };
    return res.redirect("/admin");
  }

  const password_hash = await bcrypt.hash(password, 12);
  const member = new Member({
    ...payload,
    password_hash,
    membership_status,
    member_id: membership_status === "approved" ? (req.body.member_id || "").trim().toUpperCase() : null,
    approval_date: membership_status === "approved" ? new Date() : null,
    approved_by_admin: membership_status === "approved" ? req.session.admin.email : ""
  });

  await member.save();
  req.session.flash = { type: "success", message: "Member created successfully." };
  return res.redirect("/admin");
}

async function renderEditMember(req, res) {
  const member = await Member.findById(req.params.id).lean();

  if (!member) {
    req.session.flash = { type: "error", message: "Member not found." };
    return res.redirect("/admin");
  }

  return res.render("admin/member-edit", {
    page: getPage("/admin", "Edit Member"),
    member,
    memberRoles: MEMBER_ROLES
  });
}

async function handleUpdateMember(req, res) {
  const member = await Member.findById(req.params.id);

  if (!member) {
    req.session.flash = { type: "error", message: "Member not found." };
    return res.redirect("/admin");
  }

  Object.assign(member, buildMemberPayload(req.body, member));

  if (req.body.password) {
    member.password_hash = await bcrypt.hash(req.body.password, 12);
  }

  member.membership_status = req.body.membership_status || member.membership_status;
  member.member_id = member.membership_status === "approved" ? (req.body.member_id || member.member_id || "").trim().toUpperCase() : null;
  member.approval_date = member.membership_status === "approved" ? (member.approval_date || new Date()) : null;
  member.approved_by_admin = member.membership_status === "approved" ? req.session.admin.email : "";

  await member.save();
  req.session.flash = { type: "success", message: "Member updated successfully." };
  return res.redirect("/admin");
}

async function handleApproveMember(req, res) {
  const member = await Member.findById(req.params.id);

  if (!member) {
    req.session.flash = { type: "error", message: "Member not found." };
    return res.redirect("/admin");
  }

  member.membership_status = "approved";
  member.member_id = (req.body.member_id || "").trim().toUpperCase();
  member.approval_date = new Date();
  member.approved_by_admin = req.session.admin.email;

  if (!member.member_id) {
    req.session.flash = { type: "error", message: "Member ID is required to approve a member." };
    return res.redirect("/admin");
  }

  await member.save();
  req.session.flash = { type: "success", message: "Member approved successfully." };
  return res.redirect("/admin");
}

async function handleRejectMember(req, res) {
  const member = await Member.findById(req.params.id);

  if (member) {
    member.membership_status = "rejected";
    member.member_id = null;
    member.approval_date = null;
    member.approved_by_admin = "";
    await member.save();
  }

  req.session.flash = { type: "success", message: "Member request rejected." };
  return res.redirect("/admin");
}

async function handleDeleteMember(req, res) {
  await Member.findByIdAndDelete(req.params.id);
  req.session.flash = { type: "success", message: "Member deleted successfully." };
  return res.redirect("/admin");
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
  return res.redirect("/admin");
}

async function renderEditNotice(req, res) {
  const notice = await Notice.findById(req.params.id).lean();

  if (!notice) {
    req.session.flash = { type: "error", message: "Notice not found." };
    return res.redirect("/admin");
  }

  return res.render("admin/notice-edit", {
    page: getPage("/admin", "Edit Notice"),
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
  return res.redirect("/admin");
}

async function handleDeleteNotice(req, res) {
  await Notice.findByIdAndDelete(req.params.id);
  req.session.flash = { type: "success", message: "Notice deleted successfully." };
  return res.redirect("/admin");
}

module.exports = {
  renderAdminLogin,
  handleAdminLogin,
  handleAdminLogout,
  renderDashboard,
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
