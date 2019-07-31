const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

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
    ammount: {
        type: Currency,
        required: true,
        min: 10
    }
}, {
    timestamps: true
});
var Bids = mongoose.model('Bid',bidSchema);

module.exports=Bids;