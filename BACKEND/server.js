const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

if (!URL) {
    console.error("ERROR: MONGODB_URL is undefined! Check your .env file.");
    process.exit(1);
}

console.log("MongoDB URL loaded successfully.");

mongoose.connect(URL)
.then(() => {
    console.log("MongoDB connection success!");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});