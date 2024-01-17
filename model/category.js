// category.js

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    minPrice: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    }
    
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
