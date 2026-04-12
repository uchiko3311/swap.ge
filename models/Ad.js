const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    desc: {
        type: String,
        required: true
    },

    images: {
        type: [String],
        default: []
    },

    vip: {
        type: Boolean,
        default: false
    },

    user: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Ad", AdSchema);
