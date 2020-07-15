var express = require("express");
var router = express.Router();
const missionModel = require("../models/missionmodel");
const entrepriseModel = require("../models/entreprisemodel");

router.get("/missionsAll", (req, res, next) => {
  missionModel
    .find()
    .then((allMissions) => res.render("missions/missionsAll", { allMissions }))
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

router.post("/update/:id", async (req, res, next) => {
  try {
    // const entrepriseId = await missionModel.find({ entreprise: req.params.id });
    const updatedMission = await missionModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.redirect("/entreprises/profil/" + updatedMission.entreprise);
  } catch (error) {
    next(error);
  }
});

router.get("/delete/:id", async (req, res, next) => {
  try {
    const deletedMission = await missionModel.findByIdAndDelete(req.params.id);
    res.redirect("/entreprises/profil/" + deletedMission.entreprise);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
