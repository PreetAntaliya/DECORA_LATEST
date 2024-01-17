// models/inquiry.js
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  }
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;
