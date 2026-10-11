const express = require("express");
const mongoose = require("mongoose");
const Project = require("../models/Project");
const { authenticateUser, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// get all projects (admin gets all, user gets assigned only)
router.get("/", authenticateUser, async (req, res, next) => {
    try {
        const filter = req.user.role === "admin" ? {} : { assignedMembers: req.user.id };
        const projects = await Project.find(filter).populate("assignedMembers", "_id name email");

        res.json(projects);
    } catch (err) {
        next(err);
    }
});

// get single project by id (user gets 403 if not assigned)
router.get("/:id", authenticateUser, async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid project id" });
        }

        const project = await Project.findById(req.params.id).populate("assignedMembers", "_id name email");
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (req.user.role !== "admin") {
            const isAssigned = project.assignedMembers.some(
                (member) => (member._id ? member._id.toString() : member.toString()) === req.user.id
            );
            if (!isAssigned) {
                return res.status(403).json({ message: "Access denied. Not assigned to this project." });
            }
        }

        res.json(project);
    } catch (err) {
        next(err);
    }
});

// create a new project (admin only)
router.post("/", authenticateUser, requireAdmin, async (req, res, next) => {
    try {
        const { name, description, status, deadline, priority, assignedMembers } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Project name is required" });
        }

        if (status && !["pending", "in-progress", "completed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        if (priority && !["low", "medium", "high"].includes(priority)) {
            return res.status(400).json({ message: "Invalid priority value" });
        }

        const project = new Project({
            name: name.trim(),
            description,
            status: status || "pending",
            deadline,
            priority: priority || "medium",
            assignedMembers: assignedMembers || []
        });

        await project.save();
        await project.populate("assignedMembers", "_id name email");

        res.status(201).json(project);
    } catch (err) {
        next(err);
    }
});

// update a project (admin updates any field, user updates only status of assigned project)
router.put("/:id", authenticateUser, async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid project id" });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (req.user.role !== "admin") {
            const isAssigned = project.assignedMembers.some(
                (member) => (member._id ? member._id.toString() : member.toString()) === req.user.id
            );
            if (!isAssigned) {
                return res.status(403).json({ message: "Access denied. Not assigned to this project." });
            }

            if (req.body.status !== undefined) {
                if (!["pending", "in-progress", "completed"].includes(req.body.status)) {
                    return res.status(400).json({ message: "Invalid status value" });
                }
                project.status = req.body.status;
            }
        } else {
            const { name, description, status, deadline, priority, assignedMembers } = req.body;

            if (name !== undefined) {
                if (!name.trim()) {
                    return res.status(400).json({ message: "Project name cannot be empty" });
                }
                project.name = name.trim();
            }

            if (description !== undefined) {
                project.description = description;
            }

            if (status !== undefined) {
                if (!["pending", "in-progress", "completed"].includes(status)) {
                    return res.status(400).json({ message: "Invalid status value" });
                }
                project.status = status;
            }

            if (deadline !== undefined) {
                project.deadline = deadline;
            }

            if (priority !== undefined) {
                if (!["low", "medium", "high"].includes(priority)) {
                    return res.status(400).json({ message: "Invalid priority value" });
                }
                project.priority = priority;
            }

            if (assignedMembers !== undefined) {
                project.assignedMembers = assignedMembers;
            }
        }

        await project.save();
        await project.populate("assignedMembers", "_id name email");

        res.json(project);
    } catch (err) {
        next(err);
    }
});

// delete a project (admin only)
router.delete("/:id", authenticateUser, requireAdmin, async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid project id" });
        }

        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
