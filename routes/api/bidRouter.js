var express = require('express');
const bodyParser = require('body-parser');
const bidRouter = express.Router();
const mongoose=require('mongoose');

var Bid = require('../../models/bids');
var Products = require('../../models/products');
var Users = require('../../models/users');

var passport = require('passport');
var authenticate = require('../../authenticate');

const cors = require('../cors');

bidRouter.use(bodyParser.json());

bidRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, 
                  function(req, res, next) {
                    Bid.find({})
                    .populate('bidder')
                    .populate('product')
                    .sort({amount: -1})
                      .then((bids)=>{
                          res.statusCode=200;
                          res.setHeader('Content-Type','application/json');
                          res.json(bids);
                      },(err)=>(next(err)))
                      .catch((err)=>(next(err)))
                  }
)

.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Products.findById(req.body.product)
    .then((requiredProduct)=>{
        Users.findById(req.body.bidder)
        .then((requiredUser)=>{
         givenAmount=req.body.amount;
         if(givenAmount<requiredProduct.price||givenAmount>requiredProduct.max_bid||(givenAmount-requiredProduct.price)%requiredProduct.incr!==0){
         err = new Error(`Ensure the bid amount exceeds the price of product and is within the limit of Max-Bid and incr 
         is valid`);
         err.status = 401;
         return next(err);
        }
            if(!requiredProduct){
                err = new Error("Product doesn't exist");
                err.status = 400;
                return next(err);
           }
            else if(!requiredUser){
                 err = new Error("Bidder doesn't exist");
                        err.status = 400;
                        return next(err);
                   }
            else if(requiredProduct._id&&requiredUser._id&&!requiredProduct.sold) {
                if(!requiredProduct.bid)
                {
                    err = new Error("Bidding freezed by the owner");
                    err.status = 400;
                    return next(err);
                }
                else if(!requiredProduct.bid)
                {
                    err = new Error("Bidding freezed by the owner");
                    err.status = 400;
                    return next(err);
                }
            else {
             Bid.create(req.body)
                .then((bid_unpopulated)=>{
                    Bid.findById(bid_unpopulated._id)
                    .populate('bidder')
                    .populate('product')
                    .then((bid)=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(bid);    
                    },(err)=>(next(err)))
                    .catch((err)=>(next(err)))
                },(err)=>(next(err)))
                .catch((err)=>(next(err))) 
            }
            }
        },(err)=>(next(err)))
        .catch((err)=>(next(err))) 
                  
    },(err)=>(next(err)))
    .catch((err)=>(next(err))) 

})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /bids');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    //res.statusCode = 403;
    //res.end('DELETE operation not supported on /bids');
    Bid.remove({})
    .then((resp) => {
        console.log("Removed All Bid");
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

bidRouter.route('/bidder/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Bid.find({bidder: req.user._id})
    .populate('bidder')
    .populate('product')
    .then((bid)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(bid);
       
    },(err)=>(next(err)))
    .catch((err)=>(next(err)))
})


bidRouter.route('/:bidId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Bid.findById(req.params.bidId)
    .populate('bidder')
    .populate('product')
    .then((bid)=>{
        if(bid&&(bid.bidder._id===req.user._id||req.user.admin))
       { res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(bid);
       }
       else if(!bid){
        err = new Error(`Bid not found`);
        err.status = 404;
        return next(err);

    }
       else{
        err = new Error(`Unauthorised`);
        err.status = 401;
        return next(err);

       }
    },(err)=>(next(err)))
    .catch((err)=>(next(err)))
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /bids/'+ req.params.bidId);
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /bids/'+ req.params.bidId);
})

.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Bid.findById(req.params.bidId)
    .then((bid)=>{
    
    Products.findById(bid.product)
    .then((requiredProduct)=>{
        givenAmount=req.body.amount;
        if(!(bid.bidder.equals(req.user._id))){
            console.log('\n'+bid.bidder+'   '+req.user._id);
            err = new Error(`Unauthorised`);
            err.status = 401;
            return next(err);    
        }
        else if(givenAmount<requiredProduct.price||givenAmount>requiredProduct.max_bid||(givenAmount-requiredProduct.price)%requiredProduct.incr!==0){
            err = new Error(`Ensure the bid amount exceeds the price of product and is within the limit of Max-Bid and incr 
            is valid`);
            err.status = 401;
            return next(err);
    
        }
        Bid.findByIdAndUpdate(req.params.bidId,{
            $set: {amount: givenAmount}
        },{new: true})
        .populate('bidder')
        .populate('product')
        .then((bid) => {
            res.statusCode=200;
            res.json(bid);
       }, (err) => next(err))
       .catch((err) => res.status(400).json({success: false,message: "Bid not Updated"}));
    
    }, (err) => next(err))
    .catch((err) => res.status(400).json({success: false,message: "Product not found"}));
 
   
   }, (err) => next(err))
   .catch((err) => res.status(400).json({success: false,message: "Bid not found"}))
})


module.exports = bidRouter;