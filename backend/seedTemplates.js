const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Template = require("./models/Template");

dotenv.config();

const templates = [
  {
    name: "Simple Professional",
    description: "Clean, classic and ATS-friendly.",
    color: "#263d68",
    tag: "ATS FRIENDLY",
    baseTemplate: "simple",
  },
  {
    name: "Modern",
    description: "Contemporary style with teal accents.",
    color: "#247e79",
    tag: "POPULAR",
    baseTemplate: "modern",
  },
  {
    name: "Creative",
    description: "Distinctive styling with warm accents.",
    color: "#bd654a",
    tag: "CREATIVE",
    baseTemplate: "creative",
  },
  {
    name: "Compact",
    description: "Space-saving layout for concise resumes.",
    color: "#6d55cf",
    tag: "COMPACT",
    baseTemplate: "compact",
  },
  {
    name: "First Job",
    description: "Highlights education and projects for freshers.",
    color: "#2871ad",
    tag: "FRESHERS",
    baseTemplate: "firstjob",
  },
  {
    name: "Elegant",
    description:
      "Refined typography with centered details and warm gold accents.",
    color: "#9a783d",
    tag: "ELEGANT",
    baseTemplate: "elegant",
  },
  {
    name: "Executive",
    description:
      "Bold navy header and structured professional sections.",
    color: "#203653",
    tag: "PROFESSIONAL",
    baseTemplate: "executive",
  },
  {
    name: "Minimal",
    description:
      "Airy monochrome layout with clean understated details.",
    color: "#59636e",
    tag: "MINIMAL",
    baseTemplate: "minimal",
  },
];

async function seedTemplates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully.");

    for (const template of templates) {
      await Template.findOneAndUpdate(
        {
          baseTemplate: template.baseTemplate,
        },
        {
          ...template,
          createdBy: "system",
          isDefault: true,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log(`Seeded: ${template.name}`);
    }

    console.log("All default templates seeded successfully.");

    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  } catch (error) {
    console.error("Template seed failed:", error.message);
    process.exit(1);
  }
}

seedTemplates();