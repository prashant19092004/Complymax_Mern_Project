const mongoose = require("mongoose");

const offerLetterSchema = new mongoose.Schema(
  {
    // Reference IDs
    establishmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hiredId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hired",
      required: true,
    },
    hiringId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hiring",
      required: true,
    },
    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supervisor",
      required: true,
    },

    // Document Status
    status: {
      type: String,
      enum: ["draft", "sent", "accepted", "rejected"],
      default: "draft",
    },
    acceptanceDate: {
      type: Date,
    },

    // Offer Letter Content
    letterContent: {
      // Company Information
      companyInfo: {
        name: {
          type: String,
          default: "",
        },
        address: {
          type: String,
          default: "",
        },
        email: {
          type: String,
          default: "",
        },
        phone: {
          type: String,
          default: "",
        },
      },
      title: {
        type: String,
        default: "Offer Letter",
      },
      content: {
        type: String,
        required: true,
      },
      signatures: {
        company: {
          title: {
            type: String,
            default: "",
          },
          designation: {
            type: String,
            default: "Authorized Signatory",
          },
        },
        employee: {
          name: {
            type: String,
            default: "",
          },
          designation: {
            type: String,
            default: "Receiving Signature",
          },
        },
      },
    },

    // Document Styling
    documentStyle: {
      logoPosition: {
        x: { type: Number, default: 20 },
        y: { type: Number, default: 20 },
        width: { type: Number, default: 150 },
        height: { type: Number, default: 100 },
      },
      signaturePosition: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        width: { type: Number, default: 150 },
        height: { type: Number, default: 80 },
      },
      employeeSignaturePosition: {
        x: {
          type: Number,
          default: 0,
        },
        y: {
          type: Number,
          default: 0,
        },
      },
      fontSize: {
        type: String,
        default: "16px",
      },
      fontFamily: {
        type: String,
        default: "Arial, sans-serif",
      },
    },

    // Document Assets
    assets: {
      logo: {
        type: String, // URL or path to the logo
      },
      signature: {
        type: String, // URL or path to the signature
      },
      employeeSignature: {
        type: String,
        default: null,
      },
    },

    // Document Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },

    // Additional Fields
    isActive: {
      type: Boolean,
      default: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    comments: [
      {
        text: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    employeeSignaturePosition: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
offerLetterSchema.index({ establishmentId: 1, userId: 1 });
offerLetterSchema.index({ status: 1 });
offerLetterSchema.index({ createdAt: -1 });

// Pre-save middleware to update the updatedAt field
offerLetterSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Instance method to generate offer letter version
offerLetterSchema.methods.createNewVersion = function () {
  this.version += 1;
  return this.save();
};

// Static method to find active offer letters
offerLetterSchema.statics.findActiveOffers = function () {
  return this.find({ isActive: true }).sort({ createdAt: -1 });
};

const OfferLetter = mongoose.model("OfferLetter", offerLetterSchema);

module.exports = OfferLetter;
