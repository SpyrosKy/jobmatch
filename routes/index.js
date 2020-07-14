const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/missions", (req, res, next) => {
  res.render("missions");
});

module.exports = router;
