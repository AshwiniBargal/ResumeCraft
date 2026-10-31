const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    tag: {
      type: String,
      default: "NEW",
      trim: true,
    },

    color: {
      type: String,
      default: "#6755f5",
    },

    // Existing ResumeCraft layout used by ResumePreview
    baseTemplate: {
      type: String,
      default: "modern",
    },

    preview: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    createdBy: {
      type: String,
      default: "admin",
    },

    // true = one of the original ResumeCraft templates
    // false = added later from Admin Dashboard
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Template ||
  mongoose.model("Template", templateSchema);