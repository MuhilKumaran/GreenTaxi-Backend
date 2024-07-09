const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const customerRoutes = require("./Routes/customerRoutes");
app.use(cors());
const db = require("./mysql");
// 1) MIDDLEWARES
app.use(express.json()); // parse requests of content-type - application
app.use(morgan("dev"));

// 2) ROUTE HANDLERS
// 3) ROUTES
// app.post("/api/v1/support", (req, res) => {
//   res.status(200).json({ status: "success" });
// });

app.use("/api/v1/customer", customerRoutes);

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(404).send("Something went wrong!");
//   next();
// });
//START SERVER
module.exports = app;
