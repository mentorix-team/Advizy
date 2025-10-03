import dotenv from "dotenv";
dotenv.config();


import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserGoogle from "./model/user.google.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientId,
      clientSecret: process.env.clientSecret,
      callbackURL: process.env.callbackURL,
      passReqToCallback: true,
      state: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const returnUrl = req.query.state || "/";

        let usergoogle = await UserGoogle.findOne({ googleId: profile.id });

        if (!usergoogle) {
          usergoogle = new UserGoogle({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          await usergoogle.save();
        }

        const userWithReturnUrl = {
          ...usergoogle.toObject(),
          returnUrl,
        };

        return done(null, userWithReturnUrl);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// passport.serializeUser((usergoogle, done) => {
//   done(null, usergoogle.id);
// });

passport.serializeUser((user, done) => {
  // Persist only minimal identifying data
  done(null, { id: user._id, returnUrl: user.returnUrl || '/' });
});

passport.deserializeUser(async (payload, done) => {
  try {
    const { id, returnUrl } = payload || {};
    const usergoogle = await UserGoogle.findById(id);
    if (!usergoogle) return done(null, false);
    done(null, { ...usergoogle.toObject(), returnUrl: returnUrl || '/' });
  } catch (error) {
    done(error, null);
  }
});

export default passport;
