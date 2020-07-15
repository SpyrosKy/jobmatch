const router = require("../routes/users");

module.exports = function protectPrivateRoute(req, res, next) {
  if (req.session.currentUser) next();
  else {
    req.flash("warning", "you must be connected...");
    res.redirect("/signin");
  }
};
