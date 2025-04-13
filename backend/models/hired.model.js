const mongoose = require('mongoose');

const hiredSchema = new mongoose.Schema({
    hiring_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hiring'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    employeeId: {
        type: Number,
        unique: true
    },
    supervisor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supervisor'
    },
    establishment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: '1'
    },
    date_of_joining: {
        type: Date
    },
    date_of_joining_status: {
        type: Boolean,
        default: false
    },
    pf_esic_status: {
        type: Boolean,
        default: false
    },
    basic: {
        type: String
    },
    da: {
        type: String
    },
    hra: {
        type: String
    },
    other_allowance: {
        type: String
    },
    leave_with_wages: {
        type: String
    },
    wages_status: {
        type: Boolean,
        default: false
    },
    active_user_status: {
        type: Boolean,
        default: false
    },
    uan_number: {
        type: String
    },
    epf_number: {
        type: String
    },
    esi_number: {
        type: String
    },
    file1: {
        type: String
    },
    file2: {
        type: String
    },
    offerLetterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfferLetter'
    },
    offerLetterStatus: {
        type: String,
        enum: ['pending', 'offer_sent', 'offer_accepted', 'offer_rejected'],
        default: 'pending'
    }
});

module.exports = mongoose.model("Hired", hiredSchema);
