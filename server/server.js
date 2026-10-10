require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const projectRoutes = require("./routes/projects");
const { notFound, errorHandler } = require("./middleware/error");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ message: "server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("mongodb connected");
        app.listen(port, () => {
            console.log(`server is running at ${port}`);
        });
    })
    .catch((err) => {
        console.log("mongodb connection failed:", err.message);
        process.exit(1);
    });
