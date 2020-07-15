const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const entrepriseSchema = new Schema({
  name: String,
  role: {
    type: String,
    default: "entreprise",
  },
  email: String,
  password: String,
  address: {
    street: String,
    city: String,
    zipcode: Number,
  },
});

const entrepriseModel = mongoose.model("Entreprise", entrepriseSchema);

module.exports = entrepriseModel;
