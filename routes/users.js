const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const entrepriseModel = require("../models/entreprisemodel");
const missionModel = require("../models/missionmodel.js");
const uploader = require("../config/cloudinary");

function formatUserInfos(infos) {
  const {
    firstname,
    lastname,
    email,
    category,
    password,
    street,
    city,
    zipcode,
  } = infos;
  // above : we extracted the key/values pairs out of req body
  return {
    firstname,
    lastname,
    password,
    category,
    email,
    address: {
      street,
      city,
      zipcode,
    },
  };
}

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
  const user = formatUserInfos(req.body);
  userModel
    .create(user)
    .then((newUser) => {
      console.log(newUser);
      req.flash("success", "Your profile has been created !");
      res.redirect(`/users/${newUser._id}`);
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  userModel
    .findById(req.params.id)
    .then((user) => res.render("users/user-profile", { user }))
    .catch(next);
});

router.get("/update/:id", (req, res, next) => {
  userModel
    .findById(req.params.id)
    .then((userProfile) => res.render("users/user-update", { userProfile }))
    .catch(next);
});

router.post("/update/:id", (req, res, next) => {
  userModel.findByIdAndUpdate(req.params.id, formatUserInfos(req.body));
});

router.get("/:id/missions", (req, res, next) => {
  missionModel
    .find()
    .then((allMissions) => res.render("missions/missionsAll", allMissions))
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
