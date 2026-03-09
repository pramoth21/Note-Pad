const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");


const app = express();
const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

app.get("/api/test", (req, res) => res.json({ message: "API is reachable" }));

// Routes

app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

const URL = process.env.MONGODB_URL;

if (!URL) {
    console.error("ERROR: MONGODB_URL is undefined! Check your .env file.");
    process.exit(1);
}

mongoose.connect(URL)
    .then(() => {
        console.log("MongoDB connection success!");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: "error",
        message: err.message || "Internal Server Error"
    });
});

app.get("/", (req, res) => {
    res.send("Note-Taking API is running!");
});

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});
