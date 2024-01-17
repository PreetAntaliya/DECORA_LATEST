const express = require('express');
const router = express.Router();
const indexController = require('../controller/indexcontroller');
const User = require('../model/form');
const theme = require('../model/theme');
const category = require('../model/category');
const contact = require('../model/contact');
const inquiry = require('../model/inquiry');
const { validationResult } = require('express-validator');
const cors = require('cors');
router.use(cors());

// Middleware to check the pass

const authenticate = (req, res, next) => {
    const providedPassword = req.query.providedPassword;
    const expectedPassword = 'Decora957438'; // Change this to your actual expected password
    if (providedPassword === expectedPassword) {
      // Authentication successful, move to the next middleware or route handler
      next();
    } else {
      // Authentication failed
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

// Get all users
router.get('/user', authenticate, async (req, res) => {
  try {
      const users = await User.find();

      // Customize the response based on your user data structure
      const userArray = users.map(user => ({
          // userId: user._id, // Assuming you have an _id field in your User model
          username: user.fname + ' ' + user.lname,
          email: user.email,
          password: user.password,
          gender: user.gender,
          contact: user.contact,
          address: user.address,
          state: user.state,
          zip : user.zipcode,
          role: user.role,
      }));

      // res.json(userArray);
      res.header('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify(userArray, null, 2));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/user', async (req, res) => {
  try {
    const { fname, lname, email, password, gender, contact, address, state, role, zipcode } = req.body;

    const newUser = new User({
      fname,
      lname,
      email,
      password,
      gender,
      contact,
      address,
      state,
      role,
      zipcode
    });

    await newUser.save();

    res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});


// Product (Theme) category API
router.get('/category', authenticate, async (req, res) => {
  try {
    const categories = await category.find();
    const themes = await theme.find().populate('categoryId');

    const categoryArray = categories.map(categoryItem => {
      const categoryThemes = themes
        .filter(theme => theme.categoryId && theme.categoryId._id.toString() === categoryItem._id.toString())
        .map(theme => ({
          themeId: theme._id,
          name: theme.theme,
          price: theme.price,
          categoryId: theme.categoryId ? theme.categoryId._id : '',
          category: theme.categoryId ? theme.categoryId.category : '',
          img: `https://decoraevnt.online/uploads/${encodeURIComponent(theme.img.replace(/\\/g, '/'))}`,
          description: theme.description,
          images: theme.images.map(image => `https://decoraevnt.online/uploads/${image.replace(/\\/g, '/')}`),
        }));

      return {
        themeId: categoryItem._id,
        name: categoryItem.category,
        categoryId: categoryItem.categoryId,
        minPrice: categoryItem.minPrice,
        img: categoryItem.img ? `https://decoraevnt.online/${categoryItem.img.replace(/\\/g, '/')}` : '',
        themes: categoryThemes,
      };
    });

    res.header('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(categoryArray, null, 2));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Product (Theme) API
router.get('/theme', authenticate, async (req, res) => {
  try {
    const themes = await theme.find().populate('categoryId');

    const themeArray = themes.map(theme => ({
      themeId: theme._id,
      name: theme.theme,
      price: theme.price,
      categoryId: theme.categoryId ? theme.categoryId._id : '', // Access the category ID
      category: theme.categoryId ? theme.categoryId.category : '', // Access the category name
      img: `https://decoraevnt.online/uploads/${encodeURIComponent(theme.img.replace(/\\/g, '/'))}`,
      description: theme.description,
      images: theme.images.map(image => `https://decoraevnt.online/uploads/${(image.replace(/\\/g, '/'))}`),
    }));

    res.header('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(themeArray, null, 2));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});







// Contact API
router.get('/contact', authenticate, async (req, res) => {
  try {
    const contacts = await contact.find();

    const contactArray = contacts.map(contactItem => ({
      ContactId: contactItem._id,
      name: contactItem.fname + ' ' + contactItem.lname,
      email: contactItem.email,
      message: contactItem.contact_text,
    }));

    res.header('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(contactArray, null, 2));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// inq contact API
router.get('/inq', authenticate, async (req, res) => {
  try {
    const inquirys = await inquiry.find();

    const inquiryArray = inquirys.map(inquiryItem => ({
      ContactId: inquiryItem._id,
      name: inquiryItem.name,
      email: inquiryItem.email,
      mobile: inquiryItem.mobile,
    }));

    res.header('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(inquiryArray, null, 2));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
