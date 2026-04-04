const { Schema, model } = require("mongoose");

const noticeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    content: {
      type: String,
      trim: true,
      default: ""
    },
    type: {
      type: String,
      enum: ["notice", "event"],
      default: "notice",
      index: true
    },
    event_date: {
      type: Date,
      default: null,
      index: true
    },
    publish_date: {
      type: Date,
      default: Date.now,
      index: true
    },
    expiry_date: {
      type: Date,
      default: null,
      index: true
    },
    is_published: {
      type: Boolean,
      default: true,
      index: true
    },
    sort_order: {
      type: Number,
      default: 0
    },
    created_by_admin: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true,
    collection: "notices"
  }
);

noticeSchema.index({ is_published: 1, publish_date: -1, sort_order: 1 });

module.exports = model("Notice", noticeSchema);
