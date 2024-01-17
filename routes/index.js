const express = require('express');
const multer = require('multer');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const { ensureAuthenticated } = require('../model/auth')

const file = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

const imagedata = multer({ storage: file }).single('img');
const upload = multer({ dest: 'uploads/' });

const routs = express.Router();
const indexcontroller = require('../controller/indexcontroller');

routs.use(passport.initialize());
routs.use(passport.session());

// userLogin 
// routs.get('/login', indexcontroller.login);
routs.get('/logout', indexcontroller.logout);
// routs.post('/registerdata', indexcontroller.registerdata);
// routs.post('/userRegister', indexcontroller.userRegister);
routs.get('/', indexcontroller.index);
routs.post('/logindata', passport.authenticate('user', { failureRedirect: '/' }), indexcontroller.logindata);
routs.get('/register', indexcontroller.register);
routs.get('/otpcode', indexcontroller.otpcode);
routs.get('/contact', indexcontroller.contact);
routs.post('/contactData', indexcontroller.contactData);
routs.post('/inquiry', indexcontroller.inquiry);
routs.get('/forgetpassword', indexcontroller.forgetpassword);
routs.post('/fpassword', indexcontroller.fpassword);
routs.get('/otp', indexcontroller.otp);
routs.get('/About-Page', indexcontroller.about);
routs.get('/Event', indexcontroller.event);
routs.get('/Blog', indexcontroller.blog);
routs.get('/Wedding', indexcontroller.wedding);
routs.post('/otpdata', indexcontroller.otpdata);
routs.get('/resetpassword', indexcontroller.resetpassword);
routs.post('/npassword', indexcontroller.npassword);

// Adminpanel
routs.get('/adminlogin', indexcontroller.adminlogin);
routs.post('/adminlogindata', indexcontroller.adminlogindata);
routs.get('/adminpanel',ensureAuthenticated, indexcontroller.adminpanel);
routs.get('/category', ensureAuthenticated,indexcontroller.category);
routs.post('/categoryAdd', imagedata, indexcontroller.categoryAdd);
routs.get('/deletecategory', indexcontroller.deletecategory);
routs.post('/editcategory', imagedata, indexcontroller.editcategory);
// routs.get('/subcategory', ensureAuthenticated,indexcontroller.subcategory);
// routs.post('/subcategoryAdd', indexcontroller.subcategoryAdd);
// routs.get('/deletesubcategory', indexcontroller.deletesubcategory);
// routs.post('/editsubcategory', indexcontroller.editsubcategory);
routs.get('/theme', ensureAuthenticated,indexcontroller.theme);
routs.post('/themeAdd', indexcontroller.uploadImage, indexcontroller.themeAdd);
routs.post('/editTheme', imagedata, indexcontroller.editTheme);
routs.get('/deletetheme', indexcontroller.deletetheme);
routs.get('/user',ensureAuthenticated, indexcontroller.user);
routs.get('/checksession', (req, res) => {
    res.json(req.session);
  });
  

  routs.use((req, res) => {
    res.status(404).render('404');
});

module.exports = routs;  