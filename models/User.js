const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
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
    //required: true,
  },
  firstname: {
    type: String,
    //required: true,
  },
  lastname: {
    type: String,
    //required: true,
  },
  email: {
    type: String,
    //required: true,
  },
  password: {
    type: String,
    require: true,
  },
  picture: {
    type: String,
    default:
      "https://f0.pngfuel.com/png/981/645/default-profile-picture-png-clip-art.png",
  },
  description: {
    type: String,
    //required: true,
  },
  address: {
    street: String,
    city: String,
    zipcode: Number,
  },
  price: Number,
  rateavg: Number,
  missions: {
    type: [Schema.Types.ObjectId],
    ref: "Mission",
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
