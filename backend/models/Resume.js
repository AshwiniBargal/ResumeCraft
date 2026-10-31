
const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "My Resume",
      trim: true,
    },

    template: {
      type: String,
      enum: [
        "simple",
        "modern",
        "creative",
        "compact",
        "firstjob",
        "elegant",
        "executive",
        "minimal",
      ],
      default: "modern",
    },

    personal: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      jobTitle: { type: String, default: "" },
      summary: { type: String, default: "" },
    },

    education: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    projects: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    technicalSkills: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    softSkills: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    experience: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    certifications: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },

    languages: {
      type: [String],
      default: [],
    },

    hiddenSections: {
      type: [String],
      default: [],
    },

    customSections: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    // Used to save the user's custom section order.
    sectionOrder: {
      type: [String],
      default: [
        "summary",
        "experience",
        "education",
        "projects",
        "technical-skills",
        "soft-skills",
        "certifications",
        "languages",
      ],
    },

    // Used by the PDF layout controls.
    pdfSettings: {
      fontSize: {
        type: Number,
        default: 10,
        min: 7,
        max: 16,
      },
      margin: {
        type: Number,
        default: 28,
        min: 0,
        max: 80,
      },
      lineHeight: {
        type: Number,
        default: 1.45,
        min: 1,
        max: 2.5,
      },
      pageSize: {
        type: String,
        enum: ["A4", "Letter"],
        default: "A4",
      },
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

module.exports =
  mongoose.models.Resume ||
  mongoose.model("Resume", resumeSchema);
