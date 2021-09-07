require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

require("./config/db");

const handleError = require("./routes/middlewares/handleError");
const invalidUrlError = require("./routes/middlewares/invalidUrlError");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();
const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(invalidUrlError);
app.use(handleError);

module.exports = app;
