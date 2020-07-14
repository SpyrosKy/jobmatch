var express = require("express");
var router = express.Router();
const entrepriseModel = require("../models/entreprisemodel");

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
    address:{ 
    street,
    city,
    zipcode
    }
  };
}

router.get("/signinEnt", async (req, res) => {
  try {
    res.render("entreprises/signinEnt");
  } catch (err) {
    next(err);
  }
});

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
    .create(
      newEntreprise
    )
    .then((dbRes) => {
      console.log(">>>>", dbRes);

      req.flash("success", "entreprise successfully created");
      res.redirect(`/entreprises/profil/${dbRes.id}`);
    })
    .catch(next);
});
router.get("/profil/:id", async (req, res) => {
  try {
    const profil = await entrepriseModel.findById(req.params.id)
    res.render("entreprises/profil", profil);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
