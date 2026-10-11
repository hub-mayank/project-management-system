const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Project name is required"],
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending"
        },
        deadline: {
            type: Date
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },
        assignedMembers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
