const express = require("express");
require("dotenv").config({ path: "./config/config.env" });
const app = express();
const cookieParser = require("cookie-parser");
// using middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
//using the routes here
app.use("/api/v1/post", require("./routes/post"));
app.use("/api/v1/user", require("./routes/user"));

module.exports = app;
