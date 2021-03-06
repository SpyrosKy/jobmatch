const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const missionSchema = new Schema({
  description: String,
  note: Number,
  category: {
    type: String,
    enum: [
      "bartender",
      "housekeeper",
      "receptionist",
      "waiter",
      "chef",
      "sommelier",
      "manager",
    ],
  },
  location: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  entreprise: {
    type: Schema.Types.ObjectId,
    ref: "Entreprise",
  },
  date_deb: { type: Date },
  date_fin: { type: Date },
});

const missionModel = mongoose.model("Mission", missionSchema);

module.exports = missionModel;
