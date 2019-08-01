const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bidSchema = new Schema({
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 10
    }
}, {
    timestamps: true
});
var Bids = mongoose.model('Bid',bidSchema);

module.exports=Bids;