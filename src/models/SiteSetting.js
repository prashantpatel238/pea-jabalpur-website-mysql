const { Schema, model } = require("mongoose");
const { isValidEmail, isValidIndianMobileNumber } = require("../utils/validation");

const siteSettingSchema = new Schema(
  {
    _singleton: {
      type: String,
      default: "default",
      unique: true,
      select: false
    },
    site_title: {
      type: String,
      trim: true,
      default: ""
    },
    site_tagline: {
      type: String,
      trim: true,
      default: ""
    },
    logo_path: {
      type: String,
      trim: true,
      default: ""
    },
    favicon_path: {
      type: String,
      trim: true,
      default: ""
    },
    contact_phone: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator(value) {
          return isValidIndianMobileNumber(value, { allowEmpty: true });
        },
        message: "Please provide a valid contact mobile number."
      }
    },
    whatsapp_number: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator(value) {
          return isValidIndianMobileNumber(value, { allowEmpty: true });
        },
        message: "Please provide a valid WhatsApp mobile number."
      }
    },
    contact_email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      validate: {
        validator(value) {
          return isValidEmail(value, { allowEmpty: true });
        },
        message: "Please provide a valid contact email address."
      }
    },
    address: {
      type: String,
      trim: true,
      default: ""
    },
    google_map_embed_url: {
      type: String,
      trim: true,
      default: ""
    },
    facebook_url: {
      type: String,
      trim: true,
      default: ""
    },
    instagram_url: {
      type: String,
      trim: true,
      default: ""
    },
    youtube_url: {
      type: String,
      trim: true,
      default: ""
    },
    footer_text: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true,
    collection: "site_settings"
  }
);

module.exports = model("SiteSetting", siteSettingSchema);
