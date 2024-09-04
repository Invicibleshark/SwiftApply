const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    companyname: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Success', 'Failure'], 
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, { 
    timestamps: true
});

// This  ensures that the combination of owner and companyname is unique

companySchema.index({ owner: 1, companyname: 1 }, { unique: true });

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);

module.exports = Company;
