const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const customerRoutes = require("./Routes/customerRoutes");
app.use(cors());
app.use(express.json()); // parse requests of content-type - application
app.use(morgan("dev"));
const cookieParser = require("cookie-parser");
app.use(cookieParser());


app.use("/api/v1/customer", customerRoutes);

module.exports = app;
