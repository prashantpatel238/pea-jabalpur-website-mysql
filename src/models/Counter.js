const { Schema, model } = require("mongoose");

const counterSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    value: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    collection: "counters"
  }
);

module.exports = model("Counter", counterSchema);
