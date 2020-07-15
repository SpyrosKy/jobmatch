require("dotenv").config();
require("./config/mongodb");
require("./helpers/hbs");

// DEPENDENCIES
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const flash = require("connect-flash");
const dev_mode = true; // designed to keep messages between 2 http request/response cycles
const session = require("express-session");

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

// app.locals.isLoggedIn = true;
// app.locals.isAdmin = true;
// app.locals.currentUser = {
//   email: "foo@bar.baz",
//   avatar: "https://payload143.cargocollective.com/1/2/66133/5178589/url.gif"
// }

// ROUTING
app.use("/", require("./routes"));
app.use("/entreprises", require("./routes/entreprises"));
app.use("/missions", require("./routes/missions"));
app.use("/users", require("./routes/users"));

//("/", require("./routes/auth"))

module.exports = app;
