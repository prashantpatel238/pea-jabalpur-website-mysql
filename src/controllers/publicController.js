const bcrypt = require("bcryptjs");

const site = require("../config/site");
const {
  homeStats,
  homeFeatures,
  aboutValues,
  resourcePages
} = require("../config/publicContent");
const { Member } = require("../models/Member");
const Notice = require("../models/Notice");
const { buildDirectoryMember, buildImportantMember } = require("../utils/memberView");
const { buildMemberCelebrationNotices } = require("../utils/noticeFeed");

function getBaseViewData(page) {
  return {
    site,
    page
  };
}

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

function normalizeMemberInput(body) {
  return {
    full_name: body.full_name || body.name || "",
    email: (body.email || "").trim().toLowerCase(),
    phone: (body.phone || "").trim(),
    profession: (body.profession || "").trim(),
    role: body.role || "General Member",
    city: (body.city || "").trim(),
    address: (body.address || "").trim(),
    dob: body.dob || body.date_of_birth || null,
    gender: (body.gender || "").toLowerCase(),
    marital_status: (body.marital_status || "").toLowerCase(),
    spouse_name: (body.spouse_name || "").trim(),
    marriage_date: body.marriage_date || null
  };
}

async function renderHome(req, res) {
  const leaders = await Member.find({
    membership_status: "approved",
    role: { $ne: "General Member" }
  })
    .sort({ important_member_order: 1, full_name: 1 })
    .limit(6)
    .lean();

  res.render("public/home", {
    ...getBaseViewData({ title: `${site.title} - Connecting Engineering Excellence`, path: "/" }),
    stats: homeStats,
    features: homeFeatures,
    leaders: leaders.map(buildImportantMember)
  });
}

function renderAbout(req, res) {
  res.render("public/about", {
    ...getBaseViewData({ title: `About Us - ${site.title}`, path: "/about" }),
    values: aboutValues
  });
}

function renderContact(req, res) {
  res.render("public/contact", {
    ...getBaseViewData({ title: `Contact Us - ${site.title}`, path: "/contact" })
  });
}

async function renderLeadership(req, res) {
  const members = await Member.find({
    membership_status: "approved",
    role: { $ne: "General Member" }
  })
    .sort({ important_member_order: 1, role: 1, full_name: 1 })
    .lean();

  res.render("public/leadership", {
    ...getBaseViewData({ title: `Important Members - ${site.title}`, path: "/important-members" }),
    members: members.map(buildImportantMember)
  });
}

async function renderDirectory(req, res) {
  const members = await Member.find({
    membership_status: "approved",
    show_in_directory: true
  })
    .sort({ role: 1, full_name: 1 })
    .lean();

  res.render("public/directory", {
    ...getBaseViewData({ title: `Member Directory - ${site.title}`, path: "/member-directory" }),
    members: members.map(buildDirectoryMember)
  });
}

function renderRegistration(req, res) {
  res.render("public/register", {
    ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" })
  });
}

async function renderNotices(req, res) {
  const notices = await Notice.find({
    is_published: true,
    $or: [{ expiry_date: null }, { expiry_date: { $gte: new Date() } }]
  })
    .sort({ event_date: 1, sort_order: 1, publish_date: -1 })
    .lean();

  const celebrants = await Member.find({
    membership_status: "approved",
    $or: [{ dob: { $ne: null } }, { marriage_date: { $ne: null } }]
  }).lean();

  const feed = [
    ...notices.map((notice) => ({
      id: notice._id.toString(),
      title: notice.title,
      content: notice.content,
      type: notice.type,
      event_date: notice.event_date || notice.publish_date,
      sort_order: notice.sort_order || 0
    })),
    ...buildMemberCelebrationNotices(celebrants)
  ].sort((a, b) => new Date(a.event_date) - new Date(b.event_date) || a.sort_order - b.sort_order);

  res.render("public/notices", {
    ...getBaseViewData({ title: `Notice Board - ${site.title}`, path: "/notices" }),
    notices: feed
  });
}

function renderResource(req, res, key) {
  const resource = resourcePages[key];

  if (!resource) {
    return res.status(404).render("public/not-found", {
      ...getBaseViewData({ title: `Page Not Found - ${site.title}`, path: req.path })
    });
  }

  return res.render("public/resource", {
    ...getBaseViewData({ title: `${resource.title} - ${site.title}`, path: req.path }),
    resource
  });
}

async function handleRegistrationRequest(req, res) {
  const input = normalizeMemberInput(req.body);
  const password = req.body.password || "";
  const confirmPassword = req.body.confirm_password || "";

  if (!input.full_name || !input.email || !input.phone || !password) {
    return res.status(400).render("public/register", {
      ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
      errorMessage: "Full name, email, phone, and password are required."
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).render("public/register", {
      ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
      errorMessage: "Password and confirm password must match."
    });
  }

  const existingMember = await Member.findOne({ email: input.email }).lean();

  if (existingMember) {
    return res.status(409).render("public/register", {
      ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
      errorMessage: "A member with this email already exists."
    });
  }

  const password_hash = await bcrypt.hash(password, 12);

  await Member.create({
    ...input,
    password_hash,
    age: calculateAge(input.dob),
    membership_status: "pending",
    registration_source: "public_form",
    show_in_directory: false
  });

  return res.status(201).render("public/register", {
    ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
    formSubmitted: true
  });
}

function handleContactRequest(req, res) {
  res.status(202).render("public/contact", {
    ...getBaseViewData({ title: `Contact Us - ${site.title}`, path: "/contact" }),
    formSubmitted: true
  });
}

module.exports = {
  renderHome,
  renderAbout,
  renderContact,
  renderLeadership,
  renderDirectory,
  renderRegistration,
  renderNotices,
  renderResource,
  handleRegistrationRequest,
  handleContactRequest,
  calculateAge
};
