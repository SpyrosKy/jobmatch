module.exports = function devMode(req, res, next) {
  req.session.currentUser = {
    _id: "5f0c661bc92bd62edc5f5362", // change the user id here to fit your needs
    role: "user",
    firstname: "chakib",
    lastname: "B",
    email: "aa@bb.com",
    password: "123",
    category: "sommelier",
    role: "user",
  };
  next();
};
