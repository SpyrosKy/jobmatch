const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const missionSchema = new Schema({
    description: String,
    note:Number,

  user: {
    type: Schema.Types.ObjectId,
      ref: "usermodel",
    
  },
  entreprise: {
    type: Schema.Types.ObjectId,
    ref: "entreprisemodel",
  },
  date_deb: { type: Date, default: "Date.now()" },
  date_fin: { type: Date, default: "Date.now()" },
});

const artistModel = mongoose.model("Artist", artistSchema);

module.exports = artistModel;
