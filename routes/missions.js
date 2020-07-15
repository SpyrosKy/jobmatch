var express = require("express");
var router = express.Router();
const missionModel = require("../models/missionmodel");
const entrepriseModel = require("../models/entreprisemodel");

router.get("/missionsAll", (req, res, next) => {
  missionModel
    .find()
    .then((allMissions) => res.render("missions/missionsAll", {allMissions}))
    .catch(next);
});

router.get("/create/:id", async (req, res) => {
  try {
    res.render("missions/create", { idEntreprise: req.params.id });
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

      entreprise,
    })
    .then((newMission) => {
      console.log(newMission);
      req.flash("success", "Mission successfully created");
      res.redirect(`/entreprises/profil/${newMission.entreprise}`);
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  // Get Details of 1 mission
  missionModel
    .findById(req.params.id)
    .then((missionDetail) =>
      res.render("missions/oneMission", { missionDetail })
    )
    .catch(next);
});

router.get("/update/:id", (req, res, next) => {
  missionModel
    .findById(req.params.id)
    .then((updateMission) => res.render("missions/update", { updateMission }))
    .catch(next);
});
router.post("/update/:id", (req, res, next) => {
  missionModel
    .findByIdAndUpdate(req.params.id, req.body)
    .then((dbRes) => res.redirect("/entreprises/profil/" + dbRes.entreprise))
    .catch(next);
});

module.exports = router;
