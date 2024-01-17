// const fetch = require("node-fetch");
const registertbl = require("../model/form");
const contactTbl = require("../model/contact");
const Inquiry = require("../model/inquiry");
const adminTbl = require("../model/admin");
const categoryTbl = require("../model/category");
const themeTbl = require("../model/theme");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const cookie = require("cookie-parser");
const passport = require("passport");
const multer = require("multer");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


async function fetchCategories() {
  try {
    // const providedPassword = 'Decora957438';
    const response = await fetch(`https://decoraevnt.online/api/category?providedPassword=Decora957438`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

const index = async (req, res) => {
    try {
      const category = await fetchCategories();
      res.render('index', { category });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).send('Internal Server Error');
    }
};

const register = (req, res) => {
  return res.render("register");
};

const registerdata = async (req, res) => {
  const {
    fname,
    lname,
    gender,
    email,
    password,
    cpassword,
    contact,
    address,
    state,
    zipcode,
  } = req.body;
  if (password == cpassword) {
    try {
      let obj = {
        fname: fname,
        lname: lname,
        gender: gender,
        email: email,
        password: password,
        contact: contact,
        address: address,
        state: state,
        zipcode: zipcode,
      };
      res.cookie("userdata", obj);
      if (obj) {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "decora.evnt@gmail.com",
            pass: "goyu fzeg uxml ybal  ",
          },
        });
        let otp = Math.floor(Math.random() * 1000000);
        var mailOptions = {
          from: "decora.evnt@gmail.com",
          to: email,
          subject: "Sending Email using Node.js",
          text: "Your otp :- " + otp,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            let obj = {
              email: email,
              otp: otp,
            };
            console.log("Email sent: " + info.response);
            res.cookie("usercode", obj);
            return res.redirect("/otpcode");
          }
        });
      } else {
        console.log("Data is not fetched");
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  } else {
    req.flash("error", "password and confirm password is not same");
    return res.redirect("back");
  }
};

const otpcode = (req, res) => {
  return res.render("otpcode");
};

const userRegister = async (req, res) => {
  try {
    let userdata = req.cookies["userdata"];
    let email = req.cookies["usercode"].email;
    let code = req.cookies["usercode"].otp;
    let otpcode1 = req.body.otpcode1;
    let otpcode2 = req.body.otpcode2;
    let otpcode3 = req.body.otpcode3;
    let otpcode4 = req.body.otpcode4;
    let otpcode5 = req.body.otpcode5;
    let otpcode6 = req.body.otpcode6;
    result = otpcode1 + otpcode2 + otpcode3 + otpcode4 + otpcode5 + otpcode6;
    if (userdata.email == email) {
      if (code == result) {
        let data = await registertbl.create({
          fname: userdata.fname,
          lname: userdata.lname,
          gender: userdata.gender,
          email: userdata.email,
          password: userdata.password,
          contact: userdata.contact,
          state: userdata.state,
          address: userdata.address,
          zipcode: userdata.zipcode,
          role: "user",
        });
        res.clearCookie("usercode");
        res.clearCookie("userdata");
        return res.redirect("/");
      } else {
        console.log("Otp is not Right");
        return res.redirect("back");
      }
    } else {
      console.log("Email is not Right");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const login = (req, res) => {
  if (res.locals.users) {
    return res.redirect("index");
  }
  return res.render("login");
};

const logindata = (req, res) => {
  return res.redirect("/index");
};

const forgetpassword = (req, res) => {
  return res.render("forget-password");
};

const fpassword = async (req, res) => {
  try {
    let record = await registertbl.findOne({ email: req.body.email });
    if (record) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "decora.evnt@gmail.com",
          pass: "wmmn btto xcms olbx",
        },
      });
      let otp = Math.floor(Math.random() * 1000000);
      var mailOptions = {
        from: "decora.evnt@gmail.com",
        to: req.body.email,
        subject: "Sending Email using Node.js",
        text: "Your otp :- " + otp,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          let obj = {
            email: req.body.email,
            otp: otp,
          };
          console.log("Email sent: " + info.response);
          res.cookie("forgetpassword", obj);
          return res.redirect("/otp");
        }
      });
    } else {
      console.log("mail not found");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const otp = (req, res) => {
  return res.render("otp");
};

const otpdata = async (req, res) => {
  try {
    let cookieotp = req.cookies["forgetpassword"].otp;
    let otp1 = req.body.otp1;
    let otp2 = req.body.otp2;
    let otp3 = req.body.otp3;
    let otp4 = req.body.otp4;
    let otp5 = req.body.otp5;
    let otp6 = req.body.otp6;
    result = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
    if (cookieotp == result) {
      return res.redirect("/resetpassword");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const resetpassword = (req, res) => {
  return res.render("reset-password");
};

const npassword = async (req, res) => {
  const { password, cpassword } = req.body;
  if (password == cpassword) {
    try {
      let email = req.cookies["forgetpassword"].email;
      const updateEmail = await registertbl.findOne({ email: email });
      let id = updateEmail.id;
      const updatepass = await registertbl.findByIdAndUpdate(id, {
        password: password,
      });
      if (updatepass) {
        res.clearCookie("forgetpassword");
        return res.redirect("/");
      } else {
        console.log("Password not changed");
        return res.redirect("back");
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  } else {
    console.log("password and confirm password is not same");
    return res.redirect("back");
  }
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return false;
    }
    return res.redirect("/");
  });
};

// contact page

const contact = (req, res) => {
  return res.render("contact");
};

const contactData = async (req, res) => {
  const { fname, lname, email, contact_text } = req.body;

  try {
    const newContact = new contactTbl({
      fname,
      lname,
      email,
      contact_text,
    });

    // Save the new contact to the database
    await newContact.save();

    //   res.status(200).json({ success: true });
    res.redirect("/contact");
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const inquiry = async (req, res) => {
  const { name, email, mobile } = req.body;

  try {
    const newInquiry = new Inquiry({
      name,
      email,
      mobile,
    });

    // Save the new inquiry to the database
    await newInquiry.save();

    // Redirect to a different route (e.g., "/contact")
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const about = (req, res) => {
  return res.render("About-Page");
};

const blog = (req, res) => {
  return res.render("Blog");
};



const event = async (req, res) => {
  try {
    const categories = await fetchCategories();
    res.render('Event', { categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send('Internal Server Error');
  }
};

const wedding = async (req, res) => {

  const categoryName = req.query.categoryName;
  console.log('Category Name:', categoryName);

  try {
    const categories = await fetchCategories();
    const selectedCategory = categories.find(category => category.name === categoryName);

    if (selectedCategory && selectedCategory.themes && selectedCategory.themes.length > 0) {
      res.render('Wedding', { selectedCategory });
    } else {
      res.status(404).send('No themes found for the selected category.');
    }
  } catch (error) {
    console.error('Error fetching category themes:', error);
    res.status(500).send('Internal Server Error');
  }

};


// adminpanel
const adminlogin = (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect("/adminpanel");
    }
    return res.render("admin/adminlogin");
  };

const adminpanel = (req, res) => {
  return res.render("admin/adminpanel");
};

const adminlogindata = (req, res, next) => {
    passport.authenticate('admin', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Authentication failed
            return res.render('admin/adminlogin', { message: 'error' });
        }
        // Authentication successful, log in the user
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/adminpanel');
        });
    })(req, res, next);
};
  

const category = async (req, res) => {
  try {
    let categoryName = await categoryTbl.find({});
    return res.render("admin/category", {
      category: categoryName,
    });
  } catch (err) {
    console.log(err);
    return false;
  }
};

const categoryAdd = async (req, res) => {
  try {
    const { category, minPrice } = req.body;
    let img = "";
    if (req.file) {
      img = req.file.path;
    }
    let categorydata = await categoryTbl.create({
      category: category,
      img: img,
      minPrice: minPrice,
    });
    if (categorydata) {
      return res.redirect("/category");
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const deletecategory = async (req, res) => {
    try {
      let data = await categoryTbl.findByIdAndDelete(req.query.id);
      fs.unlinkSync(data.img);
      if (data) {
        console.log("category is Deleted");
        // Send a JSON response indicating success
        return res.render("back");
      } else {
        console.log("category is not deleted");
        // Send a JSON response indicating failure
        return res.json({ success: false, message: "Failed to delete category" });
      }
    } catch (err) {
      console.log(err);
      // Send a JSON response indicating failure
      return res.json({ success: false, message: "Error deleting category" });
    }
  };

const editcategory = async (req, res) => {
  try {
    const { id, category } = req.body;
    if (req.file) {
      let imagedata = await categoryTbl.findById(id);
      if (imagedata) {
        fs.unlinkSync(imagedata.img);
        let img = req.file.path;
        let updatedata = await categoryTbl.findByIdAndUpdate(id, {
          category: category,
          img: img,
        });
        if (updatedata) {
          console.log("Record successfully Updated");
          return res.redirect("/category");
        } else {
          console.log("Record not Updated");
          return res.redirect("back");
        }
      }
    } else {
      let imageupdate = await categoryTbl.findById(id);
      if (imageupdate) {
        let img = imageupdate.path;
        let updatedata = await categoryTbl.findByIdAndUpdate(id, {
          category: category,
          img: img,
        });
        if (updatedata) {
          console.log("Record successfully Updated");
          return res.redirect("/category");
        } else {
          console.log("Record not Updated");
          return res.redirect("back");
        }
      }
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const theme = async (req, res) => {
  try {
    let data = await categoryTbl.find({});
    let themedata = await themeTbl
      .find({})
      .populate("categoryId")
    if (data) {
      return res.render("admin/theme", {
        category: data,
        themedata,
      });
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadImage = multer({ storage: storage }).fields([
  { name: "img", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

const themeAdd = async (req, res) => {
  try {
    const { theme, price, description, categoryId } = req.body;
    let img = "";
    let images = [];

    const categoryData = await categoryTbl.findById(categoryId);
    const categoryName = categoryData ? categoryData.category : "";

    if (req.files) {
      if (req.files["img"] && req.files["img"][0]) {
        img = req.files["img"][0].filename;
      }

      if (req.files["images"] && req.files["images"].length > 0) {
        images = req.files["images"].map((file) => file.filename);
      }

      // Check if required fields are present
      if (theme && price && description) {
        const imgUpload = new themeTbl({
          img: img,
          images: images,
          categoryId: categoryId,
          categoryName: categoryName,
          theme: theme,
          price: price,
          description: description,
        });

        await imgUpload.save();

        return res.redirect("/theme");
      } else {
        return res.status(400).send("Required fields are missing");
      }
    } else {
      return res.status(400).send("No images were provided");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

const deletetheme = async (req, res) => {
  try {
    let data = await themeTbl.findByIdAndDelete(req.query.id);
    fs.unlinkSync(data.img);
    fs.unlinkSync(data.images[0]);
    fs.unlinkSync(data.images[1]);
    fs.unlinkSync(data.images[2]);
    fs.unlinkSync(data.images[3]);

    if (data) {
      console.log("Theme is Deleted");
      return res.redirect("back");
    } else {
      console.log("Theme is not deleted");
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const editTheme = async (req, res) => {
  try {
    const { id, categoryId, theme, price, description } =
      req.body;
    let themdata = await themeTbl.find({});
    let img = "";
    let images = [];

    if (req.file) {
      // Handle main image
      let imagedata = await themeTbl.findById(id);
      if (imagedata) {
        fs.unlinkSync(imagedata.img);
        img = req.file.path;
      }
    } else {
      img = themdata.img;
    }

    if (req.files && req.files.images && req.files.images.length > 0) {
      // Handle extra images
      images = req.files.images.map((file) => file.path);
    } else {
      images = themdata.images;
    }

    let updatedata = await themeTbl.findByIdAndUpdate(id, {
      categoryId: categoryId,
      img: img,
      theme: theme,
      price: price,
      description: description,
      images: images,
    });

    if (updatedata) {
      console.log("Record successfully Updated");
      return res.redirect("/theme");
    } else {
      console.log("Record not Updated");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

const user = async (req, res) => {
  try {
    let userData = await registertbl.find({});
    let contactData = await contactTbl.find({});
    let inquiryData = await Inquiry.find({});
    if (userData && contactData && inquiryData) {
      return res.render("admin/user", {
        user: userData,
        contact: contactData,
        inquiry: inquiryData,
      });
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  index,
  register,
  registerdata,
  otpcode,
  userRegister,
  login,
  logindata,
  forgetpassword,
  fpassword,
  otp,
  otpdata,
  resetpassword,
  npassword,
  logout,
  contact,
  contactData,
  inquiry,
  about,
  blog,
  wedding,
  event,

  adminpanel,
  adminlogin,
  uploadImage,

  adminlogindata,
  category,
  categoryAdd,
  deletecategory,
  editcategory,
  theme,
  themeAdd,
  editTheme,
  deletetheme,
  user,
};
