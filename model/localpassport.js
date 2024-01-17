const passport = require('passport');

const passportLocal = require('passport-local').Strategy;

const registerTbl = require('../model/form');
const adminTbl = require('../model/admin');

passport.use('user', new passportLocal({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await registerTbl.findOne({ email: email });
        if (!user || user.password !== password) {
            return done(null, false);
        }
        return done(null, user);
    } catch (err) {
        console.log(err);
        return done(err);
    }
}));

passport.use('admin', new passportLocal({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const admin = await adminTbl.findOne({ email: email });
        if (!admin || admin.password !== password) {
            return done(null, false);
        }
        return done(null, admin);
    } catch (err) {
        console.log(err);
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, { id: user.id, role: user.role });
});

passport.deserializeUser(async (serialized, done) => {
    try {
        if (serialized.role === 'user') {
            const user = await registerTbl.findById(serialized.id);
            return done(null, user);
        } else if (serialized.role === 'admin') {
            const admin = await adminTbl.findById(serialized.id);
            return done(null, admin);
        } else {
            return done('Invalid user role');
        }
    } catch (err) {
        console.error(err);
        return done(err);
    }
});

passport.checkAdminAuthentication = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    return res.redirect('/adminlogin');
};

passport.checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'user') {
        return next();
    }
    return res.redirect('/');
};

passport.setAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.users = req.user;
    }
    return next();
};

module.exports = passport;
