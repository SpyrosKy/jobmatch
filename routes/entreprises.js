const express = require("express");
const router = express.Router();
const entrepriseModel = require("../models/entreprisemodel");
const missionModel = require("../models/missionmodel");
const bcrypt = require("bcrypt");
const protectAdminRoute = require("../middlewares/protectAdminRoute");

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

router.get("/profilAll", protectAdminRoute, async (req, res, next) => {
  try {
    const profil = await entrepriseModel.find();
    res.render("entreprises/profilAll", { profil });
  } catch (err) {
    next(err);
  }
});

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

  if (!newEntreprise.email || !newEntreprise.password) {
    req.flash("error", "Please fill all the fields.");
    return res.redirect("/entreprises/signupEnt");
  } else {
    entrepriseModel.findOne({ email: newEntreprise.email }).then((dbRes) => {
      if (dbRes) {
        // si dbRes n'est pas null
        req.flash("error", "Sorry, email is already taken :/");
        return res.redirect("/entreprises/signupEnt");
      }

      const salt = bcrypt.genSaltSync(10); // https://en.wikipedia.org/wiki/Salt_(cryptography)
      const hashed = bcrypt.hashSync(newEntreprise.password, salt);
      // generates a unique random hashed password
      newEntreprise.password = hashed; // new user is ready for db

      entrepriseModel
        .create(newEntreprise)
        .then((dbRes) => res.redirect(`/entreprises/signinEnt`))
        .catch(next);
    });
  }
});
console.log("hello");

// entrepriseModel
//   .create(newEntreprise)
//   .then((dbRes) => {

//     req.flash("success", "entreprise successfully created");
//     res.redirect(`/entreprises/profil/${dbRes.id}`);
//   })
//   .catch(next);

router.post("/signinEnt", (req, res, next) => {
  console.log("in the signin route");

  const entreprise = req.body;
  console.log(entreprise);

  if (!entreprise.email || !entreprise.password) {
    // one or more field is missing
    req.flash("error", "Wrong credentials! Please try again.");
    console.log("missing data");

    return res.redirect("/entreprises/signinEnt");
  }

  entrepriseModel
    .findOne({ email: entreprise.email })
    .then((dbRes) => {
      if (!dbRes) {
        // no user found with this email
        req.flash("error", "Wrong credentials! Please try again.");
        console.log("in the wrong credentials");

        return res.redirect("/entreprises/signinEnt");
      }
      // user has been found in DB !
      if (bcrypt.compareSync(entreprise.password, dbRes.password)) {
        // encryption says : password match success
        const { _doc: clone } = { ...dbRes }; // make a clone of db user

        delete clone.password; // remove password from clone
        // console.log(clone);

        req.session.currentUser = clone; // user is now in session... until session.destroy
        console.log("succesfully signin");

        return res.redirect("/entreprises/profil/" + dbRes.id);
      } else {
        console.log("wrong credentials again");

        // encrypted password match failed
        req.flash("error", "Wrong credentials! Please try again.");
        return res.redirect("/entreprises/signinEnt");
      }
    })
    .catch(next);
});

router.get("/profil/:id", async (req, res, next) => {
  try {
    const profil = await entrepriseModel.findById(req.params.id);

    const missions = await missionModel.find({ entreprise: req.params.id });

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

router.get("/deleteAdmin/:id", (req, res, next) => {
  entrepriseModel.findByIdAndDelete(req.params.id).then((dbres) => {
    req.flash("success", "Entreprise succesfully deleted");
    res.redirect("/entreprises/profilAll");
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
