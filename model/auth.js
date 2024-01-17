// auth.js
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/adminlogin');
    }
  }
  
  module.exports = { ensureAuthenticated };
  