const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        default: '----Not available----'
    },
    cat: {
        type: String,
        enum: ['Stationary','Electronic Gadgets','Bicycles','Clothes','Sports','Others','Books'],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 10
    },
    bid: {
        type: Boolean,
        default: false
    },
    max_bid:{
        type: Number,
        max: 100000,
        default: 100000
    },
    incr:{
        type: Number,
        min: 10,
        max: 10000
    },
    sold: {
        type: Boolean,
        default: false
    },
    approved: {
        type: Boolean,
        default: false
    },
    views: {
       type: Number,
        default: 1
    },
    images: [
        {
            type: String,
            default: ''
        }
    ]
}, {
    timestamps: true
});
var Products = mongoose.model('Product',productSchema);

module.exports=Products;