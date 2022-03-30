const LocalStrategy = require("passport-local").Strategy;
const User = require("./../models/user");
const bcrypt = require("bcryptjs");
const { internalError, incorrectCredentials } = require("../utils/errors");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );

  async function authenticateUser(email, password, done) {
    try {
      let user = await User.findOne({ email: email });

      if (!user) {
        console.log("No user found");
        return done(null, false, { message: "No user found!" });
      }

      if (await bcrypt.compare(password, user.password)) {
        console.log("match");
        return done(null, user);
      } else {
        console.log("Incorrect credentials");
        return done(null, false, { message: incorrectCredentials.message });
      }
    } catch (err) {
      //res.status(500).render("login", internalError);
      console.log("Internal error");
      return done(null, false, {
        message: internalError.message,
      });
    }
  }

  passport.serializeUser(function (user, done) {
    done(null, user.id); //do deserialize
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
