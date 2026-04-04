const { Schema, model } = require("mongoose");

const MEMBER_ROLES = [
  "President",
  "Vice President",
  "Secretary",
  "Joint Secretary",
  "Treasurer",
  "Media Prabhari",
  "Core Committee Member",
  "General Member"
];

const memberSchema = new Schema(
  {
    // Identity / public profile fields
    full_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },
    photo: {
      type: String,
      trim: true,
      default: ""
    },
    member_id: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
      unique: true,
      sparse: true,
      index: true
    },
    profession: {
      type: String,
      trim: true,
      default: ""
    },
    role: {
      type: String,
      enum: MEMBER_ROLES,
      default: "General Member",
      index: true
    },
    city: {
      type: String,
      trim: true,
      default: ""
    },
    join_date: {
      type: Date,
      default: Date.now
    },
    age: {
      type: Number,
      min: 0,
      max: 130,
      default: null
    },
    leadership_title: {
      type: String,
      trim: true,
      default: ""
    },

    // Private / admin-only fields
    dob: {
      type: Date,
      default: null
    },
    gender: {
      type: String,
      trim: true,
      enum: ["male", "female", "other", "prefer_not_to_say", ""],
      default: ""
    },
    marital_status: {
      type: String,
      trim: true,
      enum: ["single", "married", "divorced", "widowed", "prefer_not_to_say", ""],
      default: ""
    },
    marriage_date: {
      type: Date,
      default: null
    },
    spouse_name: {
      type: String,
      trim: true,
      default: ""
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      index: true
    },
    password_hash: {
      type: String,
      required: true
    },
    address: {
      type: String,
      trim: true,
      default: ""
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    },
    admin_notes: {
      type: String,
      trim: true,
      default: ""
    },

    // Workflow / moderation / visibility metadata
    membership_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },
    approval_date: {
      type: Date,
      default: null
    },
    approved_by_admin: {
      type: Boolean,
      default: false
    },
    show_in_directory: {
      type: Boolean,
      default: false
    },
    show_mobile_in_directory: {
      type: Boolean,
      default: false
    },
    show_email_in_directory: {
      type: Boolean,
      default: false
    },
    show_city_in_directory: {
      type: Boolean,
      default: true
    },
    show_profession_in_directory: {
      type: Boolean,
      default: true
    },
    show_photo_in_directory: {
      type: Boolean,
      default: true
    },
    show_in_leadership_section: {
      type: Boolean,
      default: false
    },
    is_important_member: {
      type: Boolean,
      default: false
    },
    important_member_order: {
      type: Number,
      min: 0,
      default: 0
    },
    registration_source: {
      type: String,
      trim: true,
      default: "public_form"
    },
    last_login_at: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: "members"
  }
);

// Member IDs are only assigned after approval, so approved members must have
// one and pending/rejected members must keep it empty.
memberSchema.path("member_id").validate(function validateMemberId(value) {
  if (this.membership_status === "approved") {
    return Boolean(value);
  }

  return value === null || value === "";
}, "Approved members must have a member_id, and non-approved members must not have one.");

// Approval metadata should only exist after approval.
memberSchema.path("approval_date").validate(function validateApprovalDate(value) {
  if (this.membership_status === "approved") {
    return value instanceof Date;
  }

  return value === null;
}, "approval_date must only be set for approved members.");

memberSchema.path("approved_by_admin").validate(function validateApprovedByAdmin(value) {
  if (this.membership_status === "approved") {
    return value === true;
  }

  return value === false;
}, "approved_by_admin must only be true for approved members.");

memberSchema.index({ membership_status: 1, show_in_directory: 1, full_name: 1 });
memberSchema.index({ membership_status: 1, show_in_leadership_section: 1, important_member_order: 1 });
memberSchema.index({ role: 1, membership_status: 1, important_member_order: 1 });

module.exports = {
  Member: model("Member", memberSchema),
  MEMBER_ROLES
};
