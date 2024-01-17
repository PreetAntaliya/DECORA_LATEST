const mongoose = require('mongoose');

const userschema = mongoose.Schema({
    fname: {
        type: String,
        required: false
    },
    lname: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    contact: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    zipcode: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: false
    }
})

const user = mongoose.model('user', userschema);

module.exports = user;