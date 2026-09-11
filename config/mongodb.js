const mongoose = require("mongoose");

// mongoose 6+ always uses the new url parser and the unified topology, and it
// rejects the useNewUrlParser / useCreateIndex / useUnifiedTopology /
// useFindAndModify options that used to be passed here.
//
// connect() rejects when the initial connection fails. Node >= 15 exits the
// process on an unhandled rejection, so the failure is caught here and logged
// through the same path as the "error" event below.
mongoose
  .connect(process.env.MONGO_URI)
  .catch((err) => console.log("nay db connection error :(", err.message));

mongoose.connection.on("connected", () =>
  console.log("yay mongodb connected :)")
);

mongoose.connection.on("error", () =>
  console.log("nay db connection error :(")
);
