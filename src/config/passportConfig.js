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
        return done(null, false, { message: incorrectCredentials.message });
      }

      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: incorrectCredentials.message });
      }
    } catch (err) {
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
