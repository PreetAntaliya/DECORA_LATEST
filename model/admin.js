const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

const Admin = mongoose.model('Admin', adminSchema);

// Check if an admin document already exists
Admin.countDocuments({})
    .then(count => {
        // If no admin document exists, create one
        if (count === 0) {
            return Admin.create({
                email: 'decora.evnt@gmail.com',
                password: 'Deco21Ra',
                role: 'admin'
            });
        } else {
            return null;
        }
    })
    .then(newDocument => { 
        if (newDocument) {
            console.log('Admin document created:', newDocument);
        }
    })
    .catch(error => {
        console.error('Error checking/creating admin document:', error);
    });

module.exports = Admin;
