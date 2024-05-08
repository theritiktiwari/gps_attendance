const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('../server/config/connectDB');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

connectDB();

app.get("/api", (req, res) => {
    res.send("API of Location Based Attendance System");
});

app.use("/api/auth", require("../server/routes/auth"));
app.use("/api/course", require("../server/routes/course"));
app.use("/api/enrollment", require("../server/routes/enrollment"));
app.use("/api/attendance", require("../server/routes/attendance"));

app.listen(5000, () => {
    console.log(`Server running`);
});

module.exports = app;