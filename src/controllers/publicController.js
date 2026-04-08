const bcrypt = require("bcryptjs");

const site = require("../config/site");
const { BLOOD_GROUP_OPTIONS, DIRECTORY_SORT_OPTIONS } = require("../constants/memberFields");
const {
  homeStats,
  homeFeatures,
  aboutValues,
  resourcePages
} = require("../config/publicContent");
const {
  createPendingMemberRegistration,
  listCelebrationMembers,
  findMemberIdByEmail
} = require("../repositories/memberRepository");
const {
  getPublicDirectoryFilterOptions,
  getPublicDirectoryMembers
} = require("../repositories/publicMemberRepository");
const { listPublishedNotices } = require("../repositories/noticeRepository");
const { buildDirectoryMember, buildImportantMember } = require("../utils/memberView");
const {
  calculateAge,
  isValidChildrenCount,
  normalizePublicMemberInput
} = require("../utils/memberData");
const { buildMemberCelebrationNotices } = require("../utils/noticeFeed");
const { getPhotoPath, removeUploadedMemberPhoto } = require("../middleware/memberPhotoUpload");
const { getLeadershipMembers } = require("../services/leadershipService");
const { sanitizeFormState } = require("../utils/formState");
const {
  getEmailValidationMessage,
  getMobileValidationMessage,
  isValidEmail,
  isValidIndianMobileNumber
} = require("../utils/validation");

function getBaseViewData(page) {
  return {
    page
  };
}

function getNoticeCategory(type) {
  if (type === "event") {
    return "events";
  }

  if (type === "birthday" || type === "anniversary") {
    return "special-days";
  }

  return "notices";
}

function getNoticeTypeLabel(type) {
  if (type === "birthday") {
    return "Birthday";
  }

  if (type === "anniversary") {
    return "Anniversary";
  }

  if (type === "event") {
    return "Event";
  }

  return "Notice";
}

async function renderHome(req, res) {
  const leaders = await getLeadershipMembers({ limit: 6 });

  res.render("public/home", {
    ...getBaseViewData({
      title: `${site.title} - Connecting Engineering Excellence`,
      path: "/",
      description: "Professional Engineers Association Jabalpur connects engineers through membership, leadership, events, notices, and community collaboration in Jabalpur.",
      canonical: "/"
    }),
    stats: homeStats,
    features: homeFeatures,
    leaders: leaders.map(buildImportantMember)
  });
}

function renderAbout(req, res) {
  res.render("public/about", {
    ...getBaseViewData({
      title: `About Us - ${site.title}`,
      path: "/about",
      description: "Learn about the Professional Engineers Association Jabalpur, our mission, values, and community impact for engineers in Jabalpur.",
      canonical: "/about"
    }),
    values: aboutValues
  });
}

function renderContact(req, res) {
  res.render("public/contact", {
    ...getBaseViewData({
      title: `Contact Us - ${site.title}`,
      path: "/contact",
      description: "Contact Professional Engineers Association Jabalpur for membership, events, notices, and association information.",
      canonical: "/contact"
    })
  });
}

async function renderLeadership(req, res) {
  const members = await getLeadershipMembers();

  res.render("public/leadership", {
    ...getBaseViewData({
      title: `Leadership - ${site.title}`,
      path: "/leadership",
      description: "Meet the approved leadership members of the Professional Engineers Association Jabalpur.",
      canonical: "/leadership"
    }),
    members: members.map(buildImportantMember)
  });
}

async function renderDirectory(req, res) {
  const search = (req.query.search || "").trim();
  const city = (req.query.city || "").trim();
  const profession = (req.query.profession || "").trim();
  const requestedSort = (req.query.sort || "").trim();
  const sort = Object.hasOwn(DIRECTORY_SORT_OPTIONS, requestedSort) ? requestedSort : "name_asc";

  const [members, filterOptions] = await Promise.all([
    getPublicDirectoryMembers({ search, city, profession, sort }),
    getPublicDirectoryFilterOptions()
  ]);

  res.render("public/directory", {
    ...getBaseViewData({
      title: `Member Directory - ${site.title}`,
      path: "/member-directory",
      description: "Browse the public member directory of approved Professional Engineers Association Jabalpur members.",
      canonical: "/member-directory"
    }),
    members: members.map(buildDirectoryMember),
    filters: {
      search,
      city,
      profession,
      sort
    },
    filterOptions: {
      cities: filterOptions.cities,
      professions: filterOptions.professions
    },
    sortOptions: [
      { value: "name_asc", label: "Name (A-Z)" },
      { value: "name_desc", label: "Name (Z-A)" }
    ]
  });
}

function renderRegistration(req, res) {
  res.render("public/register", {
    ...getBaseViewData({
      title: `Join Now - ${site.title}`,
      path: "/register",
      description: "Apply for membership in the Professional Engineers Association Jabalpur through the online registration form.",
      canonical: "/register"
    }),
    formData: res.locals.formState.register || {},
    bloodGroupOptions: BLOOD_GROUP_OPTIONS
  });
}

async function renderNotices(req, res) {
  const requestedCategory = (req.query.category || "").trim();
  const activeCategory = ["special-days", "events", "notices"].includes(requestedCategory)
    ? requestedCategory
    : "special-days";

  const [notices, celebrants] = await Promise.all([
    listPublishedNotices(),
    listCelebrationMembers()
  ]);

  const feed = [
    ...notices.map((notice) => ({
      id: String(notice.id),
      title: notice.title,
      content: notice.content,
      type: notice.type,
      type_label: getNoticeTypeLabel(notice.type),
      category: getNoticeCategory(notice.type),
      event_date: notice.event_date || notice.publish_date,
      publish_date: notice.publish_date || null,
      expiry_date: notice.expiry_date || null,
      sort_order: notice.sort_order || 0
    })),
    ...buildMemberCelebrationNotices(celebrants).map((notice) => ({
      ...notice,
      type_label: getNoticeTypeLabel(notice.type),
      category: getNoticeCategory(notice.type),
      publish_date: null,
      expiry_date: null
    }))
  ].sort((a, b) => new Date(a.event_date) - new Date(b.event_date) || a.sort_order - b.sort_order);

  const filteredNotices = feed
    .filter((notice) => notice.category === activeCategory)
    .sort((a, b) => {
      if (activeCategory === "notices") {
        return new Date(b.event_date) - new Date(a.event_date) || a.sort_order - b.sort_order;
      }

      return new Date(a.event_date) - new Date(b.event_date) || a.sort_order - b.sort_order;
    });
  const categoryCounts = feed.reduce((counts, notice) => {
    counts[notice.category] += 1;
    return counts;
  }, {
    "special-days": 0,
    events: 0,
    notices: 0
  });

  res.render("public/notices", {
    ...getBaseViewData({
      title: `Notice Board - ${site.title}`,
      path: "/notices",
      description: "Read the latest and previous notices, events, birthdays, and anniversaries from Professional Engineers Association Jabalpur.",
      canonical: "/notices"
    }),
    notices: filteredNotices,
    activeCategory,
    noticeCategories: [
      { value: "special-days", label: "Special Days", count: categoryCounts["special-days"] },
      { value: "events", label: "Events", count: categoryCounts.events },
      { value: "notices", label: "Notices", count: categoryCounts.notices }
    ]
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
      errorMessage: req.photoUploadError,
      formData: sanitizeFormState(req.body),
      bloodGroupOptions: BLOOD_GROUP_OPTIONS
    });
  }

  if (!input.full_name || !input.email || !input.phone || !password) {
    removeUploadedMemberPhoto(photo);
    return res.status(400).render("public/register", {
      ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
      errorMessage: "Full name, email, phone, and password are required.",
      formData: sanitizeFormState(req.body),
      bloodGroupOptions: BLOOD_GROUP_OPTIONS
    });
  }

  if (password !== confirmPassword) {
    removeUploadedMemberPhoto(photo);
    return res.status(400).render("public/register", {
      ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
      errorMessage: "Password and confirm password must match.",
      formData: sanitizeFormState(req.body),
      bloodGroupOptions: BLOOD_GROUP_OPTIONS
    });
  }

  if (!isValidEmail(input.email)) {
    removeUploadedMemberPhoto(photo);
    return res.status(400).render("public/register", {
      ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
      errorMessage: getEmailValidationMessage("email address"),
      formData: sanitizeFormState(req.body),
      bloodGroupOptions: BLOOD_GROUP_OPTIONS
    });
  }

  if (!isValidIndianMobileNumber(input.phone)) {
    removeUploadedMemberPhoto(photo);
    return res.status(400).render("public/register", {
      ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
      errorMessage: getMobileValidationMessage("mobile number"),
      formData: sanitizeFormState(req.body),
      bloodGroupOptions: BLOOD_GROUP_OPTIONS
    });
  }

  if (!isValidChildrenCount(req.body.children_count)) {
    removeUploadedMemberPhoto(photo);
    return res.status(400).render("public/register", {
      ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
      errorMessage: "Children count must be a non-negative whole number.",
      formData: sanitizeFormState(req.body),
      bloodGroupOptions: BLOOD_GROUP_OPTIONS
    });
  }

  const existingMemberId = await findMemberIdByEmail(input.email);

  if (existingMemberId) {
    removeUploadedMemberPhoto(photo);
    return res.status(409).render("public/register", {
      ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
      errorMessage: "A member with this email already exists.",
      formData: sanitizeFormState(req.body),
      bloodGroupOptions: BLOOD_GROUP_OPTIONS
    });
  }

  const password_hash = await bcrypt.hash(password, 12);

  try {
    await createPendingMemberRegistration({
      ...input,
      photo,
      password_hash,
      age: calculateAge(input.dob),
      membership_status: "pending",
      registration_source: "public_form",
      show_in_directory: false
    });
  } catch (error) {
    removeUploadedMemberPhoto(photo);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).render("public/register", {
        ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
        errorMessage: "A member with this email already exists.",
        formData: sanitizeFormState(req.body),
        bloodGroupOptions: BLOOD_GROUP_OPTIONS
      });
    }

    throw error;
  }

  return res.status(201).render("public/register", {
    ...getBaseViewData({ title: `Join Now - ${site.title}`, path: "/register" }),
    formSubmitted: true,
    formData: {},
    bloodGroupOptions: BLOOD_GROUP_OPTIONS
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
