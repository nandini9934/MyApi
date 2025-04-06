const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../sqlconnection');
const jwt = require('jsonwebtoken');

const ggpKey = process.env.GGP_SECRET_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        // Check if user exists in database
        const query = "SELECT id, email, isActive FROM UserLogins WHERE email = ?";
        db.execute(query, [profile.emails[0].value], async (err, results) => {
            if (err) return done(err);

            if (results.length > 0) {
                // Existing user
                const user = results[0];
                if (user.isActive === 0) {
                    return done(null, false, { message: 'Please activate your account' });
                }

                const payload = { user: { id: user.id } };
                const token = jwt.sign(payload, ggpKey, { expiresIn: '10h' });
                return done(null, { token, user });
            } else {
                // New user - Create account
                const insertQuery = `
                    INSERT INTO UserLogins (name, email, isActive, signupdate, auth_provider) 
                    VALUES (?, ?, 1, NOW(), 'google')
                `;
                db.execute(insertQuery, [
                    profile.displayName,
                    profile.emails[0].value
                ], (err, result) => {
                    if (err) return done(err);

                    const payload = { user: { id: result.insertId } };
                    const token = jwt.sign(payload, ggpKey, { expiresIn: '10h' });
                    return done(null, { 
                        token,
                        user: {
                            id: result.insertId,
                            name: profile.displayName,
                            email: profile.emails[0].value
                        }
                    });
                });
            }
        });
    } catch (error) {
        return done(error, null);
    }
}));

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport; 