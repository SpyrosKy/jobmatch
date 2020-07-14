const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const uploader = require("../config/cloudinary");

/* ALL ROUTES ARE PREFIXED WITH /USERS */

/* GET users listing. */
router.get("/all", (req, res, next) => {
  userModel
    .find()
    .then((allUsers) => res.render("users/all-users", allUsers))
    .catch(next);
});

router.get("/new", (req, res) => {
  res.render("signup");
});

router.post("/new", (req, res, next) => {
  const { firstname, lastname, category, email, password, cityname } = req.body;

  userModel
    .create({
      firstname,
      lastname,
      category,
      email,
      password,
      cityname,
    })
    .then((newUser) => {
      console.log(newUser);
      req.flash("success", "Your profile has been created !");
      res.redirect(`/users/user-profile/${newUser._id}`);
    })
    .catch(next);
});

router.get("/user-profile/:id", (req, res, next) => {
  userModel
    .findById(req.params.id)
    .then((user) => res.render("users/user-profile", {user} ))
    .catch(next);
});

// router.get("/:id", (req, res, next) => {
//   userModel
//     .findById(req.params.id)
//     .populate("missions")
//     .then((dbRes) => res.render("users/user", { user: dbRes }))
//     .catch(next);
// });

module.exports = router;
