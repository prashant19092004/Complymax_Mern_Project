const mongoose = require('mongoose');

const offerLetterSchema = new mongoose.Schema({
    // Reference IDs
    establishmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Establishment',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hiredId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hired',
        required: true
    },
    hiringId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    supervisorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supervisor',
        required: true
    },

    // Offer Letter Content
    letterContent: {
        // Company Information
        companyInfo: {
            name: {
                type: String,
                default: ''
            },
            address: {
                type: String,
                default: ''
            },
            email: {
                type: String,
                default: ''
            },
            phone: {
                type: String,
                default: ''
            }
        },

        // Employee Information
        employeeInfo: {
            name: {
                type: String,
                default: ''
            },
            country: {
                type: String,
                default: ''
            },
            loc: {
                type: String,
                default: ''
            },
            state: {
                type: String,
                default: ''
            },
            street: {
                type: String,
                default: ''
            },
            dob: {
                type: String,
                default: ''
            },
            gender: {
                type: String,
                default: ''
            },
            zip: {
                type: String,
                default: ''
            }
        },

        // Letter Details
        letterDate: {
            type: String,
            default: new Date().toISOString()
        },

        // Offer Content Sections
        salutation: {
            type: String,
            default: "Dear"
        },

        congratsMessage: {
            type: String,
            default: "Congratulations! We are pleased to confirm that you have been selected to work for"
        },

        offerDetails: {
            position: {
                type: String,
                default: ''
            },
            salary: {
                type: String,
                default: ''
            },
            incentive: {
                type: String,
                default: "0"
            },
            reportingTo: {
                type: String,
                default: ''
            },
            workingHours: {
                type: String,
                default: ''
            },
            workDays: {
                startDay: String,
                endDay: String
            }
        },

        benefits: [{
            type: String,
            default: ["Employer State Insurance Corporation (ESIC) Coverage"]
        }],

        joiningInstructions: {
            date: String,
            time: String,
            reportingPerson: String
        },

        acceptanceInstructions: {
            returnDate: String
        },

        closingMessage: {
            type: String,
            default: "We are confident that you will make a significant contribution to the success of our company and look forward to working with you."
        },

        signatures: {
            company: {
                title: String,
                name: String,
                designation: String
            },
            employee: {
                name: String,
                signatureDate: Date
            }
        }
    },

    // Document Styling
    documentStyle: {
        logoPosition: {
            x: { type: Number, default: 20 },
            y: { type: Number, default: 20 },
            width: { type: Number, default: 150 },
            height: { type: Number, default: 100 }
        },
        signaturePosition: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
            width: { type: Number, default: 150 },
            height: { type: Number, default: 80 }
        },
        fontSize: {
            type: String,
            default: "16px"
        },
        fontFamily: {
            type: String,
            default: "Arial, sans-serif"
        }
    },

    // Document Assets
    assets: {
        logo: {
            type: String,  // URL or path to the logo
        },
        signature: {
            type: String,  // URL or path to the signature
        }
    },

    // Document Status
    status: {
        type: String,
        enum: ['draft', 'sent', 'accepted', 'rejected'],
        default: 'draft'
    },
    acceptanceDate: {
        type: Date
    },
    
    // Document Metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    
    // Additional Fields
    isActive: {
        type: Boolean,
        default: true
    },
    version: {
        type: Number,
        default: 1
    },
    comments: [{
        text: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Add indexes for better query performance
offerLetterSchema.index({ establishmentId: 1, userId: 1 });
offerLetterSchema.index({ status: 1 });
offerLetterSchema.index({ createdAt: -1 });

// Pre-save middleware to update the updatedAt field
offerLetterSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Instance method to generate offer letter version
offerLetterSchema.methods.createNewVersion = function() {
    this.version += 1;
    return this.save();
};

// Static method to find active offer letters
offerLetterSchema.statics.findActiveOffers = function() {
    return this.find({ isActive: true }).sort({ createdAt: -1 });
};

const OfferLetter = mongoose.model('OfferLetter', offerLetterSchema);

module.exports = OfferLetter; 