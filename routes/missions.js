var express = require("express");
var router = express.Router();
const missionModel = require("../models/missionmodel");
const entrepriseModel = require("../models/entreprisemodel");

router.get("/create/:id", async (req, res) => {
  try {

      res.render("missions/create", { idEntreprise: req.params.id});

  } catch (err) {
    next(err);
  }
});


router.post("/create/:id", (req, res, next) => {
    const entreprise = req.params.id;
    console.log(entreprise);


  const { category, description, location, date_deb, date_fin } = req.body;

  missionModel
    .create({
      category,
      description,
      location,
      date_deb,
      date_fin,

      entreprise
    })
    .then((newMission) => {
      console.log(newMission);
      req.flash("success", "Mission successfully created");
      res.redirect(`/entreprises/profil/${newMission.entreprise}`);

    })
    .catch(next);
});

module.exports = router;
