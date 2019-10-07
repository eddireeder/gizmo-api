const passport = require("passport");
const bcrypt = require("bcrypt");
const db = require("./db");
const LocalStrategy = require("passport-local").Strategy;


passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    // Check if user exists
    const {rows} = await db.query("SELECT * FROM users WHERE username=$1", [username]);

    // If the user exists, compare passwords
    if (rows.length > 0) {
      const user = rows[0];
      const equal = await bcrypt.compare(password, user.password);
      if (equal) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }
    return done(null, false);
  } catch (e) {
    return done(e);
  }
}));


passport.serializeUser((user, done) => {
  done(null, user.id)
});


passport.deserializeUser(async (id, done) => {
  try {
    const {rows} = await db.query("SELECT * FROM users WHERE id = $1", [parseInt(id, 10)]);
    return done(null, rows[0]);
  } catch (e) {
    return done(e);
  }
});