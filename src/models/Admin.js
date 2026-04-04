const { Schema, model } = require("mongoose");
const { isValidEmail } = require("../utils/validation");

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      validate: {
        validator(value) {
          return isValidEmail(value);
        },
        message: "Please provide a valid email address."
      }
    },
    password_hash: {
      type: String,
      required: true
    },
    display_name: {
      type: String,
      trim: true,
      default: "Administrator"
    },
    is_active: {
      type: Boolean,
      default: true
    },
    last_login_at: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: "admins"
  }
);

module.exports = model("Admin", adminSchema);
