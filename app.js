require("dotenv").config();
require("./config/mongodb");
require("./helpers/hbs");

// DEPENDENCIES
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const dev_mode = true;

// POST BODY PARSER
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// TEMPLATING
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "views/partials"));

// INITIALIZE SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
  })
);

app.use(flash());

// CUSTOM MIDDLEWARES
if (dev_mode === true) {
  app.use(require("./middlewares/devMode"));
  app.use(require("./middlewares/debugSessionInfos"));
}

app.use(require("./middlewares/exposeLoginStatus"));
app.use(require("./middlewares/exposeFlashMessage"));

// ROUTING
app.use("/", require("./routes"));
/* app.use("/entreprises", require("./routes/entreprise"));
app.use("/missions", require("./routes/mission")); */
app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/auth"));

module.exports = app;
