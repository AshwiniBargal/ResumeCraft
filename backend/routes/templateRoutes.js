const express = require("express");
const Template = require("../models/Template");

const router = express.Router();

/*
  GET ALL TEMPLATES
  -----------------
  Returns both:
  - Default templates
  - Admin-added templates
*/
router.get("/", async (req, res) => {
  try {
    const templates = await Template.find().sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.json(templates);
  } catch (error) {
    console.error("Fetch templates error:", error.message);

    res.status(500).json({
      message: "Could not fetch templates.",
      error: error.message,
    });
  }
});

/*
  ADD NEW TEMPLATE
  ----------------
  Admin creates a new template.
*/
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      tag,
      color,
      baseTemplate,
      preview,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Template name is required.",
      });
    }

    const template = await Template.create({
      name: name.trim(),
      description: description || "",
      tag: tag || "ADMIN TEMPLATE",
      color: color || "#6755f5",
      baseTemplate: baseTemplate || "modern",
      preview: preview || {},
      createdBy: "admin",
      isDefault: false,
    });

    res.status(201).json({
      message: "Template added successfully!",
      template,
    });
  } catch (error) {
    console.error("Create template error:", error.message);

    res.status(400).json({
      message: "Could not create template.",
      error: error.message,
    });
  }
});

/*
  DELETE TEMPLATE
  ---------------
  Admin can delete:
  - Default template
  - Admin-added template
*/
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({
        message: "Template not found.",
      });
    }

    await Template.findByIdAndDelete(id);

    res.json({
      message: `"${template.name}" deleted successfully!`,
      deletedTemplate: template,
    });
  } catch (error) {
    console.error("Delete template error:", error.message);

    res.status(500).json({
      message: "Could not delete template.",
      error: error.message,
    });
  }
});

module.exports = router;