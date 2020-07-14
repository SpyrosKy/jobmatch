var express = require('express');
var router = express.Router();
const missionModel = require("../models/missionmodel");
const entrepriseModel = require("../models/entreprisemodel")

router.get("/create/:id", async (req, res) => {
    try {
      res.render("missions/create");
    } catch (err) {
      next(err);
    }
});


router.post("/create", (req, res, next) => {
    const entrepriseId = req.params.id

    const { category, description, location,date_deb,date_fin } = req.body;
  
    missionModel
      .create({
          category,
          description,
          location,
          date_deb,
          date_fin,
          entrepriseId,

      })
      .then(() => {
        req.flash("success", "artist successfully created");
        res.redirect("/profil/"+ req.params.id);
      })
      .catch(next);
  });
  



module.exports=router