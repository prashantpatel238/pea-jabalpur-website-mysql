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
const { calculateAge, normalizePublicMemberInput } = require("../utils/memberData");
const { buildMemberCelebrationNotices } = require("../utils/noticeFeed");
const { getPhotoPath, removeUploadedMemberPhoto } = require("../middleware/memberPhotoUpload");

function getBaseViewData(page) {
  return {
    site,
    page
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
    show_in_leadership_section: true
  })
    .select("full_name role leadership_title profession city email phone photo show_city_in_directory show_profession_in_directory show_email_in_directory show_mobile_in_directory show_photo_in_directory")
    .sort({ important_member_order: 1, full_name: 1 })
    .lean();

  res.render("public/leadership", {
    ...getBaseViewData({ title: `Leadership - ${site.title}`, path: "/leadership" }),
    members: members.map(buildImportantMember)
  });
}

async function renderDirectory(req, res) {
  const search = (req.query.search || "").trim();
  const city = (req.query.city || "").trim();
  const profession = (req.query.profession || "").trim();

  const filters = {
    membership_status: "approved",
    show_in_directory: true
  };

  if (search) {
    filters.full_name = { $regex: search, $options: "i" };
  }

  if (city) {
    filters.city = { $regex: `^${city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" };
  }

  if (profession) {
    filters.profession = { $regex: `^${profession.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" };
  }

  const members = await Member.find(filters)
    .select("full_name role city profession email phone photo member_id join_date show_city_in_directory show_profession_in_directory show_email_in_directory show_mobile_in_directory show_photo_in_directory")
    .sort({ role: 1, full_name: 1 })
    .lean();

  const [cities, professions] = await Promise.all([
    Member.distinct("city", {
      membership_status: "approved",
      show_in_directory: true,
      show_city_in_directory: true,
      city: { $nin: ["", null] }
    }),
    Member.distinct("profession", {
      membership_status: "approved",
      show_in_directory: true,
      show_profession_in_directory: true,
      profession: { $nin: ["", null] }
    })
  ]);

  res.render("public/directory", {
    ...getBaseViewData({ title: `Member Directory - ${site.title}`, path: "/member-directory" }),
    members: members.map(buildDirectoryMember),
    filters: {
      search,
      city,
      profession
    },
    filterOptions: {
      cities: cities.sort((a, b) => a.localeCompare(b)),
      professions: professions.sort((a, b) => a.localeCompare(b))
    }
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
  const input = normalizePublicMemberInput(req.body);
  const password = req.body.password || "";
  const confirmPassword = req.body.confirm_password || "";
  const photo = getPhotoPath(req.file);

  if (req.photoUploadError) {
    return res.status(400).render("public/register", {
      ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
      errorMessage: req.photoUploadError
    });
  }

  if (!input.full_name || !input.email || !input.phone || !password) {
    removeUploadedMemberPhoto(photo);
    return res.status(400).render("public/register", {
      ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
      errorMessage: "Full name, email, phone, and password are required."
    });
  }

  if (password !== confirmPassword) {
    removeUploadedMemberPhoto(photo);
    return res.status(400).render("public/register", {
      ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
      errorMessage: "Password and confirm password must match."
    });
  }

  const existingMember = await Member.findOne({ email: input.email }).lean();

  if (existingMember) {
    removeUploadedMemberPhoto(photo);
    return res.status(409).render("public/register", {
      ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
      errorMessage: "A member with this email already exists."
    });
  }

  const password_hash = await bcrypt.hash(password, 12);

  await Member.create({
    ...input,
    photo,
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
