const mongoose = require("mongoose");

const themeschema = mongoose.Schema({
  theme: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  categoryName: {
    type: String,
    required: false,
  },
  img: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    required: true,
  },
});

const theme = mongoose.model("theme", themeschema);

module.exports = theme;
