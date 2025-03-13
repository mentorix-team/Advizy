import { config } from 'dotenv';
config(); 
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserGoogle from './model/user.google.model.js';

passport.use(new GoogleStrategy({
  clientID: process.env.clientId,
  clientSecret: process.env.clientSecret,
  callbackURL: process.env.callbackURL

  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let usergoogle = await UserGoogle.findOne({ googleId: profile.id });

      if (!usergoogle) {
        usergoogle = new UserGoogle({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        });
        await usergoogle.save();
      }

      return done(null, usergoogle);
    } catch (error) {
      return done(error, false);
    }
  }
));

passport.serializeUser((usergoogle, done) => {
  done(null, usergoogle.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const usergoogle = await UserGoogle.findById(id);
    done(null, usergoogle);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
