const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const entrepriseModel = require("../models/entreprisemodel");
const missionModel = require("../models/missionmodel.js");
const uploader = require("../config/cloudinary");
const bcrypt = require("bcrypt");
const protectPrivateRoute = require("../middlewares/protectPrivateRoute");

function formatUserInfos(infos) {
  const {
    firstname,
    lastname,
    email,
    category,
    picture,
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
    picture,
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
    .then((allUsers) => res.render("users/all-users", { allUsers }))
    .catch(next);
});

router.get("/new", (req, res) => {
  res.render("signup");
});

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signin", (req, res, next) => {
  const user = req.body;
  console.log(user);
  if (!user.email || !user.password) {
    // one or more field is missing
    req.flash("error", "Please fill all the fields.");
    return res.redirect("/signin");
  }

  userModel
    .findOne({ email: user.email })
    .then((dbRes) => {
      if (!dbRes) {
        // no user found with this email
        req.flash("error", "Wrong credentials! Please try again.");
        return res.redirect("/signin");
      }
      // user has been found in DB !
      if (bcrypt.compareSync(user.password, dbRes.password)) {
        // encryption says : password match success
        const { _doc: clone } = { ...dbRes }; // make a clone of db user

        delete clone.password; // remove password from clone
        // console.log(clone);

        req.session.currentUser = clone; // user is now in session... until session.destroy
        return res.redirect("/users/" + dbRes.id);
      } else {
        // encrypted password match failed
        req.flash("error", "Wrong credentials! Please try again.");
        return res.redirect("/signin");
      }
    })
    .catch(next);
});

router.post("/new", uploader.single("picture"), (req, res, next) => {
  const user = formatUserInfos(req.body);
  console.log("yolo");
  if (req.file) user.picture = req.file.path;

  if (!user.email || !user.password) {
    req.flash("error", "Please fill all the fields.");
    return res.redirect("/signup");
  } else {
    userModel.findOne({ email: user.email }).then((dbRes) => {
      if (dbRes) {
        // si dbRes n'est pas null
        req.flash("error", "Sorry, email is already taken :/");
        return res.redirect("/signup");
      }

      const salt = bcrypt.genSaltSync(10); // https://en.wikipedia.org/wiki/Salt_(cryptography)
      const hashed = bcrypt.hashSync(user.password, salt);
      // generates a unique random hashed password
      user.password = hashed; // new user is ready for db

      userModel
        .create(user)
        .then((newUser) => {
          console.log(newUser);
          req.flash("success", "Your profil has been created !");
          res.redirect(`/users/${newUser._id}`);
        })
        .catch(next);
    });
  }
});

router.get("/:id", protectPrivateRoute, (req, res, next) => {
  userModel
    .findById(req.params.id)
    .then((user) => res.render("users/user-profile", { user }))
    .catch(next);
});

router.get("/update/:id", protectPrivateRoute, (req, res, next) => {
  userModel
    .findById(req.params.id)
    .then((userProfile) => res.render("users/user-update", { userProfile }))
    .catch(next);
});

router.post(
  "/update/:id",
  uploader.single("picture"),
  protectPrivateRoute,
  (req, res, next) => {
    const updatedUser = req.body;
    if (req.file) updatedUser.picture = req.file.path;

    userModel
      .findByIdAndUpdate(req.params.id, formatUserInfos(updatedUser))
      .then(() => res.redirect("/users/" + req.params.id))
      .catch(next);
  }
);

router.get("/:id/missions", protectPrivateRoute, (req, res, next) => {
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
