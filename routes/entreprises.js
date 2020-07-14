var express = require("express");
var router = express.Router();
const entrepriseModel = require("../models/entreprisemodel");
const missionModel = require("../models/missionmodel");
const e = require("express");

/* All Routes are Prefixed with /entreprises/ */

// router.get("/all", async (req, res, next) => {
//     try {
//       const missions = await entrepriseModel.find();
//       res.render("", { missions });
//     } catch (err) {
//       next(err);
//     }
// });

function formatEntrepriseInfos(infos) {
  const { name, email, password, street, city, zipcode } = infos;
  // above : we extracted the key/values pairs out of req body
  return {
    name,
    email,
    password,
    address: {
      street,
      city,
      zipcode,
    },
  };
}

router.get("/signinEnt", async (req, res) => {
  try {
    res.render("entreprises/signinEnt");
  } catch (err) {
    next(err);
  }
});

//CREATE

router.get("/signupEnt", async (req, res) => {
  try {
    res.render("entreprises/signupEnt");
  } catch (err) {
    next(err);
  }
});

router.post("/signupEnt", (req, res, next) => {
  const newEntreprise = formatEntrepriseInfos(req.body);
  entrepriseModel
    .create(newEntreprise)
    .then((dbRes) => {
      console.log(">>>>", dbRes);

      req.flash("success", "entreprise successfully created");
      res.redirect(`/entreprises/profil/${dbRes.id}`);
    })
    .catch(next);
});

router.get("/profil/:id", async (req, res, next) => {
  try {
    const profil = await entrepriseModel.findById(req.params.id);

    const missions = await missionModel.find({ entreprise: req.params.id })

    console.log("here ======>", missions);
    res.render("entreprises/profil", { profil, missions });
  } catch (err) {
    next(err);
  }
});

//UPDATE

router.get("/update/:id", async (req, res) => {
  try {
    const entreprise = await entrepriseModel.findById(req.params.id);
    console.log(entreprise);

    res.render("entreprises/update", entreprise);
  } catch (err) {
    res.render("/error");
  }
});

router.post("/update/:id", async (req, res) => {
  try {
    await entrepriseModel.findByIdAndUpdate(
      req.params.id,
      formatEntrepriseInfos(req.body)
    );
    console.log(req.body);
    res.redirect("/entreprises/profil/" + req.params.id);
  } catch (err) {
    res.json(err);
  }
});

//DELETE

router.get("/delete/:id", (req, res, next) => {
  entrepriseModel.findByIdAndDelete(req.params.id).then((dbres) => {
    req.flash("success", "Entreprise succesfully deleted");
    res.redirect("/");
  });
});

module.exports = router;
