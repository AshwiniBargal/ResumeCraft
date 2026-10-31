
const express = require("express");
const mongoose = require("mongoose");
const Resume = require("../models/Resume");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All resume routes require authentication.
router.use(authMiddleware);

// GET: Fetch all resumes belonging to the logged-in user.
router.get("/", async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.userId,
    }).sort({ updatedAt: -1 });

    res.json(resumes);
  } catch (error) {
    console.error("Fetch resumes error:", error.message);
    res.status(500).json({
      message: "Could not fetch resumes.",
    });
  }
});

// POST: Create a new resume.
router.post("/", async (req, res) => {
  try {
    const {
      user,
      _id,
      __v,
      createdAt,
      updatedAt,
      ...payload
    } = req.body;

    const resume = await Resume.create({
      ...payload,
      user: req.userId,
    });

    res.status(201).json({
      message: "Resume created successfully!",
      resume,
    });
  } catch (error) {
    console.error("Create resume error:", error.message);

    res.status(400).json({
      message: "Could not create resume.",
      error: error.message,
    });
  }
});

// POST: Duplicate an existing resume.
router.post("/:id/duplicate", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid resume ID.",
      });
    }

    const original = await Resume.findOne({
      _id: id,
      user: req.userId,
    }).lean();

    if (!original) {
      return res.status(404).json({
        message: "Resume not found.",
      });
    }

    delete original._id;
    delete original.__v;
    delete original.createdAt;
    delete original.updatedAt;

    original.user = req.userId;
    original.title = `${original.title || "My Resume"} (Copy)`;

    const resume = await Resume.create(original);

    res.status(201).json({
      message: "Resume duplicated successfully!",
      resume,
    });
  } catch (error) {
    console.error("Duplicate resume error:", error.message);

    res.status(400).json({
      message: "Could not duplicate resume.",
      error: error.message,
    });
  }
});

// PUT: Update or rename a resume.
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid resume ID.",
      });
    }

    const {
      user,
      _id,
      __v,
      createdAt,
      updatedAt,
      ...updates
    } = req.body;

    const resume = await Resume.findOneAndUpdate(
      {
        _id: id,
        user: req.userId,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found.",
      });
    }

    res.json({
      message: "Resume updated successfully!",
      resume,
    });
  } catch (error) {
    console.error("Update resume error:", error.message);

    res.status(400).json({
      message: "Could not update resume.",
      error: error.message,
    });
  }
});

// DELETE: Delete a resume.
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid resume ID.",
      });
    }

    const resume = await Resume.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found.",
      });
    }

    res.json({
      message: "Resume deleted successfully!",
    });
  } catch (error) {
    console.error("Delete resume error:", error.message);

    res.status(500).json({
      message: "Could not delete this resume.",
    });
  }
});

module.exports = router;
