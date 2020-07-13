const express = require("express");
const router = express.Router();
const userModel = require("../../models/User");
const uploader = require("../../config/cloudinary");

/* GET users listing. */
router.get("/users", (req, res, next) => {
  userModel
    .find()
    .then((allUsers) => res.render("users/all-users", allUsers))
    .catch(next);
});

router.get("/users/:id", (req, res, next) => {
  userModel
    .findById(req.params.id)
    .populate("missions")
    .then((user) => res.render("users/user"))
    .catch(next);
});

module.exports = router;
