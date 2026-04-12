const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    user: String,
    amount: Number,
    status: {
        type: String,
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Payment", PaymentSchema);
