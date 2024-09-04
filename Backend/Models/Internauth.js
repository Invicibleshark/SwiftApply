const mongoose = require('mongoose');

const InternauthSchema = new mongoose.Schema({
    Internemail: {
        type: String,
        required: true,
    },
    Internpassword: {
        type: String,
        required: true,
    },
    coverletter:{
        type:String,
        required:true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        unique: true
    }
}, { timestamps: true });

// Check if the model is already registered to avoid OverwriteModelError
const Internauth = mongoose.models.Internauth || mongoose.model('Internauth', InternauthSchema);

module.exports = Internauth;
