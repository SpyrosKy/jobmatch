module.exports = function devMode(req, res, next) {
  req.session.currentUser = {
     _id: "5f0c8011cb244cf30b9f9926", // change the user id here to fit yor needs
    name:"spyros",
    role: "entreprise",
    email: "spyros@spyros.com",
  };
  next();
};
