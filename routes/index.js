const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/missions", (req, res) => {
  res.render("missions");
});

router.get("/howitworks", (req, res) => {
  res.render("howitworks");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

module.exports = router;
