const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");

const connectDB = require("./config/db");
const Job = require("./models/Job");

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to Job Portal Backend!");
});

// GET - View all jobs
app.get("/api/jobs", async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Add a new job
app.post("/api/jobs", async (req, res) => {
    try {
        const newJob = await Job.create(req.body);

        res.status(201).json({
            message: "Job added successfully",
            job: newJob
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT - Update a job
app.put("/api/jobs/:id", async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json({
            message: "Job updated successfully",
            job
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE - Delete a job
app.delete("/api/jobs/:id", async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json({
            message: "Job deleted successfully"
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Database connection error:", error.message);
    });