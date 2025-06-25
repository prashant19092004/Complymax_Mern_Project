const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    establishment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    supervisor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supervisor",
        required: true
    },
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reportingManager: {
        type: String,
        default: ""
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    },
    leaveType: {
        type: String,
        enum: ['Earned', 'Casual', 'Medical'],
        required: true
    },
    leaveSubType: {
        type: String,
        enum: ['Full Day', 'First Half', 'Second Half'],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    respondedByEstablishment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    respondedBySupervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supervisor"
    },
    respondedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
leaveSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;